"use client";

import React from "react";
import { MagnifyingGlass, Plus, List, SquaresFour, Package } from "@phosphor-icons/react";

interface InventoryToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  onOpenCreateModal: () => void;
  onOpenBundlePresetsModal?: () => void;
}

export function InventoryToolbar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onOpenCreateModal,
  onOpenBundlePresetsModal,
}: InventoryToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
      {/* Search Bar with integrated View Toggles */}
      <div className="flex-1 flex items-center justify-between bg-[#151517] border border-[#333333] rounded-lg px-4 py-2 min-h-[48px] transition-colors focus-within:border-[#555555]">
        <div className="flex items-center gap-3 flex-1 mr-3">
          <MagnifyingGlass size={20} className="text-[#d1d5db] shrink-0" weight="regular" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Scan eller søg..."
            className="w-full bg-transparent text-sm text-[#ffffff] placeholder-[#888888] focus:outline-none font-['Stack_Sans_Text',sans-serif]"
          />
        </div>

        {/* View Mode Pills Wrapper */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-[#262626]">
          {/* List View Toggle */}
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            title="Listevisning"
            className={`flex items-center justify-center w-8 h-8 rounded transition-all ${
              viewMode === "list"
                ? "bg-[#f2f2f2] border border-[#7d7d7d] text-black shadow-sm"
                : "bg-transparent text-[#888888] hover:text-white hover:bg-[#202021]"
            }`}
          >
            <List size={16} weight={viewMode === "list" ? "bold" : "regular"} />
          </button>

          {/* Grid View Toggle */}
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            title="Gittervisning"
            className={`flex items-center justify-center w-8 h-8 rounded transition-all ${
              viewMode === "grid"
                ? "bg-[#f2f2f2] border border-[#7d7d7d] text-black shadow-sm"
                : "bg-transparent text-[#888888] hover:text-white hover:bg-[#202021]"
            }`}
          >
            <SquaresFour size={16} weight={viewMode === "grid" ? "bold" : "regular"} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Secondary Action: Pakkesæt / Kits */}
        {onOpenBundlePresetsModal && (
          <button
            type="button"
            onClick={onOpenBundlePresetsModal}
            className="flex items-center justify-center gap-2 bg-[#202021] hover:bg-[#262626] border border-[#333333] hover:border-[#444444] text-white px-4 py-2.5 rounded-lg font-['Stack_Sans_Text',sans-serif] text-sm font-semibold min-h-[48px] transition-all shrink-0 active:scale-[0.98]"
            title="Administrer faste pakkesæt & tilbehørskits"
          >
            <Package size={16} weight="bold" className="text-[#009FE3]" />
            <span>Pakkesæt</span>
          </button>
        )}

        {/* Primary Action Button: Tilføj */}
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-2 bg-[#1da9e4] hover:bg-[#1895ca] text-white px-5 py-2.5 rounded-lg font-['Stack_Sans_Text',sans-serif] text-sm font-bold min-h-[48px] transition-all shadow-sm shrink-0 active:scale-[0.98]"
        >
          <span>Tilføj</span>
          <Plus size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}
