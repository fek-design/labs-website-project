"use client";

import React, { useState, useEffect } from "react";
import { loginAdmin, logoutAdmin, getAuthSession } from "@/app/actions/auth";
import { motion } from "motion/react";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
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
      setErrorMsg(err.message || "Kunne ikke godkende legitimationsoplysninger.");
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
          <span>Verificerer lokal sikkerhedstoken...</span>
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
            <div className="w-12 h-12 rounded-full bg-[#FFED00] flex items-center justify-center text-black font-extrabold text-base mx-auto mb-3 font-notch">
              ZL
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight uppercase font-notch">
              Personale Login
            </h1>
            <p className="text-xs text-zinc-400 font-headline">
              Zealand Labs Offline Administrationsprotokol (Køge)
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-[#E6007E]/10 border border-[#E6007E]/30 rounded-2xl text-xs text-[#E6007E] font-headline font-bold">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-text">
            <div>
              <label className="text-zinc-400 block mb-1 font-bold uppercase tracking-wider text-[10px] font-headline">
                Brugernavn
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Indtast brugernavn"
                className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#555555] text-white rounded-xl p-3 outline-none font-bold"
                required
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-bold uppercase tracking-wider text-[10px] font-headline">
                Adgangskode
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#555555] text-white rounded-xl p-3 outline-none font-bold"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#FFED00] hover:bg-[#ffe600] text-black font-headline font-bold rounded-full transition-transform hover:scale-[1.01] active:scale-[0.99] mt-2 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Logger ind...</span>
                </>
              ) : (
                "Log ind"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Authenticated: Render children with logout capability
  return <>{children}</>;
}
