"use client";

import React, { useState, useEffect } from "react";
import { getAdminProfile, updateAdminCredentials } from "@/app/actions/settings";
import { Buildings, Check, ShieldCheck, UserCheck } from "@phosphor-icons/react";
import { CAMPUS_LOCATIONS } from "@/components/admin/AdminSidebarNav";

interface AdminSettingsViewProps {
  activeLab?: "medialab" | "makerspace";
  onSelectLab?: (lab: "medialab" | "makerspace") => void;
}

export function AdminSettingsView({
  activeLab = "medialab",
  onSelectLab,
}: AdminSettingsViewProps) {
  const [profile, setProfile] = useState<any | null>(null);
  const [adminName, setAdminName] = useState<string>("Admin");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [assignedCampus, setAssignedCampus] = useState("Køge Campus");
  const [assignedLabSlug, setAssignedLabSlug] = useState<"medialab" | "makerspace">("medialab");
  const [statusMsg, setStatusMsg] = useState<{ type: "SUCCESS" | "ERROR"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAdminProfile()
      .then((res) => {
        if (res) {
          setProfile(res);
          setNewUsername(res.username);
          if (res.assignedCampus) setAssignedCampus(res.assignedCampus);
          if (res.assignedLabSlug === "medialab" || res.assignedLabSlug === "makerspace") {
            setAssignedLabSlug(res.assignedLabSlug);
          }
          const formatted = res.username.charAt(0).toUpperCase() + res.username.slice(1);
          setAdminName(formatted);
        }
      })
      .catch((err) => {
        console.error("Fejl ved hentning af admin profil:", err);
      });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setStatusMsg({ type: "ERROR", text: "Adgangskoderne stemmer ikke overens." });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await updateAdminCredentials({
        adminId: profile?.id,
        newUsername: newUsername.trim() || undefined,
        newPassword: newPassword.trim() || undefined,
        assignedCampus: assignedCampus.trim() || undefined,
        assignedLabSlug: assignedLabSlug,
      });

      if (res.success) {
        setStatusMsg({ type: "SUCCESS", text: "Administratoroplysninger og lokationstildeling opdateret!" });
        setNewPassword("");
        setConfirmPassword("");
        if (profile) {
          setProfile({
            ...profile,
            username: res.username,
            assignedCampus: res.assignedCampus,
            assignedLabSlug: res.assignedLabSlug,
          });
          const formatted = res.username.charAt(0).toUpperCase() + res.username.slice(1);
          setAdminName(formatted);
          if (res.assignedLabSlug === "medialab" || res.assignedLabSlug === "makerspace") {
            onSelectLab?.(res.assignedLabSlug);
          }
        }
      }
    } catch (err: any) {
      setStatusMsg({ type: "ERROR", text: err.message || "Kunne ikke opdatere oplysninger." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full text-white font-mono space-y-6">
      {/* 1. Canonical Admin Page Header Standard (AGENTS.md) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black font-notch tracking-tight flex items-baseline gap-1">
            <span className="text-white">LABS</span>
            <span className="text-[#E6007E]">Indstillinger</span>
          </h1>
          <p className="text-sm font-headline font-bold text-zinc-400 mt-1">
            Velkommen, {adminName}
          </p>
        </div>

        {/* Right: Telemetry Context Cluster */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#151517] border border-[#333333]">
            <Buildings size={18} weight="bold" className="text-[#009FE3]" />
            <div>
              <div className="text-[10px] uppercase font-headline text-zinc-400 tracking-wider">Aktivt Campus</div>
              <div className="text-xs font-bold font-notch text-white">{assignedCampus}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#151517] border border-[#333333]">
            <ShieldCheck size={18} weight="bold" className="text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase font-headline text-zinc-400 tracking-wider">Node Status</div>
              <div className="text-xs font-bold font-notch text-emerald-400">Zero-Cloud Lokal</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Settings Container */}
      <div className="bg-[#151517] border border-[#333333] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8 max-w-4xl">
        {/* Toast Alert */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs font-headline font-bold border flex items-center gap-2 ${
              statusMsg.type === "SUCCESS"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-[#E6007E]/10 border-[#E6007E]/30 text-[#E6007E]"
            }`}
          >
            {statusMsg.type === "SUCCESS" ? (
              <Check size={16} weight="bold" />
            ) : null}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* SECTION 1: Campus & Facility Management (Hierarchical Session Switcher) */}
        <div className="bg-[#202021] border border-[#444444] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#333333] pb-3">
            <div>
              <h2 className="text-base font-bold font-headline text-white flex items-center gap-2">
                <Buildings size={18} weight="bold" className="text-[#009FE3]" />
                <span>Lokalitet & Arbejdsstation (Aktiv Session)</span>
              </h2>
              <p className="text-xs text-zinc-400 font-text mt-0.5">
                Vælg hvilken facilitet på Køge Campus din aktuelle session administrerer.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#E6007E] bg-[#E6007E]/10 border border-[#E6007E]/30 px-2.5 py-1 rounded-full w-fit">
              Køge Campus
            </span>
          </div>

          <div className="space-y-3">
            {CAMPUS_LOCATIONS.map((campus) => (
              <div key={campus.id} className="space-y-2">
                <div className="text-[11px] font-headline font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009FE3]" />
                  <span>{campus.name} Faciliteter:</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {campus.facilities.map((facility) => {
                    const isSelected = activeLab === facility.slug;
                    return (
                      <button
                        key={facility.slug}
                        type="button"
                        onClick={() => onSelectLab?.(facility.slug)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? "bg-[#E6007E] text-white shadow-md shadow-[#E6007E]/20 border border-[#E6007E]"
                            : "bg-[#151517] text-zinc-300 border border-[#333333] hover:border-zinc-500 hover:text-white"
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: facility.color }}
                        />
                        <span>{facility.name}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <p className="text-[11px] text-zinc-400 font-text pt-1">
              Sessionsskiftet opdaterer POS-dashboard, udstyrskatalog og maskinstatus i realtid.
            </p>
          </div>
        </div>

        {/* SECTION 2: User Location & Facility Assignment (Persisted on Admin Model) */}
        <div className="bg-[#202021] border border-[#444444] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#333333] pb-3">
            <div>
              <h2 className="text-base font-bold font-headline text-white flex items-center gap-2">
                <UserCheck size={18} weight="bold" className="text-[#E6007E]" />
                <span>Brugerens faste lokation & standardfacilitet</span>
              </h2>
              <p className="text-xs text-zinc-400 font-text mt-0.5">
                Tildel denne administrator en standardfacilitet, der automatisk indlæses ved login.
              </p>
            </div>
            <span className="bg-[#009FE3]/20 border border-[#009FE3]/40 text-[#009FE3] text-xs font-headline font-bold px-2.5 py-0.5 rounded-full">
              Tildelt profil
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-text">
            <div>
              <label className="text-zinc-300 block mb-1.5 font-headline font-bold">
                Tildelt Campus
              </label>
              <select
                value={assignedCampus}
                onChange={(e) => setAssignedCampus(e.target.value)}
                className="w-full bg-[#151517] border border-[#333333] focus:border-[#E6007E] text-white rounded-lg p-2.5 outline-none font-headline font-bold text-xs"
              >
                <option value="Køge Campus">Køge Campus (Zealand)</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-300 block mb-1.5 font-headline font-bold">
                Standard Facilitet
              </label>
              <select
                value={assignedLabSlug}
                onChange={(e) => setAssignedLabSlug(e.target.value as any)}
                className="w-full bg-[#151517] border border-[#333333] focus:border-[#E6007E] text-white rounded-lg p-2.5 outline-none font-headline font-bold text-xs"
              >
                <option value="medialab">MediaLab (Køge)</option>
                <option value="makerspace">Makerspace (Køge)</option>
              </select>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 font-text">
            Når denne administrator logger ind, initialiseres sessionen automatisk til den valgte standardfacilitet.
          </p>
        </div>

        {/* SECTION 3: Admin Credentials Form */}
        <div className="bg-[#202021] border border-[#444444] rounded-xl p-5 space-y-4">
          <div className="border-b border-[#333333] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-headline text-white">
                Administrator Adgangsoplysninger
              </h2>
              <p className="text-xs text-zinc-400 font-text mt-0.5">
                Opdater brugernavn og lokal adgangskode for denne administratorprofil.
              </p>
            </div>
            <span className="bg-[#009FE3]/20 border border-[#009FE3]/40 text-[#009FE3] text-xs font-headline font-bold px-2.5 py-0.5 rounded-full">
              {profile?.role || "ADMIN"}
            </span>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            {/* Username */}
            <div>
              <label className="text-zinc-300 block mb-1 font-headline font-bold">
                Administrator Brugernavn
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full bg-[#151517] border border-[#333333] focus:border-[#E6007E] text-white rounded-lg p-2.5 outline-none font-bold font-mono text-xs"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="text-zinc-300 block mb-1 font-headline font-bold">
                Ny Adgangskode (Lad stå tom for at bevare uændret)
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#151517] border border-[#333333] focus:border-[#E6007E] text-white rounded-lg p-2.5 outline-none font-mono text-xs"
              />
            </div>

            {/* Confirm Password */}
            {newPassword && (
              <div>
                <label className="text-zinc-300 block mb-1 font-headline font-bold">
                  Bekræft Ny Adgangskode
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#151517] border border-[#333333] focus:border-[#E6007E] text-white rounded-lg p-2.5 outline-none font-mono text-xs"
                />
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#E6007E] hover:bg-[#d00072] text-white font-headline font-bold rounded-full shadow-lg shadow-[#E6007E]/20 transition-transform hover:scale-[1.02] cursor-pointer"
              >
                {isSubmitting ? "Gemmer..." : "Gem Oplysninger & Lokation"}
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 4: System & Security Architecture Card */}
        <div className="bg-[#202021] border border-[#444444] rounded-xl p-5 space-y-3 text-xs">
          <div className="text-xs font-headline font-bold text-zinc-300 uppercase tracking-wider mb-2">
            System & Sikkerhedsarkitektur
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#151517] border border-[#333333]">
              <span className="text-zinc-400 font-text">Sikkerhedsprotokol:</span>
              <span className="text-emerald-400 font-bold font-mono">Zero-Cloud Local MySQL</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#151517] border border-[#333333]">
              <span className="text-zinc-400 font-text">Hashing:</span>
              <span className="text-zinc-200 font-bold font-mono">bcrypt (10 rounds)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#151517] border border-[#333333]">
              <span className="text-zinc-400 font-text">Tildelt Campus:</span>
              <span className="text-[#E6007E] font-bold font-mono">{assignedCampus}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#151517] border border-[#333333]">
              <span className="text-zinc-400 font-text">Aktiv Session:</span>
              <span className="text-[#009FE3] font-bold font-mono">
                {activeLab === "makerspace" ? "Makerspace (Køge)" : "MediaLab (Køge)"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
