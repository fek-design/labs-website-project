"use client";

import React from "react";
import { CaretDown } from "@phosphor-icons/react";

interface InventoryFilterBarProps {
  totalCount: number;
  labs: Array<{ id: string; name: string; slug: string }>;
  selectedLab: string;
  onLabChange: (labSlug: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export function InventoryFilterBar({
  totalCount,
  labs,
  selectedLab,
  onLabChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
}: InventoryFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full border-b border-[#262626] pb-4">
      {/* Title with item counter */}
      <h2 className="text-xl sm:text-2xl font-bold text-white font-['Stack_Sans_Notch',sans-serif] tracking-tight">
        Tilgængeligt Udstyr &amp; maskiner <span className="text-[#888888] font-normal">{totalCount}</span>
      </h2>

      {/* Filter Cluster */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto">
        {/* LAB Filter */}
        <div className="flex flex-col gap-1.5 min-w-[130px] flex-1 sm:flex-initial">
          <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
            LAB
          </label>
          <div className="relative">
            <select
              value={selectedLab}
              onChange={(e) => onLabChange(e.target.value)}
              className="w-full appearance-none bg-[#151517] hover:bg-[#1a1a1d] text-white text-xs sm:text-sm font-bold font-['Stack_Sans_Text',sans-serif] border border-[#333333] hover:border-[#444444] rounded-lg px-3.5 py-2.5 pr-8 cursor-pointer focus:outline-none focus:border-[#1da9e4] focus:ring-1 focus:ring-[#1da9e4] transition-colors"
            >
              <option value="ALL">ALLE FACILITETER</option>
              <optgroup label="Køge Campus" className="bg-[#151517] text-zinc-400 font-semibold font-['Stack_Sans_Headline',sans-serif]">
                {labs.map((lab) => (
                  <option key={lab.id} value={lab.slug} className="text-white bg-[#151517] font-normal">
                    {lab.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <CaretDown
              size={14}
              weight="bold"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-[1px] h-8 bg-[#333333] self-end mb-1" />

        {/* TYPE Filter */}
        <div className="flex flex-col gap-1.5 min-w-[140px] flex-1 sm:flex-initial">
          <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
            TYPE
          </label>
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="w-full appearance-none bg-[#151517] hover:bg-[#1a1a1d] text-white text-xs sm:text-sm font-bold font-['Stack_Sans_Text',sans-serif] border border-[#333333] hover:border-[#444444] rounded-lg px-3.5 py-2.5 pr-8 cursor-pointer focus:outline-none focus:border-[#1da9e4] transition-colors"
            >
              <option value="ALL">ALLE</option>
              <option value="BORROWABLE_GEAR">Udstyr (Udlån)</option>
              <option value="STATIONARY_MACHINE">Maskine (Stationær)</option>
            </select>
            <CaretDown
              size={14}
              weight="bold"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-[1px] h-8 bg-[#333333] self-end mb-1" />

        {/* STATUS Filter */}
        <div className="flex flex-col gap-1.5 min-w-[130px] flex-1 sm:flex-initial">
          <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
            STATUS
          </label>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full appearance-none bg-[#151517] hover:bg-[#1a1a1d] text-white text-xs sm:text-sm font-bold font-['Stack_Sans_Text',sans-serif] border border-[#333333] hover:border-[#444444] rounded-lg px-3.5 py-2.5 pr-8 cursor-pointer focus:outline-none focus:border-[#1da9e4] transition-colors"
            >
              <option value="ALL">ALLE</option>
              <option value="AVAILABLE">Ledig</option>
              <option value="MAINTENANCE">Vedligeholdelse</option>
              <option value="BROKEN">Defekt / Udfaset</option>
            </select>
            <CaretDown
              size={14}
              weight="bold"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
