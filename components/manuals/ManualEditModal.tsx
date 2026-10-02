"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  FilePdf,
  ArrowSquareOut,
  Trash,
  Check,
  CheckCircle,
  MagnifyingGlass,
  Spinner,
  Wrench,
  Camera,
  FloppyDisk,
} from "@phosphor-icons/react";
import {
  updateManual,
  deleteManual,
  assignManualToMachine,
  unassignManualFromMachine,
} from "@/app/actions/manuals";

interface ManualEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  manual: any | null;
  equipmentList: any[];
  onManualUpdated: () => void;
  onManualDeleted: () => void;
}

export function ManualEditModal({
  isOpen,
  onClose,
  manual,
  equipmentList,
  onManualUpdated,
  onManualDeleted,
}: ManualEditModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLinksDrawerOpen, setIsLinksDrawerOpen] = useState(false);
  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [linkingEquipmentId, setLinkingEquipmentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (manual) {
      setTitle(manual.title || "");
      setDescription(manual.description || "");
      setIsLinksDrawerOpen(false);
      setEquipmentSearch("");
      setError(null);
    }
  }, [manual]);

  if (!isOpen || !manual) return null;

  const linkedMachineIds = (manual.machines || [])
    .map((m: any) => m.inventory?.id || m.inventoryId)
    .filter(Boolean);

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "0 KB";
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  const handleSaveDescription = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await updateManual({
        manualId: manual.id,
        title,
        description,
      });
      onManualUpdated();
    } catch (err: any) {
      setError(err?.message || "Kunne ikke opdatere manualen.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      `Er du sikker på, at du vil slette manualen "${manual.title}"? Dette fjerner filen og alle tilknytninger.`
    );
    if (!confirm) return;

    try {
      setIsDeleting(true);
      setError(null);
      await deleteManual({ manualId: manual.id });
      onManualDeleted();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Kunne ikke slette manualen.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleEquipmentLink = async (equipmentId: string) => {
    try {
      setLinkingEquipmentId(equipmentId);
      const isAlreadyLinked = linkedMachineIds.includes(equipmentId);
      if (isAlreadyLinked) {
        await unassignManualFromMachine({
          manualId: manual.id,
          inventoryId: equipmentId,
        });
      } else {
        await assignManualToMachine({
          manualId: manual.id,
          inventoryId: equipmentId,
        });
      }
      onManualUpdated();
    } catch (err: any) {
      setError(err?.message || "Kunne ikke opdatere maskintilknytning.");
    } finally {
      setLinkingEquipmentId(null);
    }
  };

  const filteredEquipment = equipmentList.filter((eq) => {
    if (!equipmentSearch.trim()) return true;
    const q = equipmentSearch.toLowerCase();
    return (
      eq.name?.toLowerCase().includes(q) ||
      eq.assetTag?.toLowerCase().includes(q) ||
      eq.lab?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-4 w-full max-w-[1150px] my-auto">
        {/* Left Card: MANUALS - Card Edit matching Figma node 89:7194 (357px-400px wide) */}
        <div
          className="w-full max-w-[400px] max-h-[90vh] overflow-y-auto bg-[#202021] border border-[#444444] rounded-xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4 text-white font-['Stack_Sans_Text',sans-serif]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#333333] pb-3">
            <span className="text-sm font-bold font-['Stack_Sans_Notch',sans-serif] tracking-wider uppercase text-white">
              REDIGER MANUAL
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-[#888888] hover:text-white hover:bg-[#333333] transition-colors"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {error && (
            <div className="p-3 bg-[#e51d87]/15 border border-[#e51d87]/40 rounded-lg text-xs text-[#ff99cc] font-medium">
              {error}
            </div>
          )}

          {/* Top thumbnail representation matching Figma node 89:7196 (335x144) */}
          <div className="relative w-full h-36 rounded-lg bg-[#444444] border border-[#555555]/40 flex items-center justify-center text-[#888888] overflow-hidden group">
            <FilePdf size={40} weight="regular" className="text-[#888888] group-hover:scale-110 group-hover:text-white transition-all" />
            <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-zinc-300 font-mono">
              PDF DOKUMENT
            </div>
          </div>

          {/* Title and metadata matching Figma node 89:7198 */}
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#151517] border border-[#333333] focus:border-[#ffd900] rounded-lg px-3 py-2 text-sm font-bold font-['Stack_Sans_Notch',sans-serif] text-white focus:outline-none transition-colors"
              placeholder="Manual titel..."
            />
            <span className="text-xs font-bold font-['Stack_Sans_Headline',sans-serif] text-[#888888] truncate px-1">
              {manual.fileName} • {formatFileSize(manual.fileSize)}
            </span>
          </div>

          {/* White "Læs Online" Button matching Figma node 89:7352 */}
          <a
            href={manual.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 bg-white hover:bg-zinc-200 text-[#0d0e0e] rounded-lg flex items-center justify-center gap-2 font-['Stack_Sans_Text',sans-serif] font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <span>Læs Online</span>
            <ArrowSquareOut size={16} weight="bold" />
          </a>

          {/* Description Section matching Figma node 89:7365 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-['Stack_Sans_Headline',sans-serif] text-[#888888] uppercase tracking-wider">
                Beskrivelse
              </label>
              {(title !== manual.title || description !== (manual.description || "")) && (
                <button
                  type="button"
                  onClick={handleSaveDescription}
                  disabled={isSaving}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#ffd900] hover:underline cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Spinner size={12} className="animate-spin" /> : <FloppyDisk size={12} weight="bold" />}
                  <span>Gem ændringer</span>
                </button>
              )}
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Indtast vejledning, printprofiler, tips eller sikkerhedsanvisninger..."
              className="w-full bg-[#151517] border border-[#333333] focus:border-[#ffd900] rounded-lg p-2.5 text-xs text-[#d1d5db] font-['Stack_Sans_Headline',sans-serif] focus:outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Links Section matching Figma node 89:7373 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-['Stack_Sans_Headline',sans-serif] text-[#888888]">
                Links ({linkedMachineIds.length})
              </span>
              <button
                type="button"
                onClick={() => setIsLinksDrawerOpen(!isLinksDrawerOpen)}
                className="text-xs font-bold font-['Stack_Sans_Headline',sans-serif] text-[#888888] hover:text-[#ffd900] transition-colors cursor-pointer"
              >
                {isLinksDrawerOpen ? "Luk -" : "Tilføj +"}
              </button>
            </div>

            {/* Linked Machines List */}
            <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
              {(manual.machines || []).map((link: any) => {
                const eq = link.inventory;
                if (!eq) return null;

                return (
                  <div
                    key={eq.id}
                    className="flex items-center justify-between gap-2 p-2 bg-[#151517] border border-[#333333] rounded-lg"
                  >
                    <span className="text-xs font-['Stack_Sans_Headline',sans-serif] text-[#d1d5db] truncate flex-1">
                      {eq.name}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2.5 py-0.5 rounded bg-[#ffd900] text-[#0d0e0e] text-[10px] font-bold font-['Stack_Sans_Text',sans-serif]">
                        Se
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleEquipmentLink(eq.id)}
                        className="text-[#888888] hover:text-white text-xs px-1 font-mono transition-colors"
                        title="Fjern tilknytning"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}

              {(manual.machines || []).length === 0 && (
                <div className="py-3 text-center text-xs text-[#666666] font-['Stack_Sans_Headline',sans-serif]">
                  Ingen maskiner tilknyttet endnu.
                </div>
              )}
            </div>
          </div>

          {/* Delete Button matching Figma node 89:7358 */}
          <div className="pt-2 border-t border-[#333333]">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full h-11 bg-[#e51d87] hover:bg-[#d01979] disabled:opacity-50 text-white rounded-lg flex items-center justify-center gap-2 font-['Stack_Sans_Text',sans-serif] font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              {isDeleting ? <Spinner size={16} className="animate-spin" /> : <Trash size={16} weight="bold" />}
              <span>Slet</span>
            </button>
          </div>
        </div>

        {/* Right Card: Card - Links side to edit/create matching Figma node 87:6513 (700px wide) */}
        {isLinksDrawerOpen && (
          <div
            className="w-full max-w-[700px] max-h-[90vh] overflow-y-auto bg-[#202021] border border-[#444444] rounded-xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4 text-white font-['Stack_Sans_Text',sans-serif] animate-in fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header matching Figma node 87:6514 */}
            <div className="flex items-start justify-between border-b border-[#333333] pb-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold font-['Stack_Sans_Notch',sans-serif] uppercase tracking-wider text-white">
                    LINKS
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-['Stack_Sans_Headline',sans-serif] bg-[#ffd900]/20 border border-[#ffd900]/40 text-[#ffd900]">
                    Valgt {linkedMachineIds.length}
                  </span>
                </div>
                <p className="text-xs text-[#888888] font-['Stack_Sans_Headline',sans-serif] mt-0.5">
                  Many-to-Many documentation library • Link shared safety SOPs &amp; guides across all machines
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLinksDrawerOpen(false)}
                className="p-1 rounded-md text-[#888888] hover:text-white hover:bg-[#333333] transition-colors"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Search Bar matching Figma node 87:6519 */}
            <div className="flex items-center gap-2 bg-[#151517] border border-[#333333] rounded-lg px-3.5 py-2.5 focus-within:border-[#ffd900] transition-colors">
              <MagnifyingGlass size={16} className="text-[#888888] shrink-0" />
              <input
                type="text"
                value={equipmentSearch}
                onChange={(e) => setEquipmentSearch(e.target.value)}
                placeholder="Søg maskiner og udstyr efter titel eller tag..."
                className="w-full bg-transparent text-xs font-['Stack_Sans_Headline',sans-serif] text-[#d1d5db] placeholder-[#666666] focus:outline-none"
              />
            </div>

            {/* Counter matching Figma node 87:6523 */}
            <div className="flex items-center justify-between text-xs text-[#888888] font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
              <span>Maskiner / Udstyr ({filteredEquipment.length})</span>
            </div>

            {/* Equipment Grid matching Figma node 87:6525 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
              {filteredEquipment.map((eq) => {
                const isSelected = linkedMachineIds.includes(eq.id);
                const isToggling = linkingEquipmentId === eq.id;

                return (
                  <div
                    key={eq.id}
                    onClick={() => handleToggleEquipmentLink(eq.id)}
                    className={`flex flex-col justify-between p-3 rounded-lg border transition-all cursor-pointer select-none ${
                      isSelected
                        ? "bg-[#252316] border-[#ffd900] shadow-sm"
                        : "bg-[#202021] hover:bg-[#252527] border-[#444444] hover:border-[#666666]"
                    }`}
                  >
                    <div className="flex flex-col gap-2.5">
                      {/* 144px Thumbnail Frame matching Figma node 87:6529 */}
                      <div className="relative w-full h-36 rounded-lg bg-[#444444] border border-[#555555]/40 flex items-center justify-center text-[#888888] overflow-hidden group">
                        {eq.hardwareType === "BORROWABLE_GEAR" ? (
                          <Camera size={36} weight="regular" className="text-[#888888] group-hover:scale-110 group-hover:text-white transition-all" />
                        ) : (
                          <Wrench size={36} weight="regular" className="text-[#888888] group-hover:scale-110 group-hover:text-white transition-all" />
                        )}
                        <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] text-zinc-300 font-mono">
                          {eq.assetTag} • {eq.lab?.name || "Lab"}
                        </div>
                      </div>

                      {/* Info matching Figma node 87:6531 */}
                      <div className="flex flex-col min-w-0">
                        <h4 className="text-sm font-bold font-['Stack_Sans_Notch',sans-serif] text-white truncate">
                          {eq.name}
                        </h4>
                        <span className="text-xs font-bold font-['Stack_Sans_Headline',sans-serif] text-[#888888] truncate mt-0.5">
                          {eq.hardwareType === "BORROWABLE_GEAR" ? "Udstyr (Udlån)" : "Stationær Maskine"}
                        </span>
                        {eq.notes && (
                          <p className="text-xs font-['Stack_Sans_Headline',sans-serif] text-[#888888] line-clamp-2 mt-1 leading-snug">
                            {eq.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Checkmark matching Figma node 87:6536 */}
                    <div className="flex items-center justify-end pt-2.5 mt-2.5 border-t border-[#333333]">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-[#ffd900] text-black shadow-sm"
                            : "border border-[#444444] text-transparent hover:border-[#666666]"
                        }`}
                      >
                        {isToggling ? (
                          <Spinner size={16} className="animate-spin text-white" />
                        ) : (
                          <Check size={16} weight="bold" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredEquipment.length === 0 && (
                <div className="col-span-full py-12 text-center text-xs text-[#888888] font-['Stack_Sans_Headline',sans-serif]">
                  Ingen maskiner matcher din søgning.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-[#333333] mt-1">
              <button
                type="button"
                onClick={() => setIsLinksDrawerOpen(false)}
                className="flex items-center gap-2 bg-[#ffd900] hover:bg-[#e6d600] text-black px-5 py-2.5 rounded-lg text-xs font-bold font-['Stack_Sans_Headline',sans-serif] transition-all shadow-sm"
              >
                <CheckCircle size={15} weight="bold" />
                <span>Færdig</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
