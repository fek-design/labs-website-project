"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  getManualsCatalog,
  uploadManual,
  assignManualToMachine,
  unassignManualFromMachine,
  deleteManual,
} from "@/app/actions/manuals";
import { getInventoryWithFilters } from "@/app/actions/inventory";
import { getAuthSession } from "@/app/actions/auth";
import { AnimatedCounter } from "@/components/pos/AnimatedCounter";
import {
  MagnifyingGlass,
  Plus,
  FilePdf,
  ArrowUpRight,
  Trash,
  X,
  CaretDown,
  Barcode,
  Check,
  Link as LinkIcon,
  UploadSimple,
  PencilSimple,
} from "@phosphor-icons/react";
import { ManualEditModal } from "./ManualEditModal";

interface ManualsManagerProps {
  activeLab?: string;
  onSelectLab?: (lab: "medialab" | "makerspace") => void;
}

export function ManualsManager({ activeLab = "medialab" }: ManualsManagerProps) {
  const [manuals, setManuals] = useState<any[]>([]);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminName, setAdminName] = useState<string>("Admin");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLab, setSelectedLab] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  // Modals & Popovers
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingManual, setEditingManual] = useState<any | null>(null);
  const [linkingManualId, setLinkingManualId] = useState<string | null>(null);
  const [selectedEquipmentToLink, setSelectedEquipmentToLink] = useState<string>("");

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadTargetEquipment, setUploadTargetEquipment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Fetch admin session username for greeting
  useEffect(() => {
    getAuthSession()
      .then((session) => {
        if (session?.user?.username) {
          const raw = session.user.username;
          const formatted = raw.charAt(0).toUpperCase() + raw.slice(1);
          setAdminName(formatted);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch Manuals Catalog and Equipment List
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [resManuals, resEquipment] = await Promise.all([
        getManualsCatalog(searchQuery),
        getInventoryWithFilters({}),
      ]);
      setManuals(resManuals || []);
      setEquipmentList(resEquipment || []);
    } catch (err: any) {
      console.error("Failed to load manuals catalog:", err);
      setFeedback({ message: "Kunne ikke indlæse manualer.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtering manuals
  const filteredManuals = useMemo(() => {
    return manuals.filter((manual) => {
      // Filter by LAB
      if (selectedLab !== "ALL") {
        const hasMatchingLab = manual.machines?.some(
          (m: any) => m.inventory?.lab?.slug === selectedLab
        );
        if (!hasMatchingLab) return false;
      }

      // Filter by TYPE
      if (selectedType !== "ALL") {
        const hasMatchingType = manual.machines?.some(
          (m: any) => m.inventory?.hardwareType === selectedType
        );
        if (!hasMatchingType) return false;
      }

      return true;
    });
  }, [manuals, selectedLab, selectedType]);

  // Telemetry Metric Calculations
  const totalManualsCount = manuals.length;
  const linkedEquipmentCount = useMemo(() => {
    const set = new Set<string>();
    manuals.forEach((m) => {
      m.machines?.forEach((im: any) => {
        if (im.inventory?.id) set.add(im.inventory.id);
      });
    });
    return set.size;
  }, [manuals]);

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Upload handler
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setFeedback({ message: "Vælg venligst en PDF-fil.", type: "error" });
      return;
    }

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      fd.append("file", uploadFile);
      if (uploadTitle.trim()) fd.append("title", uploadTitle.trim());
      if (uploadDescription.trim()) fd.append("description", uploadDescription.trim());
      if (uploadTargetEquipment) fd.append("inventoryId", uploadTargetEquipment);

      await uploadManual(fd);
      setFeedback({ message: "Manualen blev uploadet og registreret!", type: "success" });
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setUploadDescription("");
      setUploadTargetEquipment("");
      await loadData();
    } catch (err: any) {
      setFeedback({ message: err.message || "Fejl ved upload af manual.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Unlink equipment from manual
  const handleUnlink = async (manualId: string, inventoryId: string, itemName: string) => {
    if (!confirm(`Fjern tilknytning for "${itemName}"? Manualen bevares i biblioteket.`)) {
      return;
    }
    try {
      await unassignManualFromMachine({ inventoryId, manualId });
      setFeedback({ message: `Tilknytning fjernet for ${itemName}`, type: "success" });
      await loadData();
    } catch (err: any) {
      setFeedback({ message: err.message || "Kunne ikke fjerne tilknytning.", type: "error" });
    }
  };

  // Link selected equipment to manual
  const handleConfirmLink = async (manualId: string) => {
    if (!selectedEquipmentToLink) return;
    try {
      await assignManualToMachine({
        inventoryId: selectedEquipmentToLink,
        manualId,
      });
      setFeedback({ message: "Udstyr tilknyttet manualen!", type: "success" });
      setLinkingManualId(null);
      setSelectedEquipmentToLink("");
      await loadData();
    } catch (err: any) {
      setFeedback({ message: err.message || "Kunne ikke tilknytte udstyr.", type: "error" });
    }
  };

  // Delete manual
  const handleDeleteManual = async (manualId: string, title: string) => {
    if (!confirm(`Er du sikker på, at du vil slette "${title}" permanent fra kataloget?`)) {
      return;
    }
    try {
      await deleteManual({ manualId });
      setFeedback({ message: `"${title}" blev slettet.`, type: "success" });
      await loadData();
    } catch (err: any) {
      setFeedback({ message: err.message || "Kunne ikke slette manual.", type: "error" });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1512px] mx-auto p-4 sm:p-6 lg:p-8 bg-[#0e0d0f] min-h-screen text-white font-text">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-headline font-bold border flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-[#FFED00]/10 border-[#FFED00]/30 text-[#FFED00]"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="p-1 hover:bg-white/10 rounded-md cursor-pointer transition-colors"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
      )}

      {/* 1. Canonical Admin Page Header Standard (AGENTS.md) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black font-notch tracking-tight flex items-baseline gap-1.5">
            <span className="text-white">LABS</span>
            <span className="text-[#FFED00]">Manualer</span>
          </h1>
          <p className="text-sm font-headline font-bold text-zinc-400 mt-1">
            Velkommen, {adminName}
          </p>
        </div>

        {/* 3 Top KPI Metric Counters */}
        <div className="flex flex-wrap items-center gap-8 sm:gap-12">
          {/* 1. Tilgængelige manualer */}
          <div className="flex items-baseline gap-3">
            <AnimatedCounter
              value={totalManualsCount}
              className="text-5xl sm:text-6xl font-bold font-notch text-white leading-none"
            />
            <span className="text-sm text-zinc-400 font-headline font-normal leading-tight">
              Tilgængelige<br />manualer
            </span>
          </div>

          {/* 2. Tilknyttet udstyr */}
          <div className="flex items-baseline gap-3">
            <AnimatedCounter
              value={linkedEquipmentCount}
              className="text-5xl sm:text-6xl font-bold font-notch text-[#FFED00] leading-none"
            />
            <span className="text-sm text-zinc-400 font-headline font-normal leading-tight">
              Tilknyttet<br />udstyr
            </span>
          </div>

          {/* 3. Total dokumenter */}
          <div className="flex items-baseline gap-3">
            <span className="text-5xl sm:text-6xl font-bold font-notch text-white leading-none">
              <AnimatedCounter value={filteredManuals.length} />
            </span>
            <span className="text-sm text-zinc-400 font-headline font-normal leading-tight">
              Aktive<br />visninger
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Container Matching Figma Frame 86:4076 */}
      <div className="flex flex-col gap-5 p-4 sm:p-6 bg-[#151517] border border-[#333333] rounded-2xl shadow-xl">
        {/* Search & Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-zinc-400 pointer-events-none">
              <Barcode size={18} weight="bold" />
              <MagnifyingGlass size={16} weight="bold" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Scan eller søg i manualer, filnavne eller udstyr..."
              className="w-full bg-[#151517] border border-[#333333] hover:border-[#444444] focus:border-[#555555] rounded-lg pl-14 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X size={14} weight="bold" />
              </button>
            )}
          </div>

          {/* Yellow "Tilføj" Button (Figma Node 86:4094) */}
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-5 py-2.5 bg-[#FFED00] hover:bg-[#e6d600] text-black font-headline font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer shrink-0"
          >
            <span>Tilføj</span>
            <Plus size={16} weight="bold" />
          </button>
        </div>

        {/* Filter Strip with item count and inline LAB & TYPE dropdowns */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full border-b border-[#262626] pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-notch tracking-tight">
            Tilgængelige Manualer <span className="text-[#888888] font-normal">{filteredManuals.length}</span>
          </h2>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto">
            {/* LAB Filter */}
            <div className="flex flex-col gap-1.5 min-w-[140px] flex-1 sm:flex-initial">
              <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wider font-headline">
                LAB
              </label>
              <div className="relative">
                <select
                  value={selectedLab}
                  onChange={(e) => setSelectedLab(e.target.value)}
                  className="w-full appearance-none bg-[#151517] hover:bg-[#1a1a1d] text-white text-xs sm:text-sm font-bold font-text border border-[#333333] hover:border-[#444444] rounded-lg px-3.5 py-2.5 pr-8 cursor-pointer focus:outline-none focus:border-[#FFED00] focus:ring-1 focus:ring-[#FFED00] transition-colors"
                >
                  <option value="ALL">ALLE FACILITETER</option>
                  <optgroup label="Køge Campus" className="bg-[#151517] text-zinc-400 font-semibold font-headline">
                    <option value="medialab" className="text-white bg-[#151517] font-normal">
                      MediaLab (Køge)
                    </option>
                    <option value="makerspace" className="text-white bg-[#151517] font-normal">
                      Makerspace (Køge)
                    </option>
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
              <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wider font-headline">
                TYPE
              </label>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full appearance-none bg-[#151517] hover:bg-[#1a1a1d] text-white text-xs sm:text-sm font-bold font-text border border-[#333333] hover:border-[#444444] rounded-lg px-3.5 py-2.5 pr-8 cursor-pointer focus:outline-none focus:border-[#FFED00] focus:ring-1 focus:ring-[#FFED00] transition-colors"
                >
                  <option value="ALL">ALLE</option>
                  <option value="BORROWABLE_GEAR">Udstyr (Udlån)</option>
                  <option value="STATIC_MACHINE">Maskine (Stationær)</option>
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

        {/* 3. Manual Cards Grid (Figma Node 87:6655 / 89:7426) */}
        {isLoading ? (
          <div className="py-20 text-center text-zinc-500 font-mono text-sm">
            Indlæser manualer og tilknyttet hardware...
          </div>
        ) : filteredManuals.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <FilePdf size={48} weight="thin" className="mx-auto text-zinc-600" />
            <p className="text-zinc-400 font-bold font-headline text-base">
              Ingen manualer fundet
            </p>
            <p className="text-xs text-zinc-500 font-text max-w-md mx-auto">
              Upload et nyt PDF-dokument eller nulstil dine aktive søge- og lab-filtre for at se biblioteket.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredManuals.map((manual) => {
              const linkedMachines = manual.machines || [];
              const isLinkingThis = linkingManualId === manual.id;

              return (
                <div
                  key={manual.id}
                  className="bg-[#202021] border border-[#444444] hover:border-zinc-500 rounded-xl p-4 flex flex-col justify-between gap-4 shadow-xl transition-all group"
                >
                  {/* Top section: Preview & Meta */}
                  <div className="space-y-3">
                    {/* Document Preview Box (Figma Frame 67) */}
                    <div className="relative w-full h-36 bg-[#2a2a2d] border border-[#333333] rounded-lg flex flex-col items-center justify-center p-3 group/preview overflow-hidden">
                      <FilePdf
                        size={40}
                        weight="regular"
                        className="text-[#888888] group-hover/preview:text-[#FFED00] transition-colors"
                      />
                      <span className="text-[10px] text-zinc-400 font-mono mt-1 uppercase tracking-wider">
                        PDF Dokument
                      </span>

                      {/* Open PDF in New Tab overlay */}
                      <a
                        href={manual.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center gap-1.5 text-xs font-bold text-white font-headline transition-opacity backdrop-blur-xs"
                      >
                        <span>Åbn PDF</span>
                        <ArrowUpRight size={14} weight="bold" />
                      </a>
                    </div>

                    {/* Metadata Header */}
                    <div className="space-y-1">
                      <h3
                        onClick={() => setEditingManual(manual)}
                        className="font-notch font-bold text-white text-base leading-snug truncate hover:text-[#ffd900] transition-colors cursor-pointer"
                        title={manual.title}
                      >
                        {manual.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-headline font-bold text-zinc-400 truncate">
                        <span className="truncate">{manual.fileName}</span>
                        <span>•</span>
                        <span className="shrink-0">{formatFileSize(manual.fileSize)}</span>
                      </div>
                      {manual.description && (
                        <p className="text-xs text-zinc-400 font-text line-clamp-2 pt-0.5">
                          {manual.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Middle section: Linked Hardware List (Figma Frame 86 & 89:7488) */}
                  <div className="space-y-2 border-t border-[#333333] pt-3">
                    <div className="flex items-center justify-between text-xs font-headline font-bold">
                      <span className="text-zinc-400">
                        Links ({linkedMachines.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setLinkingManualId(isLinkingThis ? null : manual.id);
                          setSelectedEquipmentToLink("");
                        }}
                        className="text-zinc-400 hover:text-[#FFED00] transition-colors cursor-pointer"
                      >
                        {isLinkingThis ? "Luk -" : "Tilføj +"}
                      </button>
                    </div>

                    {/* Inline Quick-Link Picker */}
                    {isLinkingThis && (
                      <div className="p-2.5 bg-[#151517] border border-[#333333] rounded-lg space-y-2 animate-in fade-in duration-150">
                        <select
                          value={selectedEquipmentToLink}
                          onChange={(e) => setSelectedEquipmentToLink(e.target.value)}
                          className="w-full bg-[#202021] border border-[#444444] text-xs text-white rounded p-1.5 outline-none font-mono"
                        >
                          <option value="">-- Vælg udstyr/maskine --</option>
                          {equipmentList
                            .filter(
                              (eq) =>
                                !linkedMachines.some((m: any) => m.inventory?.id === eq.id)
                            )
                            .map((eq) => (
                              <option key={eq.id} value={eq.id}>
                                [{eq.assetTag}] {eq.name} ({eq.lab?.name || "Lab"})
                              </option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setLinkingManualId(null)}
                            className="px-2 py-1 text-[11px] text-zinc-400 hover:text-white"
                          >
                            Annuller
                          </button>
                          <button
                            type="button"
                            disabled={!selectedEquipmentToLink}
                            onClick={() => handleConfirmLink(manual.id)}
                            className="px-3 py-1 bg-[#FFED00] hover:bg-[#e6d600] disabled:opacity-40 text-black text-[11px] font-bold rounded cursor-pointer"
                          >
                            Tilknyt
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Hardware Pills */}
                    {linkedMachines.length === 0 ? (
                      <div className="text-[11px] text-zinc-500 font-text italic py-1">
                        Intet udstyr tilknyttet denne manual endnu.
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {linkedMachines.map((im: any) => {
                          const item = im.inventory;
                          if (!item) return null;

                          return (
                            <div
                              key={item.id}
                              className="bg-[#151517] border border-[#333333] rounded-lg p-2 flex items-center justify-between gap-2"
                            >
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs text-zinc-200 font-headline font-bold truncate">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-mono">
                                  {item.assetTag}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {/* Yellow "Se" button (Figma Node 89:7495) */}
                                <a
                                  href={`/admin/pos?search=${encodeURIComponent(item.assetTag)}`}
                                  className="px-2 py-0.5 bg-[#FFED00] hover:bg-[#ffe600] text-black text-[10px] font-headline font-bold rounded flex items-center justify-center transition-colors"
                                  title="Find i POS"
                                >
                                  Se
                                </a>

                                {/* Unlink "x" button */}
                                <button
                                  type="button"
                                  onClick={() => handleUnlink(manual.id, item.id, item.name)}
                                  className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white rounded hover:bg-[#333333] cursor-pointer"
                                  title="Fjern tilknytning"
                                  aria-label={`Fjern ${item.name}`}
                                >
                                  <X size={12} weight="bold" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Bottom section: Readiness Pill, Edit button, Delete action */}
                  <div className="border-t border-[#333333] pt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Check size={12} weight="bold" />
                      <span>KLAR TIL BRUG</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingManual(manual)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-[#151517] hover:bg-[#252528] border border-[#333333] hover:border-[#555555] rounded-md text-[11px] font-bold font-headline text-white transition-colors cursor-pointer"
                        title="Rediger manual og tilknytninger"
                      >
                        <PencilSimple size={12} weight="bold" />
                        <span>Rediger</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteManual(manual.id, manual.title)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
                        title="Slet manual"
                        aria-label="Slet manual"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. PDF Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-[560px] bg-[#202021] border border-[#444444] rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-white font-text"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <h2 className="text-lg font-bold font-notch tracking-wider uppercase text-white flex items-center gap-2">
                <FilePdf size={22} weight="bold" className="text-[#FFED00]" />
                <span>Upload Ny Manual (PDF)</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-[#333333] transition-colors cursor-pointer"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-text">
              {/* File Dropzone */}
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-headline block mb-1.5">
                  PDF Fil <span className="text-[#FFED00]">*</span>
                </label>
                <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#444444] hover:border-[#FFED00] rounded-xl cursor-pointer bg-[#151517] transition-colors">
                  <UploadSimple size={28} weight="bold" className="text-zinc-400 mb-2" />
                  <span className="text-xs font-headline font-bold text-zinc-200">
                    {uploadFile ? uploadFile.name : "Klik for at vælge eller træk en PDF herind"}
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">
                    {uploadFile ? formatFileSize(uploadFile.size) : "Maksimum 50 MB"}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setUploadFile(e.target.files[0]);
                        if (!uploadTitle) {
                           setUploadTitle(
                            e.target.files[0].name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
                          );
                        }
                      }
                    }}
                  />
                </label>
              </div>

              {/* Title Field */}
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-headline block mb-1">
                  Manual Titel <span className="text-[#FFED00]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="F.eks. Sony FX30 Operation Guide"
                  className="w-full bg-[#151517] border border-[#333333] focus:border-[#FFED00] rounded-lg px-3.5 py-2.5 text-sm text-white outline-none font-bold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-headline block mb-1">
                  Beskrivelse (Valgfri)
                </label>
                <textarea
                  rows={2}
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Instruktioner, sikkerhedsforskrifter og hurtigvejledning..."
                  className="w-full bg-[#151517] border border-[#333333] focus:border-[#FFED00] rounded-lg px-3.5 py-2 text-xs text-white outline-none resize-none"
                />
              </div>

              {/* Optional Equipment Association */}
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-headline block mb-1">
                  Tilknyt Udstyr eller Maskine (Valgfrit)
                </label>
                <select
                  value={uploadTargetEquipment}
                  onChange={(e) => setUploadTargetEquipment(e.target.value)}
                  className="w-full bg-[#151517] border border-[#333333] focus:border-[#FFED00] rounded-lg p-2.5 text-xs text-white outline-none font-mono"
                >
                  <option value="">-- Tilknyt ikke endnu --</option>
                  {equipmentList.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      [{eq.assetTag}] {eq.name} ({eq.lab?.name || "Lab"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#333333]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white font-headline text-xs font-bold transition-colors cursor-pointer"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !uploadFile}
                  className="px-6 py-2.5 bg-[#FFED00] hover:bg-[#e6d600] disabled:opacity-40 text-black font-headline font-bold text-xs rounded-full transition-all cursor-pointer"
                >
                  {isSubmitting ? "Uploader..." : "Upload Manual"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Manual Edit Modal (Figma Node 209:2) */}
      <ManualEditModal
        isOpen={Boolean(editingManual)}
        onClose={() => setEditingManual(null)}
        manual={editingManual}
        equipmentList={equipmentList}
        onManualUpdated={async () => {
          await loadData();
          if (editingManual) {
            const updatedList = await getManualsCatalog();
            const found = updatedList?.find((m: any) => m.id === editingManual.id);
            setEditingManual(found || null);
          }
        }}
        onManualDeleted={async () => {
          await loadData();
          setEditingManual(null);
        }}
      />
    </div>
  );
}
