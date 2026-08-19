"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getAuditLogs, getDistinctActionTypes } from "@/app/actions/history";
import { motion, AnimatePresence } from "motion/react";

export function AuditHistoryView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [actionTypes, setActionTypes] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const [resLogs, resActions] = await Promise.all([
        getAuditLogs({
          actionType: selectedAction !== "ALL" ? selectedAction : undefined,
          searchQuery,
        }),
        getDistinctActionTypes(),
      ]);

      setLogs(resLogs);
      setActionTypes(resActions);
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedAction, searchQuery]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionBadgeColor = (action: string) => {
    if (action.includes("CHECKOUT")) return "bg-[#009FE3]/20 text-[#009FE3] border-[#009FE3]/40";
    if (action.includes("RETURN")) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
    if (action.includes("MODIFY") || action.includes("UPDATE"))
      return "bg-[#FFED00]/20 text-[#FFED00] border-[#FFED00]/40";
    if (action.includes("DELETE")) return "bg-[#E6007E]/20 text-[#E6007E] border-[#E6007E]/40";
    return "bg-zinc-800 text-zinc-300 border-zinc-700";
  };

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-2xl font-mono text-white">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Audit Logs & Transaction History
            </h2>
            <span className="bg-[#009FE3] text-black text-xs font-bold px-2.5 py-0.5 rounded-full">
              {logs.length} Recorded
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Immutable staff activity trail and JSON delta state changes
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Action Filter */}
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="bg-[#0D0D0D] border border-[#262626] text-white text-xs rounded-full px-3 py-2 outline-none"
          >
            <option value="ALL">All Actions</option>
            {actionTypes.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>

          {/* Search Query */}
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#0D0D0D] border border-[#262626] text-white text-xs rounded-full px-3 py-2 outline-none w-44"
          />

          <button
            type="button"
            onClick={fetchLogs}
            className="p-2 bg-[#0D0D0D] border border-[#262626] rounded-full text-zinc-400 hover:text-white"
            title="Refresh Logs"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="mt-4 overflow-x-auto">
        {logs.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-xs">
            No audit log entries match the current filter.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-zinc-500 border-b border-[#262626]">
                <th className="py-3 px-3 font-semibold uppercase tracking-wider">Timestamp</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider">Action Type</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider">Actor Admin</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider">Target Entity</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-right">Payload Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {logs.map((log) => {
                const isExpanded = expandedLogId === log.id;

                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-[#1a1a1a] transition-colors">
                      {/* Timestamp */}
                      <td className="py-3 px-3 text-zinc-400">
                        {new Date(log.createdAt).toLocaleDateString("en-DK", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>

                      {/* Action Type */}
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${getActionBadgeColor(
                            log.actionType
                          )}`}
                        >
                          {log.actionType}
                        </span>
                      </td>

                      {/* Actor Admin */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-white">
                          {log.admin?.username || "System"}
                        </span>
                      </td>

                      {/* Target Table & ID */}
                      <td className="py-3 px-3 text-zinc-300">
                        <span className="font-semibold text-zinc-400">{log.targetTable}:</span>{" "}
                        <span className="text-[11px] text-white">
                          {log.payloadDelta?.assetTag || log.payloadDelta?.patronStudentId || log.targetId?.slice(0, 16)}
                        </span>
                      </td>

                      {/* Toggle Payload */}
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="text-xs text-[#009FE3] hover:underline font-bold"
                        >
                          {isExpanded ? "Hide JSON ▲" : "View Delta ▼"}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable JSON viewer */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="p-4 bg-[#0D0D0D] border-b border-[#262626]">
                          <pre className="text-[11px] text-[#009FE3] bg-[#000000] p-3 rounded-xl border border-[#262626] overflow-x-auto max-h-48">
                            {JSON.stringify(log.payloadDelta, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
