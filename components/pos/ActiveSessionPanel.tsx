"use client";

import React, { useState, useEffect } from "react";
import { checkoutEquipment, returnEquipment, returnMultipleLoans, modifyLoan } from "@/app/actions/pos";
import { motion, AnimatePresence } from "motion/react";
import { Buildings, Camera, Check, PencilSimple, Warning, X } from "@phosphor-icons/react";

interface ActiveSessionPanelProps {
  patron: {
    id: string;
    studentId: string;
    email: string;
    createdAt?: Date | string;
    loans?: any[];
  } | null;
  items: Array<{
    id: string;
    name: string;
    assetTag: string;
    operationalStatus: string;
    imageUrl?: string | null;
  }>;
  inspectedLoan?: any | null;
  onClearInspectedLoan?: () => void;
  onRemoveItem: (id: string) => void;
  onClearSession: () => void;
  onCheckoutSuccess: () => void;
  onRefresh: () => void;
  lastScannedReturnAssetTag?: string | null;
  onClearScannedReturnAssetTag?: () => void;
}

export function ActiveSessionPanel({
  patron,
  items,
  inspectedLoan,
  onClearInspectedLoan,
  onRemoveItem,
  onClearSession,
  onCheckoutSuccess,
  onRefresh,
  lastScannedReturnAssetTag,
  onClearScannedReturnAssetTag,
}: ActiveSessionPanelProps) {
  const [sessionMode, setSessionMode] = useState<"UDLEJNING" | "RETUNERING">("UDLEJNING");
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(inspectedLoan?.id || null);

  // Automatically switch to RETUNERING mode and focus inspected loan when selected from activity/calendar
  useEffect(() => {
    if (inspectedLoan) {
      setSessionMode("RETUNERING");
      setSelectedLoanId(inspectedLoan.id);
    }
  }, [inspectedLoan]);

  // Default duration: 30 days
  const getDefaultReturnDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    d.setHours(16, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  const [expectedReturn, setExpectedReturn] = useState<string>(getDefaultReturnDate());
  const [selectedDurationPreset, setSelectedDurationPreset] = useState<number>(30);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [returningLoanId, setReturningLoanId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Bulk return states
  const [isBulkReturning, setIsBulkReturning] = useState(false);
  const [confirmBulkReturn, setConfirmBulkReturn] = useState(false);
  const [selectedReturnLoanIds, setSelectedReturnLoanIds] = useState<Set<string>>(new Set());
  const [recentlyScannedLoanId, setRecentlyScannedLoanId] = useState<string | null>(null);

  // Patron loans stats
  const activeLoans = patron?.loans?.filter((l) => l.status === "ACTIVE") || [];
  const overdueLoans = activeLoans.filter(
    (l) => l.isOverdue || new Date(l.expectedReturn) < new Date()
  );
  const pastLoans = patron?.loans?.filter((l) => l.status === "RETURNED") || [];

  // Initialize selected return loans when patron or active loans change
  useEffect(() => {
    if (activeLoans.length > 0) {
      setSelectedReturnLoanIds(new Set(activeLoans.map((l) => l.id)));
    } else {
      setSelectedReturnLoanIds(new Set());
    }
  }, [patron?.id, activeLoans.length]);

  // Handle barcode scanned return asset tag
  useEffect(() => {
    if (!lastScannedReturnAssetTag || activeLoans.length === 0) return;
    const match = activeLoans.find(
      (l) => l.inventory?.assetTag?.toUpperCase() === lastScannedReturnAssetTag.toUpperCase()
    );
    if (match) {
      setSessionMode("RETUNERING");
      setSelectedReturnLoanIds((prev) => {
        const next = new Set(prev);
        next.add(match.id);
        return next;
      });
      setSelectedLoanId(match.id);
      setRecentlyScannedLoanId(match.id);
      setTimeout(() => setRecentlyScannedLoanId(null), 2500);
      setFeedbackToast({
        type: "success",
        message: `Afkrydset for returnering: ${match.inventory?.name || match.inventory?.assetTag}`,
      });
      setTimeout(() => setFeedbackToast(null), 2500);
      if (onClearScannedReturnAssetTag) {
        onClearScannedReturnAssetTag();
      }
    }
  }, [lastScannedReturnAssetTag, activeLoans, onClearScannedReturnAssetTag]);

  const toggleLoanSelected = (loanId: string) => {
    setSelectedReturnLoanIds((prev) => {
      const next = new Set(prev);
      if (next.has(loanId)) {
        next.delete(loanId);
      } else {
        next.add(loanId);
      }
      return next;
    });
  };

  const toggleSelectAllLoans = () => {
    if (selectedReturnLoanIds.size === activeLoans.length) {
      setSelectedReturnLoanIds(new Set());
    } else {
      setSelectedReturnLoanIds(new Set(activeLoans.map((l) => l.id)));
    }
  };

  // Determine current target loan for verification & return actions in RETUNERING mode
  const targetLoan =
    (selectedLoanId ? activeLoans.find((l) => l.id === selectedLoanId) : null) ||
    (inspectedLoan ? (activeLoans.find((l) => l.id === inspectedLoan.id) || inspectedLoan) : null) ||
    activeLoans[0] ||
    null;

  // Selected loan verification & actions state
  const [isProcessingLoan, setIsProcessingLoan] = useState(false);
  const [isEditingLoan, setIsEditingLoan] = useState(false);
  const [newReturnDate, setNewReturnDate] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [showDamageForm, setShowDamageForm] = useState(false);
  const [damageNotes, setDamageNotes] = useState("");
  const [sendToRepair, setSendToRepair] = useState(true);

  // Return handler for selected loans
  const handleReturnSelected = async () => {
    const idsToReturn = Array.from(selectedReturnLoanIds);
    if (idsToReturn.length === 0) {
      setFeedbackToast({
        type: "error",
        message: "Vælg mindst ét lån til returnering.",
      });
      setTimeout(() => setFeedbackToast(null), 3000);
      return;
    }
    try {
      setIsBulkReturning(true);
      await returnMultipleLoans({
        loanIds: idsToReturn,
      });

      const remainingCount = activeLoans.length - idsToReturn.length;
      setFeedbackToast({
        type: "success",
        message:
          remainingCount === 0
            ? `Alle ${idsToReturn.length} enheder er modtaget og afleveret!`
            : `${idsToReturn.length} enhed(er) afleveret. ${remainingCount} enhed(er) forbliver aktivt udlånt.`,
      });
      setTimeout(() => setFeedbackToast(null), 4000);
      setConfirmBulkReturn(false);
      onRefresh();
      if (onClearInspectedLoan) {
        onClearInspectedLoan();
      }
    } catch (err: any) {
      console.error("Bulk return error:", err);
      setFeedbackToast({
        type: "error",
        message: err.message || "Kunne ikke registrere returnering af lån.",
      });
      setTimeout(() => setFeedbackToast(null), 4000);
    } finally {
      setIsBulkReturning(false);
    }
  };

  // Reset edit & damage forms when switching target loan
  useEffect(() => {
    setIsEditingLoan(false);
    setShowDamageForm(false);
    setDamageNotes("");
  }, [selectedLoanId, inspectedLoan?.id]);

  const handleTargetReturn = async (damaged: boolean = false) => {
    if (!targetLoan) return;
    try {
      setIsProcessingLoan(true);
      await returnEquipment({
        loanId: targetLoan.id,
        status: damaged ? "DAMAGED" : "RETURNED",
        damageNotes: damaged ? damageNotes.trim() : undefined,
        sendToRepair: damaged ? sendToRepair : false,
      });
      setFeedbackToast({
        type: "success",
        message: damaged
          ? "Udstyr modtaget med skade og sat til reparation!"
          : "Udstyr modtaget og afleveret i god stand!",
      });
      setTimeout(() => setFeedbackToast(null), 3000);
      setShowDamageForm(false);
      setDamageNotes("");
      onRefresh();
      if (onClearInspectedLoan) {
        onClearInspectedLoan();
      }
    } catch (err: any) {
      console.error("Return error", err);
      setFeedbackToast({
        type: "error",
        message: err.message || "Kunne ikke registrere aflevering af udstyr.",
      });
      setTimeout(() => setFeedbackToast(null), 3500);
    } finally {
      setIsProcessingLoan(false);
    }
  };

  const handleSaveLoanModifications = async () => {
    if (!targetLoan) return;
    try {
      setIsProcessingLoan(true);
      await modifyLoan({
        loanId: targetLoan.id,
        expectedReturn: newReturnDate ? new Date(newReturnDate) : undefined,
        notes: editNotes,
      });
      setIsEditingLoan(false);
      setFeedbackToast({ type: "success", message: "Låneaftale opdateret!" });
      setTimeout(() => setFeedbackToast(null), 3000);
      onRefresh();
      if (onClearInspectedLoan) {
        onClearInspectedLoan();
      }
    } catch (err: any) {
      console.error("Failed to modify loan", err);
      setFeedbackToast({ type: "error", message: err.message || "Kunne ikke opdatere lån." });
      setTimeout(() => setFeedbackToast(null), 3500);
    } finally {
      setIsProcessingLoan(false);
    }
  };

  const startEditingLoan = () => {
    if (!targetLoan) return;
    setNewReturnDate(new Date(targetLoan.expectedReturn).toISOString().slice(0, 16));
    setEditNotes(targetLoan.notes || "");
    setIsEditingLoan(true);
  };

  const handleQuickDuration = (days: number) => {
    setSelectedDurationPreset(days);
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(16, 0, 0, 0);
    setExpectedReturn(d.toISOString().slice(0, 16));
  };

  const isTargetOverdue = Boolean(
    targetLoan &&
      (targetLoan.isOverdue ||
        (targetLoan.status === "ACTIVE" && new Date(targetLoan.expectedReturn) < new Date()))
  );

  const getTargetStatusDisplay = () => {
    if (!targetLoan) return "";
    if (targetLoan.status === "RETURNED") return "RETURNED";
    if (targetLoan.status === "DAMAGED") return "DAMAGED";
    if (isTargetOverdue) return "OVERDUE";
    return "CHECKED OUT";
  };

  const getTargetStatusColor = () => {
    if (!targetLoan) return "";
    if (targetLoan.status === "RETURNED") return "bg-zinc-800 text-zinc-300 border-zinc-700";
    if (targetLoan.status === "DAMAGED" || isTargetOverdue)
      return "bg-[#E6007E]/20 text-[#E6007E] border-[#E6007E]";
    return "bg-[#009FE3]/20 text-[#009FE3] border-[#009FE3]";
  };

  const handleCheckout = async () => {
    if (!patron) {
      setFeedbackToast({ type: "error", message: "Scan eller tilknyt en studerende før godkendelse." });
      setTimeout(() => setFeedbackToast(null), 3000);
      return;
    }
    if (items.length === 0) {
      setFeedbackToast({ type: "error", message: "Ingen udstyrsgenstande tilføjet til sessionen." });
      setTimeout(() => setFeedbackToast(null), 3000);
      return;
    }

    try {
      setIsSubmitting(true);
      await checkoutEquipment({
        patronId: patron.id,
        inventoryIds: items.map((item) => item.id),
        expectedReturn: new Date(expectedReturn),
        notes: notes.trim() || undefined,
      });

      setFeedbackToast({
        type: "success",
        message: `Udlån godkendt for ${items.length} genstand(e) til ${patron.studentId}!`,
      });
      setTimeout(() => setFeedbackToast(null), 3500);

      onCheckoutSuccess();
      onClearSession();
    } catch (err: any) {
      console.error("Checkout error:", err);
      setFeedbackToast({
        type: "error",
        message: err.message || "Fejl under godkendelse af udlån.",
      });
      setTimeout(() => setFeedbackToast(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSingleReturn = async (loanId: string) => {
    try {
      setReturningLoanId(loanId);
      await returnEquipment({
        loanId,
        status: "RETURNED",
      });
      setFeedbackToast({ type: "success", message: "Udstyr modtaget og afleveret!" });
      setTimeout(() => setFeedbackToast(null), 2500);
      onRefresh();
    } catch (err: any) {
      console.error("Return error", err);
      setFeedbackToast({ type: "error", message: err.message || "Kunne ikke registrere aflevering." });
      setTimeout(() => setFeedbackToast(null), 3000);
    } finally {
      setReturningLoanId(null);
    }
  };

  const initialLetter = patron?.studentId?.charAt(0).toUpperCase() || "?";
  const durationLabel =
    selectedDurationPreset === 7
      ? "7 dage"
      : selectedDurationPreset === 14
      ? "14 dage"
      : "30 dage";



  return (
    <div id="active-session-section" className="bg-[#151517] border border-[#333333] rounded-lg p-5 font-mono shadow-2xl relative">
      {/* Toast Alert */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`absolute top-4 right-4 z-20 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xl ${
              feedbackToast.type === "success"
                ? "bg-[#009FE3] text-black"
                : "bg-[#E6007E] text-white"
            }`}
          >
            {feedbackToast.type === "success" ? (
              <Check size={16} weight="bold" />
            ) : (
              <Warning size={16} weight="bold" />
            )}
            <span>{feedbackToast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Row: Aktiv Session & RYD SESSION */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2e2e2e]">
        <h2 className="text-base font-bold font-headline text-white tracking-wide">
          Aktiv Session
        </h2>
        <button
          type="button"
          onClick={onClearSession}
          className="text-xs text-[#888888] hover:text-[#FFED00] font-headline uppercase transition-colors cursor-pointer"
        >
          RYD SESSION
        </button>
      </div>

      {/* 2-Column Split: Left Student Profile, Right Scanned Gear */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* LEFT COLUMN: Student Profile & Mode Switchers (Figma 104:7690) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          {/* Top Row: Avatar & Student Identity */}
          <div className="flex items-center gap-4">
            {/* Circular Avatar */}
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shrink-0 ${
                patron
                  ? "bg-[#f6e825] text-black shadow-lg"
                  : "bg-[#202021] border border-dashed border-[#444444] text-zinc-500"
              }`}
            >
              <span className="font-notch font-bold text-4xl sm:text-5xl leading-none">
                {initialLetter}
              </span>
            </div>

            {/* Student ID & Email */}
            <div className="min-w-0">
              {patron ? (
                <>
                  <div className="text-3xl sm:text-4xl font-black font-notch text-white tracking-tight truncate">
                    {patron.studentId.toUpperCase()}
                  </div>
                  <div className="text-xs sm:text-sm text-zinc-400 font-notch truncate mt-1">
                    email: {patron.email || `${patron.studentId.toLowerCase()}@edu.zealand.dk`}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xl font-bold font-notch text-zinc-300">
                    Ingen studerende
                  </div>
                  <div className="text-xs text-zinc-500 font-mono mt-1">
                    Scan studiekort eller søg student ID for at tilknytte.
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Middle Card: 4-Row Stats (Aktive lån, Overskredet, Tidligere lån, Oprettet) */}
          <div className="bg-[#202021] border border-[#444444] rounded-lg p-3.5 space-y-2 text-xs font-headline">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Aktive lån:</span>
              <span className="font-bold text-white font-mono">{activeLoans.length}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Overskredet:</span>
              <span
                className={`font-bold font-mono ${
                  overdueLoans.length > 0 ? "text-[#E6007E]" : "text-white"
                }`}
              >
                {overdueLoans.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Tidligere lån:</span>
              <span className="font-bold text-white font-mono">{pastLoans.length}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Oprettet:</span>
              <span className="text-zinc-400 font-mono">
                {patron?.createdAt
                  ? new Date(patron.createdAt).toLocaleDateString("da-DK")
                  : "-"}
              </span>
            </div>
          </div>

          {/* Bottom Row: Large Mode Action Buttons (UDLEJNING, RETUNÉRING) */}
          <div>
            <div className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider mb-2">
              Aktivitet
            </div>
            <div className="flex items-center gap-3">
              {/* UDLEJNING */}
              <button
                type="button"
                onClick={() => setSessionMode("UDLEJNING")}
                className={`flex-1 py-4 px-2 rounded-lg font-bold font-mono text-sm tracking-wider transition-all cursor-pointer text-center ${
                  sessionMode === "UDLEJNING"
                    ? "bg-[#ffd900] text-black shadow-lg shadow-[#ffd900]/10"
                    : "bg-[#202021] border border-[#444444] text-zinc-400 hover:text-white"
                }`}
              >
                UDLEJNING
              </button>

              {/* RETUNÉRING */}
              <button
                type="button"
                onClick={() => setSessionMode("RETUNERING")}
                className={`flex-1 py-4 px-2 rounded-lg font-bold font-mono text-sm tracking-wider transition-all cursor-pointer text-center ${
                  sessionMode === "RETUNERING"
                    ? "bg-[#ffd900] text-black shadow-lg shadow-[#ffd900]/10"
                    : "bg-[#202021] border border-[#444444] text-white hover:bg-zinc-800"
                }`}
              >
                RETUNÉRING
              </button>
            </div>
          </div>
        </div>

        {/* Vertical divider line for desktop */}
        <div className="hidden lg:block lg:col-span-1 border-r border-[#262626] mx-auto w-0 h-full" />

        {/* RIGHT COLUMN: Scanned Gear & Checkout Workspace (Figma 104:7722) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {sessionMode === "UDLEJNING" ? (
            <>
              {/* Ongoing Loans Warning / Streamlined Notice */}
              {activeLoans.length > 0 && (
                <div className="bg-[#202021] border border-amber-500/40 rounded-lg p-3 text-xs flex items-center justify-between gap-3 shadow-md">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold font-headline">
                      <Warning size={16} weight="bold" />
                      <span>{activeLoans.length} igangværende lån på denne profil</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] font-mono mt-0.5 truncate">
                      {activeLoans.map((l) => l.inventory?.name || l.inventory?.assetTag).join(", ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSessionMode("RETUNERING")}
                    className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 rounded-md font-mono text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                  >
                    Se lån →
                  </button>
                </div>
              )}

              {/* Scanned Equipment List */}
              <div>
                <div className="text-sm font-bold font-headline text-white mb-2">
                  Scannet udstyr ({items.length})
                </div>

                <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                  {items.length === 0 ? (
                    <div className="p-4 rounded-lg border border-dashed border-[#444444] bg-[#202021]/30 text-center text-xs text-zinc-500 font-mono">
                      Scan udstyrs stregkode (f.eks. ML-CAM-001) for at tilføje.
                    </div>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#202021] border border-[#444444] rounded-lg p-2.5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-md bg-[#333333] flex items-center justify-center text-zinc-400 shrink-0">
                            <Camera size={20} weight="regular" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold font-notch text-white truncate text-xs">
                              {item.name}
                            </div>
                            <div className="text-zinc-400 text-[11px] font-mono">
                              Tag: <span className="text-[#009FE3]">[{item.assetTag}]</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="px-2 py-0.5 rounded border border-zinc-600 text-zinc-400 hover:text-red-400 hover:border-red-500 transition-colors text-xs font-bold"
                          title="Fjern genstand"
                        >
                          X
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Rental Duration Preset Controls */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-400 font-headline">
                  Udlejnings periode ({durationLabel})
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {/* Date Input */}
                  <input
                    type="datetime-local"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    className="bg-[#151517] border border-[#333333] text-zinc-200 text-xs px-3 py-1.5 rounded-lg outline-none flex-1 font-mono"
                  />

                  {/* Preset Pills */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {[
                      { days: 7, label: "1+ Uge" },
                      { days: 14, label: "2+ Uger" },
                      { days: 30, label: "+1 Måned" },
                    ].map((p) => {
                      const isActive = selectedDurationPreset === p.days;
                      return (
                        <button
                          key={p.days}
                          type="button"
                          onClick={() => handleQuickDuration(p.days)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors cursor-pointer ${
                            isActive
                              ? "bg-[#ffd900] text-black"
                              : "bg-[#202021] text-zinc-300 hover:text-white border border-[#444444]"
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Optional Comment Input */}
              <div>
                <input
                  type="text"
                  placeholder="Tilføj kommentar eller note (Valgfri)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#151517] border border-[#333333] text-white text-xs px-3 py-2 rounded-lg outline-none placeholder:text-zinc-500 font-mono focus:border-zinc-500"
                />
              </div>

              {/* Confirmation Checkout Button */}
              <div>
                <button
                  type="button"
                  disabled={!patron || items.length === 0 || isSubmitting}
                  onClick={handleCheckout}
                  className={`w-full py-2.5 rounded-lg font-bold font-mono text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    !patron || items.length === 0 || isSubmitting
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                      : "bg-white text-black hover:bg-[#ffd900] shadow-md hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>GODKEND</span>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* RETUNÉRING MODE: Interactive Return Manifest Checklist */
            <div className="space-y-4">
              {/* Header row with Title and Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-bold font-headline text-white">
                    Udlånt udstyr
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#202021] text-zinc-300 border border-[#444444]">
                    {activeLoans.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {activeLoans.length > 0 && (
                    <>
                      {/* Select All / Deselect All Toggle Button */}
                      <button
                        type="button"
                        onClick={toggleSelectAllLoans}
                        className="px-2.5 py-1 rounded-md bg-[#202021] hover:bg-zinc-800 border border-[#444444] hover:border-zinc-500 text-zinc-300 hover:text-white font-headline text-xs transition-colors cursor-pointer"
                      >
                        {selectedReturnLoanIds.size === activeLoans.length
                          ? "Fravælg alle"
                          : "Vælg alle"}
                      </button>

                      {/* Dynamic Batch Return Button */}
                      {!confirmBulkReturn ? (
                        <button
                          type="button"
                          disabled={isBulkReturning || selectedReturnLoanIds.size === 0}
                          onClick={() => setConfirmBulkReturn(true)}
                          className={`px-3 py-1 rounded-md font-bold font-mono text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                            selectedReturnLoanIds.size === 0 || isBulkReturning
                              ? "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed"
                              : "bg-[#009FE3] hover:bg-[#0089c4] text-black border border-[#009FE3]"
                          }`}
                          title="Returnér valgte genstande"
                        >
                          <Check size={14} weight="bold" />
                          <span>
                            Returnér valgte ({selectedReturnLoanIds.size} af {activeLoans.length})
                          </span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-[#202021] border border-[#009FE3]/50 rounded-md p-1 text-xs">
                          <span className="text-zinc-200 text-[11px] font-mono px-1">
                            Returnér {selectedReturnLoanIds.size} genstand(e)?
                          </span>
                          <button
                            type="button"
                            disabled={isBulkReturning}
                            onClick={handleReturnSelected}
                            className="px-2.5 py-0.5 rounded bg-[#009FE3] hover:bg-[#0089c4] text-black font-bold text-[11px] font-mono transition-colors cursor-pointer"
                          >
                            {isBulkReturning ? "..." : "Bekræft"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmBulkReturn(false)}
                            className="px-2 py-0.5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[11px] font-mono transition-colors cursor-pointer"
                          >
                            Nej
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  {targetLoan && (
                    <span
                      className={`px-2.5 py-0.5 rounded-full border font-bold text-[10px] tracking-wider ${getTargetStatusColor()}`}
                    >
                      {getTargetStatusDisplay()}
                    </span>
                  )}
                </div>
              </div>

              {/* Informative Partial Return Notice */}
              {activeLoans.length > 0 &&
                selectedReturnLoanIds.size > 0 &&
                selectedReturnLoanIds.size < activeLoans.length && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                    <Warning size={15} weight="bold" className="shrink-0" />
                    <span>
                      Delvis returnering: {activeLoans.length - selectedReturnLoanIds.size} udlån forbliver aktive hos låneren.
                    </span>
                  </div>
                )}

              {activeLoans.length === 0 && !targetLoan ? (
                <div className="p-4 rounded-lg border border-dashed border-[#444444] bg-[#202021]/30 text-center text-xs text-zinc-500 font-mono">
                  Ingen aktive lån registreret for denne studerende.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Interactive Return Manifest Checklist */}
                  {activeLoans.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Checkliste over aktive lån</span>
                        <span>Klik på en række for detaljer / skade</span>
                      </div>
                      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                        {activeLoans.map((loan) => {
                          const isSelectedForReturn = selectedReturnLoanIds.has(loan.id);
                          const isTarget = targetLoan?.id === loan.id;
                          const isJustScanned = recentlyScannedLoanId === loan.id;
                          const isLoanLate =
                            loan.isOverdue ||
                            (loan.status === "ACTIVE" && new Date(loan.expectedReturn) < new Date());

                          return (
                            <div
                              key={loan.id}
                              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all text-xs font-mono ${
                                isJustScanned
                                  ? "ring-2 ring-[#009FE3] bg-[#009FE3]/15 border-[#009FE3]"
                                  : isTarget
                                  ? "bg-[#202021] border-[#FFED00]/70 shadow-md"
                                  : "bg-[#18181a] border-[#333333] hover:border-zinc-500"
                              }`}
                            >
                              {/* Left: Checkbox + Asset info + Click to inspect */}
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <label className="flex items-center cursor-pointer select-none pl-1 py-1">
                                  <input
                                    type="checkbox"
                                    checked={isSelectedForReturn}
                                    onChange={() => toggleLoanSelected(loan.id)}
                                    className="w-4 h-4 rounded border-[#444444] bg-[#151517] text-[#009FE3] accent-[#009FE3] cursor-pointer"
                                  />
                                </label>

                                <div
                                  onClick={() => setSelectedLoanId(loan.id)}
                                  className="cursor-pointer min-w-0 flex-1"
                                  title="Klik for at se detaljer og redigere/rapportere skade"
                                >
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-white font-notch truncate max-w-[160px] sm:max-w-[220px]">
                                      {loan.inventory?.name || "Equipment Item"}
                                    </span>
                                    <span className="text-[#009FE3] font-mono text-[11px] font-bold bg-[#009FE3]/10 px-1.5 py-0.5 rounded border border-[#009FE3]/30">
                                      [{loan.inventory?.assetTag}]
                                    </span>
                                    {isJustScanned && (
                                      <motion.span
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1"
                                      >
                                        <Check size={12} weight="bold" />
                                        Scannet
                                      </motion.span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3 mt-1 text-[11px]">
                                    <span
                                      className={
                                        isLoanLate
                                          ? "text-[#E6007E] font-bold"
                                          : "text-zinc-400 font-mono"
                                      }
                                    >
                                      {isLoanLate ? "Overskredet: " : "Forfald: "}
                                      {new Date(loan.expectedReturn).toLocaleDateString("da-DK", {
                                        day: "numeric",
                                        month: "short",
                                      })}
                                    </span>

                                    <span className="text-zinc-500 text-[10px]">
                                      {loan.inventory?.lab?.name || "Køge"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Quick actions (Inspect badge + 1-click single return) */}
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedLoanId(loan.id)}
                                  className={`px-2 py-1 rounded text-[11px] font-headline transition-colors cursor-pointer ${
                                    isTarget
                                      ? "bg-[#FFED00]/20 text-[#FFED00] border border-[#FFED00]/40 font-bold"
                                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                                  }`}
                                >
                                  {isTarget ? "Valgt" : "Inspicér"}
                                </button>

                                <button
                                  type="button"
                                  disabled={returningLoanId === loan.id}
                                  onClick={() => handleSingleReturn(loan.id)}
                                  className="px-2.5 py-1 rounded bg-[#202021] hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-200 hover:text-[#009FE3] font-bold text-[11px] font-mono transition-colors cursor-pointer"
                                  title="Aflever kun denne genstand nu"
                                >
                                  {returningLoanId === loan.id ? "..." : "Aflever"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Expanded Verification & Action Card for Target Loan */}
                  {targetLoan && (
                    <div className="space-y-3 font-mono">
                      {/* Equipment Asset Card */}
                      <div className="bg-[#1e1e21] border border-[#333333] rounded-xl p-3.5 text-xs">
                        <div className="text-zinc-400 text-[11px] font-semibold">Equipment Asset</div>
                        <div className="text-base sm:text-lg font-bold font-notch text-white mt-0.5">
                          {targetLoan.inventory?.name || "Equipment Item"}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs mt-1.5">
                          <span className="text-[#009FE3] font-bold">
                            Tag: [{targetLoan.inventory?.assetTag}]
                          </span>
                          <span className="text-zinc-400 font-bold inline-flex items-center gap-1.5">
                            <Buildings size={14} weight="regular" />
                            <span>{targetLoan.inventory?.lab?.name || "MediaLab (Køge)"}</span>
                          </span>
                        </div>
                      </div>

                      {/* Dates: Checked Out & Expected Return */}
                      {!isEditingLoan ? (
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-[#1e1e21] border border-[#333333] rounded-xl p-3">
                            <div className="text-zinc-400 text-[11px] font-semibold">Checked Out</div>
                            <div className="text-sm font-bold font-notch text-white mt-1">
                              {new Date(targetLoan.checkoutDate).toLocaleDateString("en-DK", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                          <div className="bg-[#1e1e21] border border-[#333333] rounded-xl p-3">
                            <div className="text-zinc-400 text-[11px] font-semibold">Expected Return</div>
                            <div
                              className={`text-sm font-bold font-notch mt-1 ${
                                isTargetOverdue ? "text-[#E6007E]" : "text-[#FFED00]"
                              }`}
                            >
                              {new Date(targetLoan.expectedReturn).toLocaleDateString("en-DK", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Inline Edit Form */
                        <div className="bg-[#1e1e21] border border-[#FFED00]/60 rounded-xl p-3.5 space-y-2.5 text-xs">
                          <div className="text-[#FFED00] font-bold uppercase tracking-wider text-[11px]">
                            Forlæng / Rediger Låneaftale
                          </div>
                          <div>
                            <label className="text-zinc-400 text-[11px] block mb-1">
                              Ny forventet returdato
                            </label>
                            <input
                              type="datetime-local"
                              value={newReturnDate}
                              onChange={(e) => setNewReturnDate(e.target.value)}
                              className="w-full bg-[#151517] border border-[#333333] focus:border-[#FFED00] text-white rounded-lg p-2 outline-none text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-zinc-400 text-[11px] block mb-1">
                              Noter / Begrundelse for forlængelse
                            </label>
                            <textarea
                              rows={2}
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              className="w-full bg-[#151517] border border-[#333333] focus:border-[#FFED00] text-white rounded-lg p-2 outline-none text-xs"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setIsEditingLoan(false)}
                              className="px-3 py-1 bg-zinc-800 text-zinc-300 hover:text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
                            >
                              Annuller
                            </button>
                            <button
                              type="button"
                              disabled={isProcessingLoan}
                              onClick={handleSaveLoanModifications}
                              className="px-4 py-1 bg-[#FFED00] text-black font-bold rounded-full text-xs hover:bg-[#e6d500] transition-colors cursor-pointer"
                            >
                              {isProcessingLoan ? "Gemmer..." : "Gem Ændringer"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Notes Card */}
                      {!isEditingLoan && targetLoan.notes && (
                        <div className="bg-[#1e1e21] border border-[#333333] rounded-xl p-3 text-xs">
                          <span className="text-zinc-400 font-semibold block mb-0.5 text-[11px]">
                            Noter:
                          </span>
                          <p className="text-zinc-200">{targetLoan.notes}</p>
                        </div>
                      )}

                      {/* Inline Damage Form */}
                      {showDamageForm && (
                        <div className="bg-[#E6007E]/10 border border-[#E6007E]/40 rounded-xl p-3.5 space-y-2.5 text-xs">
                          <label className="text-zinc-200 font-bold block text-[11px]">
                            Beskrivelse af skade eller defekt
                          </label>
                          <textarea
                            rows={2}
                            value={damageNotes}
                            onChange={(e) => setDamageNotes(e.target.value)}
                            placeholder="Beskriv skaden, manglende dele eller funktionelle fejl..."
                            className="w-full bg-[#151517] border border-zinc-700 focus:border-[#E6007E] text-white rounded-lg p-2 outline-none text-xs"
                          />
                          <label className="flex items-center gap-2 text-zinc-300 cursor-pointer pt-0.5 text-[11px]">
                            <input
                              type="checkbox"
                              checked={sendToRepair}
                              onChange={(e) => setSendToRepair(e.target.checked)}
                              className="accent-[#E6007E] w-3.5 h-3.5 rounded"
                            />
                            <span>Sæt udstyrsstatus til MAINTENANCE (sendes til reparation)</span>
                          </label>
                        </div>
                      )}

                      {/* Action Row */}
                      <div className="pt-2 border-t border-[#2e2e2e] flex flex-wrap items-center justify-between gap-2">
                        <div>
                          {targetLoan.status === "ACTIVE" && !isEditingLoan && (
                            <button
                              type="button"
                              onClick={startEditingLoan}
                              className="px-3.5 py-2 rounded-full bg-[#1e1e21] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <PencilSimple size={14} weight="bold" />
                              <span>Forlæng / Rediger</span>
                            </button>
                          )}
                        </div>

                        {targetLoan.status === "ACTIVE" && !isEditingLoan && (
                          <div className="flex items-center gap-2">
                            {!showDamageForm ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setShowDamageForm(true)}
                                  className="px-3.5 py-2 rounded-full bg-[#1e1e21] hover:bg-rose-950/40 border border-[#E6007E]/50 text-[#E6007E] font-bold text-xs transition-colors cursor-pointer"
                                >
                                  Rapporter Skade
                                </button>
                                <button
                                  type="button"
                                  disabled={isProcessingLoan}
                                  onClick={() => handleTargetReturn(false)}
                                  className="px-5 py-2 rounded-full bg-[#009FE3] hover:bg-[#0089c4] text-black font-extrabold text-xs transition-all shadow-md shadow-[#009FE3]/25 cursor-pointer"
                                >
                                  {isProcessingLoan ? "Behandler..." : "Check In Equipment"}
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setShowDamageForm(false)}
                                  className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-full text-xs font-bold cursor-pointer"
                                >
                                  Annuller
                                </button>
                                <button
                                  type="button"
                                  disabled={isProcessingLoan}
                                  onClick={() => handleTargetReturn(true)}
                                  className="px-4 py-1.5 rounded-full bg-[#E6007E] hover:bg-[#c9006e] text-white font-extrabold text-xs transition-all shadow-md shadow-[#E6007E]/25 cursor-pointer"
                                >
                                  {isProcessingLoan ? "Registrerer..." : "Bekræft defekt aflevering"}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
