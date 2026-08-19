"use client";

import React from "react";

interface PatronCardProps {
  patron: {
    id: string;
    studentId: string;
    email: string;
    loans?: any[];
  };
  onClear?: () => void;
}

export function PatronCard({ patron, onClear }: PatronCardProps) {
  const activeLoans = patron.loans?.filter((l) => l.status === "ACTIVE") || [];

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 relative overflow-hidden shadow-2xl font-mono">
      {/* Top Bar with Student Badge and Actions */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
              Verified Patron
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-[#009FE3]/40 bg-[#009FE3]/10 text-[#009FE3] text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#009FE3]" />
              <span>STUDENT BADGE</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <h3 className="text-2xl font-extrabold tracking-tight text-white">
              {patron.studentId}
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">{patron.email}</p>
        </div>

        {onClear && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClear();
            }}
            className="text-zinc-400 hover:text-white transition-colors text-xs px-3.5 py-1.5 rounded-full border border-[#262626] hover:border-zinc-500 bg-[#0D0D0D] font-bold"
          >
            ✕ Detach Patron
          </button>
        )}
      </div>

      {/* Active Borrowed Items telemetry */}
      <div className="mt-4 bg-[#0D0D0D] border border-[#262626] rounded-2xl p-3.5">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <span>Active Borrowed Gear</span>
          <span className="text-white font-bold">{activeLoans.length} item(s)</span>
        </div>
        {activeLoans.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">No outstanding loans currently.</p>
        ) : (
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {activeLoans.map((loan) => (
              <div
                key={loan.id}
                className="flex items-center justify-between text-xs bg-[#141414] px-3 py-2 rounded-xl border border-[#262626]"
              >
                <div>
                  <div className="font-bold text-white">{loan.inventory?.name || "Equipment"}</div>
                  <div className="text-[10px] text-[#009FE3]">[{loan.inventory?.assetTag}]</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500">Return Date</div>
                  <div className="text-[11px] text-[#FFED00] font-bold">
                    {new Date(loan.expectedReturn).toLocaleDateString("en-DK", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
