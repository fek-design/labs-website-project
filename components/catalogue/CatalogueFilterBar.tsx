"use client";

import React from "react";
import { LabSlug } from "@/lib/craft-data";
import { MagnifyingGlass, X } from "@phosphor-icons/react";

interface CatalogueFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLab: LabSlug | "all";
  onLabChange: (lab: LabSlug | "all") => void;
  availableLabs: LabSlug[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export function CatalogueFilterBar({
  searchQuery,
  onSearchChange,
  selectedLab,
  onLabChange,
  availableLabs,
  selectedCategory,
  onCategoryChange,
  categories,
  totalCount,
  filteredCount,
  onResetFilters,
  hasActiveFilters,
}: CatalogueFilterBarProps) {
  return (
    <div className="w-full space-y-6">
      {/* Search Bar - Figma node 144:351: #383838 background, sharp corners, rounded-none */}
      <div className="w-full bg-[#383838] p-3 sm:p-4 rounded-none border border-white/5 transition-all focus-within:border-[#009FE3]/60 focus-within:ring-1 focus-within:ring-[#009FE3]/40">
        <div className="relative flex items-center">
          <MagnifyingGlass
            size={18}
            weight="bold"
            className="text-zinc-400 shrink-0 ml-2"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Søg..."
            className="w-full bg-transparent px-3 py-1 text-sm sm:text-base text-white placeholder-[#CCCCCC] font-sans focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="p-1 text-zinc-400 hover:text-white transition-colors mr-1 cursor-pointer"
              aria-label="Ryd søgning"
            >
              <X size={14} weight="bold" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Row: Lab Tabs & Category Pills */}
      <div className="space-y-4">
        {/* Lab Switcher Tabs (Figma node 144:360 LAB) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mr-1">
            LAB:
          </span>
          <button
            type="button"
            onClick={() => onLabChange("all")}
            className={`px-3 py-1.5 text-xs font-mono uppercase rounded-none border transition-colors cursor-pointer ${
              selectedLab === "all"
                ? "bg-white text-black border-white font-medium"
                : "bg-zinc-900/80 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white"
            }`}
          >
            Alle Labs
          </button>
          {availableLabs.map((lab) => {
            const isActive = selectedLab === lab;
            return (
              <button
                key={lab}
                type="button"
                onClick={() => onLabChange(lab)}
                className={`px-3 py-1.5 text-xs font-mono uppercase rounded-none border transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#009FE3] text-black border-[#009FE3] font-semibold"
                    : "bg-zinc-900/80 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white"
                }`}
              >
                {lab}
              </button>
            );
          })}
        </div>

        {/* Category Pills (Figma node 144:360 KATEGORI) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mr-1">
            KATEGORI:
          </span>
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`px-3 py-1 text-xs font-sans rounded-none border transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-white text-black border-white font-medium"
                : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200"
            }`}
          >
            Alle
          </button>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1 text-xs font-sans rounded-none border transition-colors cursor-pointer ${
                  isActive
                    ? "bg-white text-black border-white font-medium"
                    : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Meta Bar: Results counter & Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs text-zinc-400 font-mono">
          <div>
            Viser{" "}
            <span className="text-white font-medium">{filteredCount}</span> af{" "}
            <span className="text-white font-medium">{totalCount}</span> projekter
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-[#009FE3] hover:text-[#009FE3]/80 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Nulstil filtre</span>
              <X size={12} weight="bold" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
