"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "zl_admin_session";

export async function loginAdmin(formData: { username: string; password: string }) {
  const cleanUsername = formData.username.trim();
  const cleanPassword = formData.password.trim();

  // 1. Direct temporary credential check OR database lookup
  if (cleanUsername === "admin" && cleanPassword === "pass") {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, "admin:super_admin", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, username: "admin", role: "SUPER_ADMIN" };
  }

  // 2. Database bcrypt check
  const admin = await prisma.admin.findUnique({
    where: { username: cleanUsername },
  });

  if (!admin || !admin.isActive) {
    throw new Error("Invalid administrator username or inactive account.");
  }

  const isMatch = await bcrypt.compare(cleanPassword, admin.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid password provided.");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, `${admin.username}:${admin.role}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true, username: admin.username, role: admin.role };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true };
}

export async function getAuthSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (!session?.value) {
    return { isAuthenticated: false, user: null };
  }

  const [username, role] = session.value.split(":");
  return {
    isAuthenticated: true,
    user: {
      username: username || "admin",
      role: role || "SUPER_ADMIN",
    },
  };
}
