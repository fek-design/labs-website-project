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
import { OperationalStatus } from "@prisma/client";

interface InventoryGridViewProps {
  items: any[];
  isLoading: boolean;
  onEditItem: (item: any) => void;
}

export function InventoryGridView({
  items,
  isLoading,
  onEditItem,
}: InventoryGridViewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-4 bg-[#202021]/60 border border-[#333333] rounded-lg animate-pulse min-h-[220px]"
          >
            <div className="flex flex-col gap-3">
              <div className="w-[50px] h-[50px] rounded-lg bg-[#333333]" />
              <div className="w-3/4 h-5 bg-[#333333] rounded" />
              <div className="w-1/2 h-3.5 bg-[#2a2a2d] rounded" />
              <div className="w-full h-10 bg-[#2a2a2d]/60 rounded" />
            </div>
            <div className="w-full h-8 bg-[#2a2a2d] rounded mt-4" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
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
            className="group flex flex-col justify-between p-4 bg-[#202021] hover:bg-[#252527] border border-[#444444] hover:border-[#666666] rounded-lg transition-all cursor-pointer shadow-sm min-h-[220px]"
          >
            {/* Top section: Icon, Header, Subtitle, Description */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="w-[50px] h-[50px] shrink-0 rounded-lg bg-[#444444]/60 border border-[#555555]/40 flex items-center justify-center text-[#888888] group-hover:text-white group-hover:bg-[#444444] transition-colors">
                  {isGear ? <Camera size={26} weight="regular" /> : <Wrench size={26} weight="regular" />}
                </div>

                {/* Status or Manuals pill */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {manualCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#1da9e4] bg-[#1da9e4]/10 border border-[#1da9e4]/30 px-2 py-0.5 rounded font-bold">
                      <FileText size={11} /> {manualCount}
                    </span>
                  )}
                  {item.operationalStatus === "RETIRED" && (
                    <span className="text-[10px] font-bold text-[#e51d87] bg-[#e51d87]/10 border border-[#e51d87]/30 px-2 py-0.5 rounded uppercase">
                      ØDELAGT
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-white text-base font-bold font-['Stack_Sans_Notch',sans-serif] line-clamp-1">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#888888] font-['Stack_Sans_Headline',sans-serif] mt-0.5">
                  <span className="font-mono text-[#d1d5db] font-semibold tracking-wider">
                    {item.assetTag}
                  </span>
                  <span>•</span>
                  <span>{isGear ? "Udstyr" : "Maskine"}</span>
                </div>
              </div>

              {/* Description preview */}
              <p className="text-xs text-[#888888] font-['Stack_Sans_Text',sans-serif] line-clamp-2 leading-relaxed">
                {item.notes || "Ingen yderligere beskrivelse angivet."}
              </p>
            </div>

            {/* Bottom section: Pill cluster */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#333333] mt-3">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                {/* Lab */}
                <div className="flex flex-col px-2 py-0.5 bg-[#151517] border border-[#333333] rounded">
                  <span className="text-[8px] font-bold text-[#888888] uppercase">LAB</span>
                  <span className="text-[10px] font-bold text-white uppercase truncate max-w-[80px]">
                    {item.lab?.slug || "LAB"}
                  </span>
                </div>

                {/* Status */}
                <div className="flex flex-col px-2 py-0.5 bg-[#151517] border border-[#333333] rounded">
                  <span className="text-[8px] font-bold text-[#888888] uppercase">STATUS</span>
                  <span className={`text-[10px] font-bold flex items-center gap-1 ${statusMeta.color}`}>
                    <StatusIcon size={10} weight="bold" />
                    {statusMeta.text}
                  </span>
                </div>
              </div>

              {/* Edit Icon Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditItem(item);
                }}
                className="flex items-center justify-center w-7 h-7 rounded bg-[#151517] hover:bg-[#1da9e4] border border-[#333333] hover:border-[#1da9e4] text-[#888888] hover:text-white transition-all shrink-0"
                title="Rediger genstand"
              >
                <PencilSimple size={13} weight="bold" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
