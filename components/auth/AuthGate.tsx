"use client";

import React, { useState, useEffect } from "react";
import { loginAdmin, logoutAdmin, getAuthSession } from "@/app/actions/auth";
import { motion, AnimatePresence } from "motion/react";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [usernameInput, setUsernameInput] = useState("admin");
  const [passwordInput, setPasswordInput] = useState("pass");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAuthSession().then((session) => {
      setIsAuthenticated(session.isAuthenticated);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      setIsSubmitting(true);
      const res = await loginAdmin({
        username: usernameInput,
        password: passwordInput,
      });

      if (res.success) {
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to authenticate.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
  };

  // Initial loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center font-mono text-white">
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <div className="w-5 h-5 border-2 border-[#FFED00] border-t-transparent rounded-full animate-spin" />
          <span>Verifying Local Security Token...</span>
        </div>
      </div>
    );
  }

  // Not authenticated: Render Login Modal / Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 font-mono text-white selection:bg-[#E6007E]/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#141414] border border-[#262626] rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#FFED00] flex items-center justify-center text-black font-extrabold text-base mx-auto mb-3 shadow-lg shadow-[#FFED00]/20">
              ZL
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight uppercase">
              Staff Console Gate
            </h1>
            <p className="text-xs text-zinc-400">
              Zealand Labs Offline Management Protocol (Roskilde & Køge)
            </p>
          </div>

          {/* Preset Helper Notification */}
          <div className="bg-[#0D0D0D] border border-[#009FE3]/30 rounded-2xl p-3.5 text-xs text-zinc-300 space-y-1">
            <div className="text-[#009FE3] font-bold text-[11px] uppercase tracking-wider">
              Temporary Demo Credentials
            </div>
            <div className="flex justify-between text-[11px] pt-1">
              <span className="text-zinc-500">Username:</span>
              <span className="text-white font-bold">admin</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-500">Password:</span>
              <span className="text-white font-bold">pass</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-[#E6007E]/10 border border-[#E6007E]/30 rounded-2xl text-xs text-[#E6007E] font-bold">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">
                Username
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#FFED00] text-white rounded-xl p-3 outline-none font-bold"
                required
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#FFED00] text-white rounded-xl p-3 outline-none font-bold"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#FFED00] hover:bg-[#ffe600] text-black font-bold rounded-full shadow-lg shadow-[#FFED00]/20 transition-transform hover:scale-[1.01] active:scale-[0.99] mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Authenticating..." : "Unlock Admin Console →"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Authenticated: Render children with logout capability
  return <>{children}</>;
}
