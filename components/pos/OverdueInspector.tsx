"use client";

import React, { useState } from "react";
import { returnEquipment } from "@/app/actions/pos";

interface OverdueInspectorProps {
  overdueLoans: any[];
  onRefresh: () => void;
}

export function OverdueInspector({ overdueLoans, onRefresh }: OverdueInspectorProps) {
  const [processingLoanId, setProcessingLoanId] = useState<string | null>(null);

  const handleReturn = async (loanId: string) => {
    try {
      setProcessingLoanId(loanId);
      await returnEquipment({ loanId, status: "RETURNED" });
      onRefresh();
    } catch (err) {
      console.error("Failed to return overdue loan", err);
    } finally {
      setProcessingLoanId(null);
    }
  };

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold tracking-tight text-[#E6007E] font-mono">
              Overdue Inspector
            </h3>
            <span className="bg-[#E6007E] text-white text-xs font-mono font-bold px-2 py-0.5 rounded-full">
              {overdueLoans.length}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Zero-Cloud native timestamp query telemetry
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-1.5 rounded-full border border-[#262626] bg-[#0D0D0D]"
        >
          ↻ Refresh Queries
        </button>
      </div>

      {/* List */}
      <div className="mt-4">
        {overdueLoans.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 font-mono text-xs">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2 font-bold">
              ✓
            </div>
            All loan returns are currently in good standing! No overdue items.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overdueLoans.map((loan) => (
              <div
                key={loan.id}
                className="bg-[#0D0D0D] border border-[#E6007E]/40 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-white text-sm font-mono">
                        {loan.inventory?.name}
                      </div>
                      <div className="text-xs text-[#009FE3] font-mono mt-0.5">
                        {loan.inventory?.assetTag}
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-[#E6007E] text-white font-mono font-bold text-[11px] rounded-full">
                      {loan.overdueFormatted}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#262626] text-xs font-mono text-zinc-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Borrower:</span>
                      <span className="font-semibold text-white">{loan.patron?.studentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Contact:</span>
                      <span className="text-zinc-300">{loan.patron?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Expected:</span>
                      <span className="text-[#FFED00]">
                        {new Date(loan.expectedReturn).toLocaleDateString("en-DK", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between gap-2">
                  <a
                    href={`mailto:${loan.patron?.email}?subject=Overdue Medialab Equipment: ${loan.inventory?.name}`}
                    className="text-[11px] font-mono text-zinc-400 hover:text-white underline"
                  >
                    Email Patron
                  </a>
                  <button
                    type="button"
                    disabled={processingLoanId === loan.id}
                    onClick={() => handleReturn(loan.id)}
                    className="px-4 py-1.5 bg-[#009FE3] hover:bg-[#0089c4] text-black font-mono font-bold text-xs rounded-full transition-colors"
                  >
                    {processingLoanId === loan.id ? "..." : "Check In Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
