"use client";

import React, { useState, useEffect } from "react";
import { getAdminProfile, updateAdminCredentials } from "@/app/actions/settings";
import { motion } from "motion/react";

export function AdminSettingsView() {
  const [profile, setProfile] = useState<any | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState<{ type: "SUCCESS" | "ERROR"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAdminProfile().then((res) => {
      if (res) {
        setProfile(res);
        setNewUsername(res.username);
      }
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setStatusMsg({ type: "ERROR", text: "Passwords do not match." });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await updateAdminCredentials({
        adminId: profile?.id,
        newUsername: newUsername.trim() || undefined,
        newPassword: newPassword.trim() || undefined,
      });

      if (res.success) {
        setStatusMsg({ type: "SUCCESS", text: "Credentials updated successfully!" });
        setNewPassword("");
        setConfirmPassword("");
        if (profile) setProfile({ ...profile, username: res.username });
      }
    } catch (err: any) {
      setStatusMsg({ type: "ERROR", text: err.message || "Failed to update credentials." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-2xl font-mono text-white max-w-2xl mx-auto">
      <div className="pb-6 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">Admin Console Settings</h2>
          <span className="bg-[#FFED00] text-black text-xs font-bold px-2.5 py-0.5 rounded-full">
            {profile?.role || "ADMIN"}
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Manage local administrator login credentials, security keys, and offline node profile
        </p>
      </div>

      {statusMsg && (
        <div
          className={`mt-4 p-3 rounded-2xl text-xs border ${
            statusMsg.type === "SUCCESS"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold"
              : "bg-[#E6007E]/10 border-[#E6007E]/30 text-[#E6007E]"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleUpdate} className="mt-6 space-y-4 text-xs">
        {/* Username */}
        <div>
          <label className="text-zinc-400 block mb-1 font-bold">Admin Username</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#FFED00] text-white rounded-xl p-3 outline-none font-bold"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="text-zinc-400 block mb-1 font-bold">
            New Password (Leave blank to keep unchanged)
          </label>
          <input
            type="password"
            placeholder="••••••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#FFED00] text-white rounded-xl p-3 outline-none"
          />
        </div>

        {/* Confirm Password */}
        {newPassword && (
          <div>
            <label className="text-zinc-400 block mb-1 font-bold">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#FFED00] text-white rounded-xl p-3 outline-none"
            />
          </div>
        )}

        {/* Zero Cloud Policy Badge */}
        <div className="p-4 bg-[#0D0D0D] border border-[#262626] rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">Security Architecture:</span>
            <span className="text-emerald-400 font-bold">Zero-Cloud Local MySQL Node</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">Hashing Protocol:</span>
            <span className="text-zinc-300 font-bold">bcrypt (10 rounds)</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">Active Campus:</span>
            <span className="text-[#FFED00] font-bold">Roskilde Campus</span>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#FFED00] hover:bg-[#ffe600] text-black font-bold rounded-full shadow-lg shadow-[#FFED00]/20 transition-transform hover:scale-[1.02]"
          >
            {isSubmitting ? "Saving..." : "Save Credentials"}
          </button>
        </div>
      </form>
    </div>
  );
}
