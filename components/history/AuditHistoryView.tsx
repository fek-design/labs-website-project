"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getAuditLogs, getDistinctActionTypes } from "@/app/actions/history";
import { getAuthSession } from "@/app/actions/auth";
import { AnimatedCounter } from "@/components/pos/AnimatedCounter";
import {
  MagnifyingGlass,
  ArrowClockwise,
  CaretDown,
  CaretUp,
  X,
  FileCode,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Format date timestamp to match Figma design: "31 Aug kl. 12.02.52"
 */
function formatLogTimestamp(dateStr: string | Date): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Ukendt tid";

  const day = d.getDate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Maj",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dec",
  ];
  const month = months[d.getMonth()] || "Aug";
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${day} ${month} kl. ${hours}.${minutes}.${seconds}`;
}

/**
 * Format target entity string matching Figma: "Loan: ML-AUD-0001"
 */
function formatLogTarget(log: any): string {
  const table = log.targetTable || "Target";
  const delta = log.payloadDelta;

  const detail =
    delta?.assetTag ||
    delta?.patronStudentId ||
    delta?.title ||
    delta?.name ||
    (log.targetId ? String(log.targetId).slice(0, 14) : "Generel");

  return `${table}: ${detail}`;
}

export function AuditHistoryView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [actionTypes, setActionTypes] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  // Hydrate admin operator profile name
  useEffect(() => {
    getAuthSession()
      .then((session) => {
        if (session?.user?.username) {
          const capitalized =
            session.user.username.charAt(0).toUpperCase() +
            session.user.username.slice(1);
          setAdminName(capitalized);
        }
      })
      .catch(() => {
        // Fallback to default
      });
  }, []);

  const fetchLogs = useCallback(
    async (showRefreshIndicator = false) => {
      try {
        if (showRefreshIndicator) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const [resLogs, resActions] = await Promise.all([
          getAuditLogs({
            actionType: selectedAction !== "ALL" ? selectedAction : undefined,
            searchQuery: searchQuery.trim() || undefined,
          }),
          getDistinctActionTypes(),
        ]);

        setLogs(resLogs);
        setActionTypes(resActions);
      } catch (err) {
        console.error("Failed to load audit logs", err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [selectedAction, searchQuery]
  );

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleManualRefresh = () => {
    fetchLogs(true);
  };

  const getActionBadgeStyle = (action: string) => {
    if (action.includes("RETURN")) {
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }
    if (action.includes("CHECKOUT") || action.includes("LOAN")) {
      return "text-[#009FE3] bg-[#009FE3]/10 border-[#009FE3]/30";
    }
    if (action.includes("MODIFY") || action.includes("UPDATE")) {
      return "text-[#FFED00] bg-[#FFED00]/10 border-[#FFED00]/30";
    }
    if (action.includes("DELETE")) {
      return "text-[#E6007E] bg-[#E6007E]/10 border-[#E6007E]/30";
    }
    return "text-zinc-300 bg-zinc-800/60 border-zinc-700";
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1512px] mx-auto p-4 sm:p-6 lg:p-8 bg-[#0e0d0f] min-h-screen text-white font-text select-none">
      {/* 1. Canonical Admin Page Header Standard (AGENTS.md) with Cyan #009FE3 Accent */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black font-notch tracking-tight flex items-baseline gap-1.5">
            <span className="text-white">LABS</span>
            <span className="text-[#009FE3]">Logs</span>
          </h1>
          <p className="text-sm font-headline font-bold text-zinc-400 mt-1">
            Velkommen, {adminName}
          </p>
        </div>

        {/* Top KPI Metric Counters */}
        <div className="flex flex-wrap items-center gap-8 sm:gap-12">
          {/* 1. Registrerede handlinger */}
          <div className="flex items-baseline gap-3">
            <AnimatedCounter
              value={logs.length}
              className="text-5xl sm:text-6xl font-bold font-notch text-white leading-none"
            />
            <span className="text-sm text-zinc-400 font-headline font-normal leading-tight">
              Registrerede<br />handlinger
            </span>
          </div>

          {/* 2. Filtrerede visninger */}
          <div className="flex items-baseline gap-3">
            <AnimatedCounter
              value={logs.length}
              className="text-5xl sm:text-6xl font-bold font-notch text-[#009FE3] leading-none"
            />
            <span className="text-sm text-zinc-400 font-headline font-normal leading-tight">
              Aktive<br />visninger
            </span>
          </div>
        </div>
      </div>

      {/* 2. Frame 77: Search & Refresh Toolbar (Figma Node 86:4305) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
        {/* Search Input Box (Figma Node 86:4306) */}
        <div className="relative flex-1 bg-[#151517] border border-[#333333] hover:border-[#444444] focus-within:border-[#009FE3] rounded-lg h-12 flex items-center px-4 transition-colors">
          <MagnifyingGlass
            size={18}
            weight="bold"
            className="text-[#d1d5db] shrink-0 mr-3 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Søg logs..."
            className="w-full bg-transparent text-sm text-white placeholder-zinc-400 outline-none font-text"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-1 text-zinc-400 hover:text-white rounded transition-colors cursor-pointer"
              title="Ryd søgning"
            >
              <X size={14} weight="bold" />
            </button>
          )}
        </div>

        {/* Refresh Action Button (Figma Node 86:4317) */}
        <button
          type="button"
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="h-12 px-6 bg-[#009FE3] hover:bg-[#008cc9] active:scale-[0.98] text-black font-headline font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer shrink-0 disabled:opacity-60"
        >
          <span>Refresh</span>
          <ArrowClockwise
            size={16}
            weight="bold"
            className={`${isRefreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* 3. Main Surface Container (Figma Node 86:4322 "Calendar") */}
      <div className="bg-[#151517] border border-[#333333] rounded-xl p-5 sm:p-6 space-y-5 shadow-2xl">
        {/* Subheader Row (Figma Node 86:4325 Frame 78) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold font-notch text-white tracking-tight">
              Revisionslog &amp; Transaktion Historik
            </h2>
            <span className="text-sm font-bold font-notch text-[#009FE3] bg-[#009FE3]/10 border border-[#009FE3]/30 px-2.5 py-0.5 rounded-full">
              {logs.length}
            </span>
          </div>

          {/* TYPE Filter Dropdown Cluster (Figma Node 86:4327 / 86:4335) */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <span className="text-xs font-bold font-headline text-[#888888] uppercase tracking-wider">
              TYPE
            </span>
            <div className="relative">
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="appearance-none bg-[#151517] hover:bg-[#1a1a1d] text-white text-xs sm:text-sm font-bold font-text border border-[#333333] hover:border-[#444444] rounded-lg px-4 py-2.5 pr-9 cursor-pointer focus:outline-none focus:border-[#009FE3] transition-colors min-w-[160px]"
              >
                <option value="ALL">ALLE</option>
                {actionTypes.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </select>
              <CaretDown
                size={14}
                weight="bold"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* 4. Frame 72: Log Cards List (Figma Node 86:4348) */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[#009FE3] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-zinc-500 font-headline text-sm">
              Indlæser systemhistorik og revisionslogs...
            </p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#333333] rounded-xl bg-[#09090b]/50 space-y-2">
            <FileCode size={36} weight="thin" className="mx-auto text-zinc-600 mb-1" />
            <p className="text-zinc-400 font-bold font-headline text-base">
              Ingen hændelser fundet
            </p>
            <p className="text-xs text-zinc-500 font-text max-w-md mx-auto">
              Ingen revisionslogs matcher de angivne søge- eller typekriterier.
            </p>
            {(searchQuery || selectedAction !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedAction("ALL");
                }}
                className="mt-3 text-xs text-[#009FE3] hover:underline font-bold cursor-pointer inline-block"
              >
                Nulstil søgning og filtre
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const actorName = log.admin?.username
                ? log.admin.username.toUpperCase()
                : "SYSTEM";

              return (
                <div
                  key={log.id}
                  className="bg-[#202021] border border-[#444444] hover:border-zinc-500 rounded-lg p-3 sm:p-4 transition-all duration-200 shadow-md group"
                >
                  {/* Segmented Pipeline Data Row */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4">
                    {/* Segment 1: TIDSPUNKT */}
                    <div className="flex flex-col min-w-[170px]">
                      <span className="text-[10px] font-bold font-headline text-zinc-400 uppercase tracking-wider mb-0.5">
                        TIDSPUNKT
                      </span>
                      <span className="text-xs font-bold font-text text-white">
                        {formatLogTimestamp(log.createdAt)}
                      </span>
                    </div>

                    {/* Divider 1 */}
                    <div className="hidden lg:block w-[1px] h-8 bg-[#333333] shrink-0" />

                    {/* Segment 2: TYPE */}
                    <div className="flex flex-col min-w-[150px]">
                      <span className="text-[10px] font-bold font-headline text-zinc-400 uppercase tracking-wider mb-0.5">
                        TYPE
                      </span>
                      <span
                        className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded border w-fit ${getActionBadgeStyle(
                          log.actionType
                        )}`}
                      >
                        {log.actionType}
                      </span>
                    </div>

                    {/* Divider 2 */}
                    <div className="hidden lg:block w-[1px] h-8 bg-[#333333] shrink-0" />

                    {/* Segment 3: AKTØR */}
                    <div className="flex flex-col min-w-[110px]">
                      <span className="text-[10px] font-bold font-headline text-zinc-400 uppercase tracking-wider mb-0.5">
                        AKTØR
                      </span>
                      <span className="text-xs font-bold font-text text-white">
                        {actorName}
                      </span>
                    </div>

                    {/* Divider 3 */}
                    <div className="hidden lg:block w-[1px] h-8 bg-[#333333] shrink-0" />

                    {/* Segment 4: TARGET */}
                    <div className="flex flex-col flex-1 min-w-[180px]">
                      <span className="text-[10px] font-bold font-headline text-zinc-400 uppercase tracking-wider mb-0.5">
                        TARGET
                      </span>
                      <span
                        className="text-xs font-bold font-mono text-zinc-200 truncate"
                        title={formatLogTarget(log)}
                      >
                        {formatLogTarget(log)}
                      </span>
                    </div>

                    {/* Segment 5: Action Toggle Pill (Figma Node 87:5540 "Se Ændring ▼") */}
                    <div className="flex items-center justify-end shrink-0 pt-2 lg:pt-0 border-t border-[#333333] lg:border-t-0">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedLogId(isExpanded ? null : log.id)
                        }
                        className="text-xs font-bold font-headline text-[#009FE3] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded hover:bg-[#151517]"
                      >
                        <span>{isExpanded ? "Skjul Ændring" : "Se Ændring"}</span>
                        {isExpanded ? (
                          <CaretUp size={12} weight="bold" />
                        ) : (
                          <CaretDown size={12} weight="bold" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 5. Expandable JSON Delta Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden border-t border-[#333333] mt-3 pt-3"
                      >
                        <div className="p-4 bg-[#151517] border border-[#333333] rounded-lg space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-headline font-bold text-zinc-400 border-b border-[#262626] pb-2">
                            <span className="flex items-center gap-1.5">
                              <FileCode size={14} weight="bold" className="text-[#009FE3]" />
                              <span>JSON Payload &amp; Mutation State</span>
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500">
                              ID: {log.id}
                            </span>
                          </div>

                          <pre className="text-xs font-mono text-[#009FE3] bg-[#0a0a0c] p-3 rounded-md border border-[#262626] overflow-x-auto max-h-64 leading-relaxed selection:bg-[#009FE3]/30 selection:text-white">
                            {JSON.stringify(log.payloadDelta, null, 2)}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
