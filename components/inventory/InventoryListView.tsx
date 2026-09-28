"use client";

import React from "react";
import {
  Camera,
  Wrench,
  PencilSimple,
  CheckCircle,
  Clock,
  WarningCircle,
  XCircle,
  FileText,
} from "@phosphor-icons/react";
import { OperationalStatus, HardwareType } from "@prisma/client";

interface InventoryListViewProps {
  items: any[];
  isLoading: boolean;
  onEditItem: (item: any) => void;
  onQuickStatusChange?: (item: any, newStatus: OperationalStatus) => void;
}

export function InventoryListView({
  items,
  isLoading,
  onEditItem,
  onQuickStatusChange,
}: InventoryListViewProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5 w-full">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3.5 bg-[#202021]/60 border border-[#333333] rounded-lg animate-pulse min-h-[76px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-[50px] h-[50px] rounded-lg bg-[#333333]" />
              <div className="flex flex-col gap-2">
                <div className="w-48 h-4 bg-[#333333] rounded" />
                <div className="w-28 h-3 bg-[#2a2a2d] rounded" />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="w-24 h-6 bg-[#2a2a2d] rounded" />
              <div className="w-20 h-6 bg-[#2a2a2d] rounded" />
              <div className="w-28 h-6 bg-[#2a2a2d] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#151517] border border-[#333333] rounded-xl text-center">
        <Wrench size={40} className="text-[#666666] mb-3" weight="light" />
        <h3 className="text-white font-bold text-base mb-1 font-['Stack_Sans_Headline',sans-serif]">
          Ingen genstande fundet
        </h3>
        <p className="text-[#888888] text-xs max-w-sm font-['Stack_Sans_Text',sans-serif]">
          Prøv at justere søgningen eller dine filtre for at se inventar.
        </p>
      </div>
    );
  }

  const getStatusLabel = (status: OperationalStatus, hasActiveLoan: boolean) => {
    if (hasActiveLoan) {
      return { text: "I BRUG", color: "text-[#1da9e4]", bg: "bg-[#082f49]/30", icon: Clock };
    }
    switch (status) {
      case "AVAILABLE":
        return { text: "LEDIG", color: "text-[#34d399]", bg: "bg-[#052e16]/30", icon: CheckCircle };
      case "MAINTENANCE":
        return { text: "VEDLIGEHOLDELSE", color: "text-[#f59e0b]", bg: "bg-[#451a03]/30", icon: WarningCircle };
      case "BROKEN":
        return { text: "DEFEKT", color: "text-[#e51d87]", bg: "bg-[#500724]/30", icon: XCircle };
      default:
        return { text: String(status), color: "text-white", bg: "bg-[#202021]", icon: CheckCircle };
    }
  };

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {items.map((item) => {
        const activeLoan = item.loans?.[0];
        const statusMeta = getStatusLabel(item.operationalStatus, Boolean(activeLoan));
        const StatusIcon = statusMeta.icon;
        const isGear = item.hardwareType === "BORROWABLE_GEAR";
        const manualCount = item.manuals?.length || 0;

        return (
          <div
            key={item.id}
            onClick={() => onEditItem(item)}
            className="group flex flex-col md:flex-row md:items-center justify-between p-3 sm:p-3.5 bg-[#202021] hover:bg-[#252527] border border-[#444444] hover:border-[#666666] rounded-lg gap-3 transition-all cursor-pointer shadow-sm"
          >
            {/* Left: Thumbnail + Identity */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-[50px] h-[50px] shrink-0 rounded-lg bg-[#444444]/60 border border-[#555555]/40 flex items-center justify-center text-[#888888] group-hover:text-white group-hover:bg-[#444444] transition-colors">
                {isGear ? <Camera size={26} weight="regular" /> : <Wrench size={26} weight="regular" />}
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white text-sm sm:text-base font-bold font-['Stack_Sans_Notch',sans-serif] truncate">
                    {item.name}
                  </h3>
                  {manualCount > 0 && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#1da9e4] bg-[#1da9e4]/10 border border-[#1da9e4]/30 px-1.5 py-0.5 rounded font-bold">
                      <FileText size={11} /> {manualCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#888888] font-['Stack_Sans_Headline',sans-serif] mt-0.5">
                  <span className="font-mono text-[#d1d5db] font-semibold tracking-wider">
                    {item.assetTag}
                  </span>
                  <span>•</span>
                  <span>{isGear ? "Udstyr" : "Maskine"}</span>
                  {item.lab?.name && (
                    <>
                      <span>•</span>
                      <span className="text-[#888888] truncate">{item.lab.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Pill Cluster matching Figma node 84:3629 */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#333333]">
              {/* Facility Lab Pill */}
              <div className="flex flex-col items-start px-2.5 py-1 bg-[#151517] border border-[#333333] rounded">
                <span className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">
                  FACILITET LAB
                </span>
                <span className="text-[11px] font-bold text-white uppercase tracking-tight">
                  {item.lab?.slug?.toUpperCase() || "LAB"}
                </span>
              </div>

              {/* Vertical divider */}
              <div className="hidden sm:block w-[1px] h-7 bg-[#333333]" />

              {/* Status Pill */}
              <div className="flex flex-col items-start px-2.5 py-1 bg-[#151517] border border-[#333333] rounded">
                <span className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">
                  STATUS
                </span>
                <span className={`text-[11px] font-bold flex items-center gap-1 ${statusMeta.color}`}>
                  <StatusIcon size={12} weight="bold" />
                  {statusMeta.text}
                </span>
              </div>

              {/* Vertical divider */}
              <div className="hidden sm:block w-[1px] h-7 bg-[#333333]" />

              {/* Activity / Loan Readiness Pill */}
              <div className="flex flex-col items-start px-2.5 py-1 bg-[#151517] border border-[#333333] rounded max-w-[170px] truncate">
                <span className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">
                  AKTIVITET
                </span>
                <span className="text-[11px] font-bold text-[#d1d5db] truncate">
                  {activeLoan
                    ? `Udlånt til ${activeLoan.patron?.name || "Låner"}`
                    : item.operationalStatus === "AVAILABLE"
                    ? "KLAR TIL UDLEJNING"
                    : "IKKE AKTIV"}
                </span>
              </div>

              {/* Vertical divider */}
              <div className="hidden sm:block w-[1px] h-7 bg-[#333333]" />

              {/* Action Button: Edit */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditItem(item);
                }}
                className="flex items-center justify-center w-8 h-8 rounded bg-[#151517] hover:bg-[#1da9e4] border border-[#333333] hover:border-[#1da9e4] text-[#888888] hover:text-white transition-all shadow-sm"
                title="Rediger genstand"
              >
                <PencilSimple size={15} weight="bold" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
