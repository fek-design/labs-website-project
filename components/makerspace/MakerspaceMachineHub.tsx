"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getInventoryWithFilters, updateInventoryItem } from "@/app/actions/inventory";
import { unassignManualFromMachine } from "@/app/actions/manuals";
import { OperationalStatus, HardwareType } from "@prisma/client";
import { ManualsCatalogModal } from "./ManualsCatalogModal";

export function MakerspaceMachineHub() {
  const [machines, setMachines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("ALL");

  // Catalog Modal State
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [focusMachine, setFocusMachine] = useState<{ id: string; name: string } | null>(null);

  const fetchMachines = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getInventoryWithFilters({
        labSlug: "makerspace",
        hardwareType: HardwareType.STATIC_MACHINE,
        tagSlug: selectedTag !== "ALL" ? selectedTag : undefined,
        searchQuery,
      });
      setMachines(res);
    } catch (err) {
      console.error("Failed to load Makerspace machines", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTag, searchQuery]);

  useEffect(() => {
    fetchMachines();
  }, [fetchMachines]);

  const handleStatusChange = async (machineId: string, status: OperationalStatus) => {
    try {
      await updateInventoryItem({
        id: machineId,
        operationalStatus: status,
      });
      fetchMachines();
    } catch (err) {
      console.error("Failed to update machine status", err);
    }
  };

  const handleQuickUnlink = async (machineId: string, manualId: string, title: string) => {
    if (!confirm(`Unlink "${title}" from this machine? The manual will stay in the central catalog.`)) {
      return;
    }
    try {
      await unassignManualFromMachine({ inventoryId: machineId, manualId });
      fetchMachines();
    } catch (err: any) {
      alert(err.message || "Failed to unlink manual.");
    }
  };

  const openCatalogForMachine = (machine: { id: string; name: string }) => {
    setFocusMachine(machine);
    setShowCatalogModal(true);
  };

  const openGlobalCatalog = () => {
    setFocusMachine(null);
    setShowCatalogModal(true);
  };

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-2xl font-mono text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Makerspace Machine & Manuals Hub
            </h2>
            <span className="bg-[#FFED00] text-black text-xs font-bold px-2.5 py-0.5 rounded-full">
              In-House Workstations
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Static rapid prototyping machinery, centralized Many-to-Many user manuals library, and maintenance records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openGlobalCatalog}
            className="px-5 py-2.5 bg-[#FFED00] hover:bg-[#ffe600] text-black font-bold text-xs rounded-full shadow-lg shadow-[#FFED00]/20 flex items-center gap-2 transition-transform hover:scale-[1.02]"
          >
            <span>📚</span>
            <span>Manuals Library Catalog</span>
          </button>

          <span className="px-3 py-1 bg-[#0D0D0D] border border-emerald-500/30 text-emerald-400 rounded-full font-bold text-xs hidden sm:inline-block">
            ✓ In-situ Station Use Only
          </span>
        </div>
      </div>

      {/* Machine Search & Filter Bar */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-3 pb-6 border-b border-[#262626]">
        {/* Search Bar */}
        <div className="sm:col-span-8">
          <label className="text-[10px] text-zinc-500 uppercase block mb-1 font-bold">
            Machine Search (Name, Tag, or Category)
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search 3D printers, laser cutters, CNCs, textiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#FFED00] text-white text-xs rounded-xl p-3 outline-none pl-9 font-bold"
            />
            <span className="absolute left-3 top-3 text-zinc-500 text-xs">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-zinc-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Tag Selector */}
        <div className="sm:col-span-4">
          <label className="text-[10px] text-zinc-500 uppercase block mb-1 font-bold">
            Category Filter
          </label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#262626] text-white text-xs rounded-xl p-3 outline-none font-bold"
          >
            <option value="ALL">All Categories</option>
            <option value="3d-fabrication">3D Fabrication</option>
            <option value="rapid-prototyping">Rapid Prototyping</option>
            <option value="textile">Textile</option>
            <option value="electronics">Electronics</option>
            <option value="laser-cutting">Laser Cutting</option>
          </select>
        </div>
      </div>

      {/* Grid of Static Machines */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {machines.length === 0 ? (
          <div className="col-span-2 text-center py-16 text-zinc-500 text-xs">
            {isLoading
              ? "Loading workstations..."
              : `No static machines match the search query "${searchQuery}".`}
          </div>
        ) : (
          machines.map((machine) => {
            const isAvailable = machine.operationalStatus === "AVAILABLE";
            const isMaintenance = machine.operationalStatus === "MAINTENANCE";
            const machineTags = machine.tags || [];
            const attachedManuals = (machine.manuals || [])
              .map((im: any) => im.manual)
              .filter(Boolean);

            return (
              <div
                key={machine.id}
                className={`bg-[#0D0D0D] border rounded-3xl p-6 transition-all shadow-xl flex flex-col justify-between ${
                  isAvailable
                    ? "border-[#262626] hover:border-[#FFED00]"
                    : isMaintenance
                    ? "border-[#FFED00]/50 bg-[#FFED00]/5"
                    : "border-[#E6007E]/50 bg-[#E6007E]/5"
                }`}
              >
                <div>
                  {/* Header with Tag & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#FFED00]">[{machine.assetTag}]</span>
                        <span className="text-[11px] text-zinc-400 font-bold">
                          🏛️ {machine.lab?.name || "Makerspace (Køge)"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">{machine.name}</h3>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        isAvailable
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : isMaintenance
                          ? "bg-[#FFED00]/20 text-[#FFED00] border border-[#FFED00]/30"
                          : "bg-[#E6007E]/20 text-[#E6007E] border border-[#E6007E]/30"
                      }`}
                    >
                      {machine.operationalStatus}
                    </span>
                  </div>

                  {/* 2-Tier Faceted Tags */}
                  {machineTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {machineTags.map((it: any) => {
                        const tag = it.tag;
                        const isDiscipline = tag.facet === "DISCIPLINE";
                        const isProcess = tag.facet === "PROCESS";

                        return (
                          <span
                            key={tag.id}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              isDiscipline
                                ? "bg-[#FFED00]/10 text-[#FFED00] border-[#FFED00]/30"
                                : isProcess
                                ? "bg-[#009FE3]/10 text-[#009FE3] border-[#009FE3]/30"
                                : "bg-zinc-800 text-zinc-300 border-zinc-700"
                            }`}
                          >
                            {tag.name}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Clean Technical Parameters & Operational Notes (No Fake Specs) */}
                  {machine.notes && (
                    <div className="mt-4 bg-[#141414] border border-[#262626] rounded-2xl p-4 text-xs">
                      <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">
                        Operational Details & Configuration
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{machine.notes}</p>
                    </div>
                  )}

                  {/* Safety Protocols */}
                  {machine.customFields?.safetyGuide && (
                    <div className="mt-3 p-3 bg-[#E6007E]/5 border border-[#E6007E]/20 rounded-2xl text-[11px] text-zinc-300 flex items-start gap-2">
                      <span className="text-[#E6007E] font-bold">⚠️</span>
                      <span>{machine.customFields.safetyGuide}</span>
                    </div>
                  )}
                </div>

                {/* Many-to-Many Manuals Library Section */}
                <div className="mt-6 pt-4 border-t border-[#262626] space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <span>📕 Attached Manuals & SOPs</span>
                        <span className="bg-[#009FE3]/10 text-[#009FE3] text-[10px] px-1.5 py-0.2 rounded-full border border-[#009FE3]/30">
                          {attachedManuals.length}
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() => openCatalogForMachine({ id: machine.id, name: machine.name })}
                        className="text-[11px] font-bold text-[#FFED00] hover:underline flex items-center gap-1"
                      >
                        <span>+ Link / Manage</span>
                      </button>
                    </div>

                    {attachedManuals.length === 0 ? (
                      <div className="p-3 bg-[#141414] border border-dashed border-[#262626] rounded-2xl text-center">
                        <span className="text-xs text-zinc-500 italic block mb-1">
                          No manuals or SOPs linked to this workstation yet.
                        </span>
                        <button
                          type="button"
                          onClick={() => openCatalogForMachine({ id: machine.id, name: machine.name })}
                          className="text-[10px] text-[#009FE3] hover:underline font-bold"
                        >
                          Attach from Library Catalog ↗
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {attachedManuals.map((man: any) => (
                          <div
                            key={man.id}
                            className="flex items-center justify-between gap-2 p-2 bg-[#141414] border border-[#262626] rounded-xl hover:border-zinc-700 transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xs text-rose-400">📄</span>
                              <span className="text-xs font-bold text-zinc-200 truncate">
                                {man.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <a
                                href={man.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 bg-[#009FE3]/10 hover:bg-[#009FE3]/20 text-[#009FE3] text-[10px] font-bold rounded border border-[#009FE3]/30"
                              >
                                View ↗
                              </a>
                              <button
                                type="button"
                                title={`Unlink from ${machine.name}`}
                                onClick={() => handleQuickUnlink(machine.id, man.id, man.title)}
                                className="p-1 text-zinc-500 hover:text-rose-400 text-xs rounded"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Status Switcher */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#262626]/50 text-xs">
                    <span className="text-zinc-500 text-[10px]">Operational State:</span>
                    <div className="flex items-center gap-1.5">
                      {(["AVAILABLE", "MAINTENANCE", "BROKEN"] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(machine.id, st)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                            machine.operationalStatus === st
                              ? st === "AVAILABLE"
                                ? "bg-emerald-500 text-black"
                                : st === "MAINTENANCE"
                                ? "bg-[#FFED00] text-black"
                                : "bg-[#E6007E] text-white"
                              : "bg-[#141414] text-zinc-500 border border-[#262626] hover:text-white"
                          }`}
                        >
                          {st === "AVAILABLE" ? "Online" : st === "MAINTENANCE" ? "Service" : "Broken"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Central Manuals Catalog Modal */}
      <ManualsCatalogModal
        isOpen={showCatalogModal}
        onClose={() => {
          setShowCatalogModal(false);
          setFocusMachine(null);
        }}
        focusMachineId={focusMachine?.id}
        focusMachineName={focusMachine?.name}
        machinesList={machines}
        onRefresh={fetchMachines}
      />
    </div>
  );
}
