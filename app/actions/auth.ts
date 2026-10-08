"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getVerifiedSession,
} from "@/lib/session";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";

export async function loginAdmin(formData: { username: string; password: string }) {
  const clientId = await getClientIdentifier();
  const rateLimit = checkRateLimit(`auth:login:${clientId}`, 5, 300); // 5 attempts per 5 minutes (300s)
  if (!rateLimit.allowed) {
    throw new Error(
      `For mange login-forsøg. Vent venligst ${rateLimit.resetInSeconds} sekunder før næste forsøg.`
    );
  }

  const cleanUsername = formData.username.trim();
  const cleanPassword = formData.password.trim();

  // 1. Database lookup
  const admin = await prisma.admin.findUnique({
    where: { username: cleanUsername },
  });

  if (!admin || !admin.isActive) {
    throw new Error("Invalid administrator username or inactive account.");
  }

  // 2. Local bcrypt password verification
  const isMatch = await bcrypt.compare(cleanPassword, admin.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid password provided.");
  }

  // 3. Issue cryptographically signed HMAC-SHA256 session token
  const token = createSessionToken({
    adminId: admin.id,
    role: admin.role,
    username: admin.username,
  });

  await setSessionCookie(token);

  return { success: true, username: admin.username, role: admin.role };
}

export async function logoutAdmin() {
  await clearSessionCookie();
  return { success: true };
}

export async function getAuthSession() {
  const sessionData = await getVerifiedSession();

  if (!sessionData) {
    return { isAuthenticated: false, user: null };
  }

  // Verify in database that admin still exists and is active
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: sessionData.adminId },
      select: { id: true, username: true, role: true, isActive: true },
    });

    if (!admin || !admin.isActive) {
      await clearSessionCookie();
      return { isAuthenticated: false, user: null };
    }

    return {
      isAuthenticated: true,
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    };
  } catch {
    return { isAuthenticated: false, user: null };
  }
}
