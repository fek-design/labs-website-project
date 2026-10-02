"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  listOperators,
  createOperator,
  toggleOperatorActive,
  OperatorDTO,
} from "@/app/actions/users";
import { getAuthSession } from "@/app/actions/auth";
import { AnimatedCounter } from "@/components/pos/AnimatedCounter";
import { Role } from "@prisma/client";
import {
  UserPlus,
  Users,
  ShieldCheck,
  Check,
  Warning,
  Buildings,
  LockSimple,
  MagnifyingGlass,
  ArrowClockwise,
} from "@phosphor-icons/react";

interface AdminUserManagementViewProps {
  currentUsername?: string;
}

export function AdminUserManagementView({
  currentUsername,
}: AdminUserManagementViewProps) {
  const [operators, setOperators] = useState<OperatorDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    username: string;
    role: string;
  } | null>(null);

  // Form states
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [roleInput, setRoleInput] = useState<Role>("TECHNICIAN");
  const [campusInput, setCampusInput] = useState("Køge Campus");
  const [labSlugInput, setLabSlugInput] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "SUCCESS" | "ERROR";
    text: string;
  } | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | Role>("ALL");

  const loadData = async () => {
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const [sessionRes, ops] = await Promise.all([
        getAuthSession(),
        listOperators(),
      ]);
      if (sessionRes.user) {
        setCurrentUser(sessionRes.user);
      }
      setOperators(ops);
    } catch (err: any) {
      console.error("Fejl ved hentning af operatører:", err);
      setStatusMsg({
        type: "ERROR",
        text: err.message || "Kunne ikke hente listen over operatører.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!usernameInput.trim()) {
      setStatusMsg({ type: "ERROR", text: "Angiv venligst et brugernavn." });
      return;
    }
    if (!passwordInput.trim() || passwordInput.trim().length < 6) {
      setStatusMsg({
        type: "ERROR",
        text: "Adgangskoden skal være på mindst 6 tegn.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createOperator({
        username: usernameInput.trim(),
        password: passwordInput.trim(),
        role: roleInput,
        assignedCampus: campusInput,
        assignedLabSlug: labSlugInput,
      });

      if (res.success) {
        setStatusMsg({
          type: "SUCCESS",
          text: `Bruger "${res.operator.username}" oprettet med rollen ${res.operator.role}!`,
        });
        setUsernameInput("");
        setPasswordInput("");
        setRoleInput("TECHNICIAN");
        setLabSlugInput("all");
        await loadData();
      }
    } catch (err: any) {
      setStatusMsg({
        type: "ERROR",
        text: err.message || "Kunne ikke oprette operatøren.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (op: OperatorDTO) => {
    setStatusMsg(null);
    const newStatus = !op.isActive;

    if (op.id === currentUser?.id && !newStatus) {
      setStatusMsg({
        type: "ERROR",
        text: "Du kan ikke deaktivere din egen administrator-konto.",
      });
      return;
    }

    try {
      const res = await toggleOperatorActive(op.id, newStatus);
      if (res.success) {
        setStatusMsg({
          type: "SUCCESS",
          text: `Bruger "${op.username}" er nu ${
            newStatus ? "aktiveret" : "deaktiveret"
          }.`,
        });
        setOperators((prev) =>
          prev.map((item) =>
            item.id === op.id ? { ...item, isActive: newStatus } : item
          )
        );
      }
    } catch (err: any) {
      setStatusMsg({
        type: "ERROR",
        text: err.message || "Kunne ikke opdatere brugerstatus.",
      });
    }
  };

  // KPI calculations
  const superAdminCount = useMemo(
    () => operators.filter((o) => o.role === "SUPER_ADMIN" && o.isActive).length,
    [operators]
  );
  const technicianCount = useMemo(
    () => operators.filter((o) => o.role === "TECHNICIAN" && o.isActive).length,
    [operators]
  );
  const teacherCount = useMemo(
    () => operators.filter((o) => o.role === "TEACHER" && o.isActive).length,
    [operators]
  );
  const totalActiveCount = useMemo(
    () => operators.filter((o) => o.isActive).length,
    [operators]
  );

  // Filtered operators
  const filteredOperators = useMemo(() => {
    return operators.filter((op) => {
      const matchesSearch =
        searchQuery === "" ||
        op.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (op.assignedLabName &&
          op.assignedLabName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole = roleFilter === "ALL" || op.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [operators, searchQuery, roleFilter]);

  const activeAdminName = useMemo(() => {
    const name = currentUser?.username || currentUsername || "Admin";
    return name.charAt(0).toUpperCase() + name.slice(1);
  }, [currentUser, currentUsername]);

  if (currentUser && currentUser.role !== "SUPER_ADMIN") {
    return (
      <div className="w-full text-white font-mono space-y-6">
        <div className="bg-[#151517] border border-[#333333] rounded-2xl p-8 max-w-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#E6007E]/20 border border-[#E6007E]/40 flex items-center justify-center mx-auto text-[#E6007E]">
            <LockSimple size={24} weight="bold" />
          </div>
          <h2 className="text-xl font-bold font-notch text-white">
            Begrænset Adgang
          </h2>
          <p className="text-sm font-text text-zinc-400">
            Bruger- og rollestyring kræver SuperAdmin-rettigheder. Din aktuelle
            rolle ({currentUser.role}) har ikke tilladelse til at oprette eller
            administrere operatørkonti.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-white font-mono space-y-6">
      {/* 1. Canonical Admin Page Header Standard (AGENTS.md) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black font-notch tracking-tight flex items-baseline gap-1.5">
            <span className="text-white">LABS</span>
            <span className="text-[#E6007E]">Brugerstyring</span>
          </h1>
          <p className="text-sm font-headline font-bold text-zinc-400 mt-1">
            Velkommen, {activeAdminName}
          </p>
        </div>

        {/* Top KPI Metric Counters Cluster */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-10">
          {/* 1. SuperAdmins */}
          <div className="flex items-baseline gap-2.5">
            <AnimatedCounter
              value={superAdminCount}
              className="text-4xl sm:text-5xl font-bold font-notch text-[#E6007E] leading-none"
            />
            <span className="text-xs text-zinc-400 font-headline font-normal leading-tight">
              Super<br />Admins
            </span>
          </div>

          {/* 2. Teknikere */}
          <div className="flex items-baseline gap-2.5">
            <AnimatedCounter
              value={technicianCount}
              className="text-4xl sm:text-5xl font-bold font-notch text-[#009FE3] leading-none"
            />
            <span className="text-xs text-zinc-400 font-headline font-normal leading-tight">
              Teknikere<br />(Drift)
            </span>
          </div>

          {/* 3. Undervisere */}
          <div className="flex items-baseline gap-2.5">
            <AnimatedCounter
              value={teacherCount}
              className="text-4xl sm:text-5xl font-bold font-notch text-[#FFED00] leading-none"
            />
            <span className="text-xs text-zinc-400 font-headline font-normal leading-tight">
              Undervisere<br />(Labs)
            </span>
          </div>

          {/* 4. Aktive Total */}
          <div className="flex items-baseline gap-2.5">
            <AnimatedCounter
              value={totalActiveCount}
              className="text-4xl sm:text-5xl font-bold font-notch text-white leading-none"
            />
            <span className="text-xs text-zinc-400 font-headline font-normal leading-tight">
              Aktive<br />Operatører
            </span>
          </div>
        </div>
      </div>

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
          ) : (
            <Warning size={16} weight="bold" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* 2. Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Create New Operator Card */}
        <div className="bg-[#151517] border border-[#333333] rounded-2xl p-6 shadow-2xl space-y-6 lg:col-span-1">
          <div className="border-b border-[#333333] pb-3">
            <h2 className="text-base font-bold font-headline text-white flex items-center gap-2">
              <UserPlus size={18} weight="bold" className="text-[#E6007E]" />
              <span>Opret Ny Operatør</span>
            </h2>
            <p className="text-xs text-zinc-400 font-text mt-0.5">
              Opret en ny bruger med rolle og lokationstilknytning.
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-4 text-xs font-text">
            {/* Username */}
            <div>
              <label className="text-zinc-300 block mb-1 font-headline font-bold">
                Brugernavn
              </label>
              <input
                type="text"
                placeholder="f.eks. mads_tech"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
                className="w-full bg-[#202021] border border-[#333333] focus:border-[#555555] text-white rounded-lg p-2.5 outline-none font-bold text-xs"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-zinc-300 block mb-1 font-headline font-bold">
                Midlertidig Adgangskode
              </label>
              <input
                type="password"
                placeholder="Mindst 6 tegn"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                minLength={6}
                className="w-full bg-[#202021] border border-[#333333] focus:border-[#555555] text-white rounded-lg p-2.5 outline-none text-xs"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-zinc-300 block mb-1 font-headline font-bold">
                Rolle & Tilladelser
              </label>
              <select
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value as Role)}
                className="w-full bg-[#202021] border border-[#333333] focus:border-[#555555] text-white rounded-lg p-2.5 outline-none font-headline font-bold text-xs"
              >
                <option value="TECHNICIAN">Tekniker (Fuld lab drift & POS)</option>
                <option value="TEACHER">Underviser (Udlån & reservationer)</option>
                <option value="SUPER_ADMIN">SuperAdmin (Fuld systemadministration)</option>
              </select>
            </div>

            {/* Campus */}
            <div>
              <label className="text-zinc-300 block mb-1 font-headline font-bold">
                Tilknyttet Campus
              </label>
              <select
                value={campusInput}
                onChange={(e) => setCampusInput(e.target.value)}
                className="w-full bg-[#202021] border border-[#333333] focus:border-[#555555] text-white rounded-lg p-2.5 outline-none font-headline font-bold text-xs"
              >
                <option value="Køge Campus">Køge Campus (Zealand)</option>
              </select>
            </div>

            {/* Facility / Lab Assignment */}
            <div>
              <label className="text-zinc-300 block mb-1 font-headline font-bold">
                Standard Facilitet
              </label>
              <select
                value={labSlugInput}
                onChange={(e) => setLabSlugInput(e.target.value)}
                className="w-full bg-[#202021] border border-[#333333] focus:border-[#555555] text-white rounded-lg p-2.5 outline-none font-headline font-bold text-xs"
              >
                <option value="all">Begge faciliteter (Overordnet)</option>
                <option value="medialab">MediaLab (Køge)</option>
                <option value="makerspace">Makerspace (Køge)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#E6007E] hover:bg-[#d00072] text-white font-headline font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Opretter...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} weight="bold" />
                    <span>Opret Operatør</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Operators List Table */}
        <div className="bg-[#151517] border border-[#333333] rounded-2xl p-6 shadow-2xl space-y-4 lg:col-span-2">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#333333] pb-4">
            <div>
              <h2 className="text-base font-bold font-headline text-white flex items-center gap-2">
                <Users size={18} weight="bold" className="text-[#009FE3]" />
                <span>Registrerede Operatører ({filteredOperators.length})</span>
              </h2>
              <p className="text-xs text-zinc-400 font-text mt-0.5">
                Oversigt over alle godkendte administratorer og undervisere.
              </p>
            </div>

            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              title="Opdater liste"
              className="p-2 rounded-lg bg-[#202021] border border-[#333333] text-zinc-400 hover:text-white transition-colors cursor-pointer w-fit"
            >
              <ArrowClockwise size={16} weight="bold" className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Search & Role Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={16}
                weight="bold"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Søg på brugernavn eller facilitet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#202021] border border-[#333333] focus:border-[#555555] rounded-xl text-xs text-white placeholder-zinc-500 outline-none font-text"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(["ALL", "SUPER_ADMIN", "TECHNICIAN", "TEACHER"] as const).map((r) => {
                const isSelected = roleFilter === r;
                const label =
                  r === "ALL"
                    ? "Alle"
                    : r === "SUPER_ADMIN"
                    ? "SuperAdmin"
                    : r === "TECHNICIAN"
                    ? "Tekniker"
                    : "Underviser";
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "bg-[#E6007E] text-white"
                        : "bg-[#202021] border border-[#333333] text-zinc-400 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-text border-collapse">
              <thead>
                <tr className="border-b border-[#333333] text-zinc-400 font-headline uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Bruger</th>
                  <th className="py-2.5 px-3">Rolle</th>
                  <th className="py-2.5 px-3">Facilitet</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Handling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {filteredOperators.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500 font-text">
                      Ingen operatører fundet der matcher søgningen.
                    </td>
                  </tr>
                ) : (
                  filteredOperators.map((op) => {
                    const isSelf = op.id === currentUser?.id;
                    const roleColor =
                      op.role === "SUPER_ADMIN"
                        ? "text-[#E6007E] bg-[#E6007E]/10 border-[#E6007E]/30"
                        : op.role === "TECHNICIAN"
                        ? "text-[#009FE3] bg-[#009FE3]/10 border-[#009FE3]/30"
                        : "text-[#FFED00] bg-[#FFED00]/10 border-[#FFED00]/30";

                    return (
                      <tr
                        key={op.id}
                        className={`hover:bg-[#202021]/50 transition-colors ${
                          !op.isActive ? "opacity-50" : ""
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#202021] border border-[#444444] flex items-center justify-center font-bold text-[11px] text-white uppercase font-notch">
                              {op.username.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5 font-headline">
                                <span>{op.username}</span>
                                {isSelf && (
                                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                                    Dig
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-zinc-500">
                                {new Date(op.createdAt).toLocaleDateString("da-DK", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`inline-block text-[10px] font-bold font-headline uppercase px-2 py-0.5 rounded-full border ${roleColor}`}
                          >
                            {op.role}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 text-zinc-300">
                            <Buildings size={14} className="text-zinc-500" />
                            <span>{op.assignedLabName || "Begge faciliteter"}</span>
                          </div>
                          <div className="text-[10px] text-zinc-500 pl-5">
                            {op.assignedCampus || "Køge Campus"}
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          {op.isActive ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-headline font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>Aktiv</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 font-headline font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                              <span>Deaktiveret</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            disabled={isSelf && op.isActive}
                            onClick={() => handleToggleStatus(op)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold transition-all cursor-pointer ${
                              isSelf && op.isActive
                                ? "bg-zinc-800/40 text-zinc-600 border border-zinc-800 cursor-not-allowed"
                                : op.isActive
                                ? "bg-[#202021] text-zinc-400 border border-[#333333] hover:text-[#E6007E] hover:border-[#E6007E]"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                            }`}
                          >
                            {op.isActive ? "Deaktiver" : "Aktiver"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
