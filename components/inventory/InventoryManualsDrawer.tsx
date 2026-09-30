"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  MagnifyingGlass,
  Check,
  CheckCircle,
  Spinner,
} from "@phosphor-icons/react";
import { getManualsCatalog } from "@/app/actions/manuals";

interface InventoryManualsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedManualIds: string[];
  onToggleManual: (manual: any) => void;
  inline?: boolean;
}

export function InventoryManualsDrawer({
  isOpen,
  onClose,
  selectedManualIds,
  onToggleManual,
  inline = false,
}: InventoryManualsDrawerProps) {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getManualsCatalog(searchQuery)
        .then((res) => setCatalog(res || []))
        .catch((err) => console.error("Failed to load manuals catalog", err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, searchQuery]);

  if (!isOpen) return null;

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "0 KB";
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  const cardContent = (
    <div
      className="w-full max-w-[700px] max-h-[90vh] overflow-y-auto bg-[#202021] border border-[#444444] rounded-xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4 text-white font-['Stack_Sans_Text',sans-serif]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header matching Figma node 87:6082 */}
      <div className="flex items-start justify-between border-b border-[#333333] pb-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold font-['Stack_Sans_Notch',sans-serif] uppercase tracking-wider text-white">
              MANUALER
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-['Stack_Sans_Headline',sans-serif] bg-[#1da9e4]/20 border border-[#1da9e4]/40 text-[#1da9e4]">
              Valgt {selectedManualIds.length}
            </span>
          </div>
          <p className="text-xs text-[#888888] font-['Stack_Sans_Headline',sans-serif] mt-0.5">
            Many-to-Many documentation library • Link shared safety SOPs &amp; guides across all machines
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-[#888888] hover:text-white hover:bg-[#333333] transition-colors"
        >
          <X size={18} weight="bold" />
        </button>
      </div>

      {/* Search Bar matching Figma node 87:6087 */}
      <div className="flex items-center gap-2 bg-[#151517] border border-[#333333] rounded-lg px-3.5 py-2.5 focus-within:border-[#1da9e4] transition-colors">
        <MagnifyingGlass size={16} className="text-[#888888] shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Søg manualer efter titel, beskrivelse eller filnavn..."
          className="w-full bg-transparent text-xs font-['Stack_Sans_Headline',sans-serif] text-[#d1d5db] placeholder-[#666666] focus:outline-none"
        />
      </div>

      {/* Catalog Counter matching Figma node 87:6091 */}
      <div className="flex items-center justify-between text-xs text-[#888888] font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
        <span>Manualer ({catalog.length})</span>
        {isLoading && <Spinner size={14} className="animate-spin text-[#1da9e4]" />}
      </div>

      {/* Manuals Grid matching Figma node 87:6094 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
        {catalog.map((manual) => {
          const isSelected = selectedManualIds.includes(manual.id);

          return (
            <div
              key={manual.id}
              onClick={() => onToggleManual(manual)}
              className={`flex flex-col justify-between p-3 rounded-lg border transition-all cursor-pointer select-none ${
                isSelected
                  ? "bg-[#162734] border-[#1da9e4] shadow-sm shadow-[#1da9e4]/20"
                  : "bg-[#202021] hover:bg-[#252527] border-[#444444] hover:border-[#666666]"
              }`}
            >
              <div className="flex flex-col gap-2.5">
                {/* 144px Thumbnail Frame matching Figma node 87:6110 */}
                <div className="relative w-full h-36 rounded-lg bg-[#444444] border border-[#555555]/40 flex items-center justify-center text-[#888888] overflow-hidden group">
                  <FileText size={36} weight="regular" className="text-[#888888] group-hover:scale-110 group-hover:text-white transition-all" />
                  <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-zinc-300 font-mono">
                    {manual.machines?.length || 0} maskine(r) tilknyttet
                  </div>
                </div>

                {/* Metadata matching Figma node 87:6112 */}
                <div className="flex flex-col min-w-0">
                  <h4 className="text-sm font-bold font-['Stack_Sans_Notch',sans-serif] text-white truncate">
                    {manual.title}
                  </h4>
                  <span className="text-xs font-bold font-['Stack_Sans_Headline',sans-serif] text-[#888888] truncate mt-0.5">
                    {manual.fileName} • {formatFileSize(manual.fileSize)}
                  </span>
                  {manual.description && (
                    <p className="text-xs font-['Stack_Sans_Headline',sans-serif] text-[#888888] line-clamp-2 mt-1 leading-snug">
                      {manual.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom checkmark row matching Figma node 87:6117 */}
              <div className="flex items-center justify-end pt-2.5 mt-2.5 border-t border-[#333333]">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#1da9e4] text-white shadow-sm"
                      : "border border-[#444444] text-transparent hover:border-[#666666]"
                  }`}
                >
                  <Check size={16} weight="bold" />
                </div>
              </div>
            </div>
          );
        })}

        {!isLoading && catalog.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-[#888888] font-['Stack_Sans_Headline',sans-serif]">
            Ingen manualer matcher din søgning.
          </div>
        )}
      </div>

      {/* Footer matching Figma node */}
      <div className="flex items-center justify-end pt-3 border-t border-[#333333] mt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 bg-[#1da9e4] hover:bg-[#1895ca] text-white px-5 py-2.5 rounded-lg text-xs font-bold font-['Stack_Sans_Headline',sans-serif] transition-all shadow-sm"
        >
          <CheckCircle size={15} weight="bold" />
          <span>Færdig</span>
        </button>
      </div>
    </div>
  );

  if (inline) {
    return cardContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {cardContent}
    </div>
  );
}
