"use client";

import React, { useState } from "react";
import { returnEquipment } from "@/app/actions/pos";
import { motion, AnimatePresence } from "motion/react";

interface ActiveLoansTableProps {
  loans: any[];
  onRefresh: () => void;
}

export function ActiveLoansTable({ loans, onRefresh }: ActiveLoansTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOverdueOnly, setFilterOverdueOnly] = useState(false);
  const [processingLoanId, setProcessingLoanId] = useState<string | null>(null);

  // Return with Damage State
  const [damagePromptLoan, setDamagePromptLoan] = useState<any | null>(null);
  const [damageNotes, setDamageNotes] = useState("");
  const [sendToRepair, setSendToRepair] = useState(true);

  const filteredLoans = loans.filter((loan) => {
    const term = searchTerm.toLowerCase();
    const matchesQuery =
      !term ||
      loan.patron?.studentId?.toLowerCase().includes(term) ||
      loan.patron?.email?.toLowerCase().includes(term) ||
      loan.inventory?.name?.toLowerCase().includes(term) ||
      loan.inventory?.assetTag?.toLowerCase().includes(term);

    const matchesOverdue = !filterOverdueOnly || loan.isOverdue;
    return matchesQuery && matchesOverdue;
  });

  const handleQuickReturn = async (loanId: string) => {
    try {
      setProcessingLoanId(loanId);
      await returnEquipment({
        loanId,
        status: "RETURNED",
      });
      onRefresh();
    } catch (err) {
      console.error("Failed to return loan", err);
    } finally {
      setProcessingLoanId(null);
    }
  };

  const handleDamagedReturnSubmit = async () => {
    if (!damagePromptLoan) return;

    try {
      setProcessingLoanId(damagePromptLoan.id);
      await returnEquipment({
        loanId: damagePromptLoan.id,
        status: "DAMAGED",
        damageNotes: damageNotes.trim() || undefined,
        sendToRepair,
      });
      setDamagePromptLoan(null);
      setDamageNotes("");
      onRefresh();
    } catch (err) {
      console.error("Failed to process damaged return", err);
    } finally {
      setProcessingLoanId(null);
    }
  };

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-xl">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold tracking-tight text-white font-mono">
              Active Loans
            </h3>
            <span className="bg-[#009FE3] text-black text-xs font-mono font-bold px-2 py-0.5 rounded-full">
              {loans.length}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Real-time active checkout registry
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <input
            type="text"
            placeholder="Filter by student or asset..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#0D0D0D] border border-[#262626] focus:border-[#009FE3] text-white text-xs font-mono px-3 py-2 rounded-full outline-none w-48 sm:w-56"
          />

          {/* Overdue quick toggle */}
          <button
            type="button"
            onClick={() => setFilterOverdueOnly(!filterOverdueOnly)}
            className={`px-3 py-2 rounded-full text-xs font-mono transition-colors border ${
              filterOverdueOnly
                ? "bg-[#E6007E] text-white border-[#E6007E] font-bold"
                : "bg-[#0D0D0D] text-zinc-400 border-[#262626] hover:text-white"
            }`}
          >
            Overdue Only
          </button>
        </div>
      </div>

      {/* Table / List */}
      <div className="mt-4 overflow-x-auto">
        {filteredLoans.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 font-mono text-xs">
            No active loans match the current filter.
          </div>
        ) : (
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-zinc-500 border-b border-[#262626]">
                <th className="py-3 px-3 font-semibold uppercase tracking-wider">Asset</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider">Patron</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider">Checkout Date</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider">Expected Return</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {filteredLoans.map((loan) => (
                <tr
                  key={loan.id}
                  className={`hover:bg-[#1f1f1f]/50 transition-colors ${
                    loan.isOverdue ? "bg-[#E6007E]/5" : ""
                  }`}
                >
                  {/* Asset */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{loan.inventory?.name}</div>
                    <div className="text-[11px] text-[#009FE3]">{loan.inventory?.assetTag}</div>
                  </td>

                  {/* Patron */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{loan.patron?.studentId}</div>
                    <div className="text-[10px] text-zinc-400">{loan.patron?.email}</div>
                  </td>

                  {/* Checkout Date */}
                  <td className="py-3 px-3 text-zinc-300">
                    {new Date(loan.checkoutDate).toLocaleDateString("en-DK", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  {/* Return Deadline */}
                  <td className="py-3 px-3">
                    <div
                      className={`inline-flex items-center gap-1 font-semibold ${
                        loan.isOverdue ? "text-[#E6007E]" : "text-[#FFED00]"
                      }`}
                    >
                      {new Date(loan.expectedReturn).toLocaleDateString("en-DK", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {loan.isOverdue && (
                        <span className="px-1.5 py-0.2 bg-[#E6007E] text-white text-[9px] rounded-full uppercase">
                          Overdue
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      type="button"
                      disabled={processingLoanId === loan.id}
                      onClick={() => handleQuickReturn(loan.id)}
                      className="px-3 py-1.5 bg-[#009FE3] hover:bg-[#0089c4] text-black font-bold rounded-full text-xs transition-colors"
                    >
                      {processingLoanId === loan.id ? "..." : "Check In"}
                    </button>

                    <button
                      type="button"
                      disabled={processingLoanId === loan.id}
                      onClick={() => setDamagePromptLoan(loan)}
                      className="px-2.5 py-1.5 bg-[#0D0D0D] hover:bg-[#262626] text-zinc-400 hover:text-[#E6007E] border border-[#262626] rounded-full text-xs transition-colors"
                      title="Return Damaged / Log Repair"
                    >
                      Damage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Damage Return Modal */}
      <AnimatePresence>
        {damagePromptLoan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] border border-[#E6007E] rounded-3xl p-6 max-w-md w-full shadow-2xl font-mono"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                <div className="flex items-center gap-2 text-[#E6007E]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <h4 className="font-bold text-sm">Flag Damaged Return</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setDamagePromptLoan(null)}
                  className="text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="bg-[#0D0D0D] p-3 rounded-2xl border border-[#262626]">
                  <div className="text-zinc-400">Asset:</div>
                  <div className="font-bold text-white">
                    {damagePromptLoan.inventory?.name} ({damagePromptLoan.inventory?.assetTag})
                  </div>
                  <div className="text-zinc-400 mt-1">Patron:</div>
                  <div className="font-bold text-white">{damagePromptLoan.patron?.studentId}</div>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Damage Description / Repair Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Describe issue (e.g. cracked lens, missing cable, faulty trigger)..."
                    value={damageNotes}
                    onChange={(e) => setDamageNotes(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#E6007E] text-white rounded-xl p-2.5 outline-none"
                  />
                </div>

                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendToRepair}
                    onChange={(e) => setSendToRepair(e.target.checked)}
                    className="rounded accent-[#E6007E]"
                  />
                  <span>Create RepairLog & set status to MAINTENANCE</span>
                </label>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDamagePromptLoan(null)}
                  className="px-4 py-2 bg-[#0D0D0D] border border-[#262626] text-zinc-300 rounded-full hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={processingLoanId === damagePromptLoan.id}
                  onClick={handleDamagedReturnSubmit}
                  className="px-5 py-2 bg-[#E6007E] hover:bg-[#cf006f] text-white font-bold rounded-full text-xs shadow-lg shadow-[#E6007E]/20"
                >
                  {processingLoanId === damagePromptLoan.id ? "Processing..." : "Confirm Damaged Return"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
