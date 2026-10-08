import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createSessionToken, verifySessionToken, getSessionSecret } from "@/lib/session";
import bcrypt from "bcryptjs";

describe("Authentication & Session Security Tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.SESSION_SECRET = "test-secret-suite-key-2026-very-secure";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("HMAC Session Token Creation & Verification", () => {
    it("should issue a cryptographically verifiable token containing user payload", () => {
      const payload = {
        adminId: "admin-uuid-1234",
        role: "SUPER_ADMIN",
        username: "superadmin_test",
      };

      const token = createSessionToken(payload);
      expect(typeof token).toBe("string");
      expect(token.includes(".")).toBe(true);

      const verified = verifySessionToken(token);
      expect(verified).not.toBeNull();
      expect(verified?.adminId).toBe(payload.adminId);
      expect(verified?.role).toBe(payload.role);
      expect(verified?.username).toBe(payload.username);
    });

    it("should reject tampered payload or signature", () => {
      const payload = {
        adminId: "admin-uuid-1234",
        role: "TEACHER",
        username: "teacher_test",
      };

      const token = createSessionToken(payload);
      const [tokenPayload, signature] = token.split(".");

      // Tamper with payload by replacing TEACHER with SUPER_ADMIN
      const decodedPayload = JSON.parse(Buffer.from(tokenPayload, "base64url").toString("utf-8"));
      decodedPayload.role = "SUPER_ADMIN";
      const forgedPayload = Buffer.from(JSON.stringify(decodedPayload)).toString("base64url");
      const tamperedToken = `${forgedPayload}.${signature}`;

      const verified = verifySessionToken(tamperedToken);
      expect(verified).toBeNull();
    });

    it("should reject invalid, malformed, or empty tokens", () => {
      expect(verifySessionToken("")).toBeNull();
      expect(verifySessionToken("not-a-token")).toBeNull();
      expect(verifySessionToken("part1.part2.part3")).toBeNull();
    });

    it("should throw in production mode if SESSION_SECRET is unset", () => {
      (process.env as any).NODE_ENV = "production";
      delete process.env.SESSION_SECRET;

      expect(() => getSessionSecret()).toThrow(/SESSION_SECRET miljøvariabel mangler/);
    });
  });

  describe("Password Hashing & Bcrypt Verification", () => {
    it("should hash passwords securely and correctly verify matches", async () => {
      const rawPassword = "TestPassword2026!";
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(rawPassword, salt);

      expect(hash).not.toBe(rawPassword);
      expect(await bcrypt.compare(rawPassword, hash)).toBe(true);
      expect(await bcrypt.compare("WrongPassword", hash)).toBe(false);
    });
  });
});
