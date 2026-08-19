"use client";

import React, { useState } from "react";
import { returnEquipment, modifyLoan } from "@/app/actions/pos";
import { motion } from "motion/react";

interface LoanDetailModalProps {
  loan: any | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export function LoanDetailModal({
  loan,
  isOpen,
  onClose,
  onRefresh,
}: LoanDetailModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newReturnDate, setNewReturnDate] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const [showDamageForm, setShowDamageForm] = useState(false);
  const [damageNotes, setDamageNotes] = useState("");
  const [sendToRepair, setSendToRepair] = useState(true);

  if (!isOpen || !loan) return null;

  const isOverdue =
    loan.isOverdue || (loan.status === "ACTIVE" && new Date(loan.expectedReturn) < new Date());

  const handleReturn = async (damaged: boolean = false) => {
    try {
      setIsProcessing(true);
      await returnEquipment({
        loanId: loan.id,
        status: damaged ? "DAMAGED" : "RETURNED",
        damageNotes: damaged ? damageNotes.trim() : undefined,
        sendToRepair: damaged ? sendToRepair : false,
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Return error", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveLoanModifications = async () => {
    try {
      setIsProcessing(true);
      await modifyLoan({
        loanId: loan.id,
        expectedReturn: newReturnDate ? new Date(newReturnDate) : undefined,
        notes: editNotes,
      });
      setIsEditing(false);
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to modify loan", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const startEditing = () => {
    setNewReturnDate(new Date(loan.expectedReturn).toISOString().slice(0, 16));
    setEditNotes(loan.notes || "");
    setIsEditing(true);
  };

  const getStatusDisplay = () => {
    if (loan.status === "RETURNED") return "RETURNED";
    if (loan.status === "DAMAGED") return "DAMAGED";
    if (isOverdue) return "OVERDUE";
    return "CHECKED OUT";
  };

  const getStatusColor = () => {
    if (loan.status === "RETURNED") return "bg-zinc-800 text-zinc-300 border-zinc-700";
    if (loan.status === "DAMAGED" || isOverdue) return "bg-[#E6007E]/20 text-[#E6007E] border-[#E6007E]";
    return "bg-[#009FE3]/20 text-[#009FE3] border-[#009FE3]";
  };

  // Compute check-in comparison tracking info if returned
  const getReturnComparison = () => {
    if (!loan.actualReturn) return null;
    const actual = new Date(loan.actualReturn);
    const expected = new Date(loan.expectedReturn);
    const diffMs = actual.getTime() - expected.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return {
        text: `Checked in ${diffDays} day${diffDays === 1 ? "" : "s"} late`,
        color: "text-[#E6007E] border-[#E6007E]/40 bg-[#E6007E]/10",
      };
    } else if (diffDays < 0) {
      const earlyDays = Math.abs(diffDays);
      return {
        text: `Checked in ${earlyDays} day${earlyDays === 1 ? "" : "s"} early`,
        color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      };
    } else {
      return {
        text: "Checked in on schedule",
        color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      };
    }
  };

  const returnComparison = getReturnComparison();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#141414] border border-[#262626] rounded-3xl p-6 max-w-lg w-full shadow-2xl font-mono text-xs"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 uppercase tracking-wider font-bold">
              Loan Status & Verification
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full border font-bold text-[10px] ${getStatusColor()}`}
            >
              {getStatusDisplay()}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          {/* Asset Info Card */}
          <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-4">
            <div className="text-zinc-500 text-[11px]">Equipment Asset</div>
            <div className="text-base font-bold text-white mt-0.5">{loan.inventory?.name}</div>
            <div className="flex items-center gap-3 text-xs mt-1">
              <span className="text-[#009FE3] font-bold">Tag: [{loan.inventory?.assetTag}]</span>
              <span className="text-zinc-400 text-[11px] font-bold">🏛️ {loan.inventory?.lab?.name || "MediaLab (Køge)"}</span>
            </div>
          </div>

          {/* Patron Info Card */}
          <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-4">
            <div className="text-zinc-500 text-[11px]">Borrower Patron</div>
            <div className="text-sm font-bold text-white mt-0.5">
              Student ID: {loan.patron?.studentId}
            </div>
            <div className="text-zinc-400 mt-0.5">{loan.patron?.email}</div>
          </div>

          {/* Schedule / Tracking Timeline Comparison */}
          {!isEditing ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-3">
                  <div className="text-zinc-500 text-[10px]">Checked Out</div>
                  <div className="text-white font-semibold mt-0.5">
                    {new Date(loan.checkoutDate).toLocaleDateString("en-DK", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-3">
                  <div className="text-zinc-500 text-[10px]">Expected Return</div>
                  <div
                    className={`font-bold mt-0.5 ${
                      isOverdue ? "text-[#E6007E]" : "text-[#FFED00]"
                    }`}
                  >
                    {new Date(loan.expectedReturn).toLocaleDateString("en-DK", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Actual Return Comparison Info */}
              {loan.actualReturn && returnComparison && (
                <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-zinc-500 text-[10px]">Final Check-in Date</div>
                    <div className="text-white font-semibold mt-0.5">
                      {new Date(loan.actualReturn).toLocaleDateString("en-DK", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-[11px] font-bold ${returnComparison.color}`}>
                    {returnComparison.text}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#0D0D0D] border border-[#FFED00]/50 rounded-2xl p-4 space-y-3">
              <div className="text-[#FFED00] font-bold text-xs">Edit Return Date & Notes</div>
              <div>
                <label className="text-zinc-400 block mb-1">New Return Date</label>
                <input
                  type="datetime-local"
                  value={newReturnDate}
                  onChange={(e) => setNewReturnDate(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#FFED00] text-white rounded-xl p-2 outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Notes / Extension Reason</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#FFED00] text-white rounded-xl p-2 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleSaveLoanModifications}
                  className="px-4 py-1 bg-[#FFED00] text-black font-bold rounded-full"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {loan.notes && !isEditing && (
            <div className="bg-[#0D0D0D] border border-[#262626] rounded-2xl p-3 text-zinc-300">
              <span className="text-zinc-500 block mb-1">Notes:</span>
              {loan.notes}
            </div>
          )}

          {/* Damage Form inline */}
          {showDamageForm && (
            <div className="bg-[#E6007E]/5 border border-[#E6007E]/30 rounded-2xl p-3.5 space-y-2">
              <label className="text-zinc-300 block font-semibold">Damage Description</label>
              <textarea
                rows={2}
                value={damageNotes}
                onChange={(e) => setDamageNotes(e.target.value)}
                placeholder="Describe fault or damage..."
                className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#E6007E] text-white rounded-xl p-2 outline-none"
              />
              <label className="flex items-center gap-2 text-zinc-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={sendToRepair}
                  onChange={(e) => setSendToRepair(e.target.checked)}
                  className="accent-[#E6007E]"
                />
                <span>Set item status to MAINTENANCE (send to repair)</span>
              </label>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-[#262626] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#0D0D0D] border border-[#262626] text-zinc-400 hover:text-white rounded-full"
            >
              Close
            </button>
            {loan.status === "ACTIVE" && !isEditing && (
              <button
                type="button"
                onClick={startEditing}
                className="px-3.5 py-2 bg-[#0D0D0D] border border-zinc-700 text-zinc-300 hover:text-white rounded-full font-bold"
              >
                ✎ Extend / Edit
              </button>
            )}
          </div>

          {loan.status === "ACTIVE" && !isEditing && (
            <div className="flex items-center gap-2">
              {!showDamageForm ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowDamageForm(true)}
                    className="px-3.5 py-2 bg-[#0D0D0D] hover:bg-[#262626] text-[#E6007E] border border-[#E6007E]/40 rounded-full"
                  >
                    Flag Damage
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleReturn(false)}
                    className="px-5 py-2 bg-[#009FE3] hover:bg-[#0089c4] text-black font-bold rounded-full shadow-lg shadow-[#009FE3]/20"
                  >
                    {isProcessing ? "Processing..." : "Check In Equipment"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleReturn(true)}
                  className="px-5 py-2 bg-[#E6007E] hover:bg-[#cf006f] text-white font-bold rounded-full shadow-lg shadow-[#E6007E]/20"
                >
                  {isProcessing ? "Processing..." : "Confirm Damaged Return"}
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
