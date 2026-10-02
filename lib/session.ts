import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "zl_session";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  "zealand-labs-hmac-sha256-production-session-secret-local-2026";

export interface SessionData {
  adminId: string;
  role: string;
  username: string;
  issuedAt: number;
}

/**
 * Creates an HMAC-SHA256 cryptographically signed session token.
 */
export function createSessionToken(data: {
  adminId: string;
  role: string;
  username: string;
}): string {
  const issuedAt = Date.now();
  const payload = Buffer.from(
    JSON.stringify({
      adminId: data.adminId,
      role: data.role,
      username: data.username,
      issuedAt,
    })
  ).toString("base64url");

  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(payload);
  const signature = hmac.digest("base64url");

  return `${payload}.${signature}`;
}

/**
 * Validates and decodes an HMAC-signed session token.
 * Returns null if the token has been tampered with or has expired.
 */
export function verifySessionToken(token: string): SessionData | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;

  // 1. Verify HMAC signature using timing-safe comparison
  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(payload);
  const expectedSignature = hmac.digest("base64url");

  try {
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    // 2. Decode payload
    const jsonStr = Buffer.from(payload, "base64url").toString("utf-8");
    const data = JSON.parse(jsonStr) as SessionData;

    // 3. Expiration check
    if (!data.issuedAt || Date.now() - data.issuedAt > SESSION_MAX_AGE_MS) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Sets the signed session cookie with strict security flags.
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_MAX_AGE_MS / 1000),
  });
}

/**
 * Removes the session cookie.
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Reads and verifies the current session token from cookies.
 */
export async function getVerifiedSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie?.value) return null;

  return verifySessionToken(cookie.value);
}
