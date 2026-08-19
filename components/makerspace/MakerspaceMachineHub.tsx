"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { getInventoryWithFilters, updateInventoryItem } from "@/app/actions/inventory";
import { uploadMachineManual, deleteMachineManual, replaceMachineManual } from "@/app/actions/upload";
import { OperationalStatus, HardwareType } from "@prisma/client";
import { motion, AnimatePresence } from "motion/react";

export function MakerspaceMachineHub() {
  const [machines, setMachines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("ALL");

  // PDF Upload / Replace State
  const [uploadingMachineId, setUploadingMachineId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeMachineForUpload = useRef<string | null>(null);
  const isReplacingRef = useRef<boolean>(false);

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

  const handleTriggerUpload = (machineId: string, isReplacing: boolean = false) => {
    activeMachineForUpload.current = machineId;
    isReplacingRef.current = isReplacing;
    setUploadError(null);
    setUploadSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const machineId = activeMachineForUpload.current;
    if (!file || !machineId) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setUploadError("Please select a valid PDF manual document.");
      setTimeout(() => setUploadError(null), 4000);
      return;
    }

    try {
      setUploadingMachineId(machineId);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("machineId", machineId);

      const res = isReplacingRef.current
        ? await replaceMachineManual(formData)
        : await uploadMachineManual(formData);

      if (res.success) {
        setUploadSuccess(`PDF "${file.name}" attached successfully!`);
        fetchMachines();
        setTimeout(() => setUploadSuccess(null), 4000);
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload manual.");
      setTimeout(() => setUploadError(null), 4000);
    } finally {
      setUploadingMachineId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteManual = async (machineId: string) => {
    if (!confirm("Are you sure you want to delete this PDF manual?")) return;
    try {
      setUploadingMachineId(machineId);
      await deleteMachineManual(machineId);
      setUploadSuccess("Manual removed successfully.");
      fetchMachines();
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: any) {
      setUploadError(err.message || "Failed to delete manual.");
      setTimeout(() => setUploadError(null), 4000);
    } finally {
      setUploadingMachineId(null);
    }
  };

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-2xl font-mono text-white">
      {/* Hidden File Input for PDF Manuals */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="application/pdf"
        className="hidden"
      />

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
            Static rapid prototyping machinery, official user manual repository, and maintenance records (Non-Rental)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500">Facility Policy:</span>
          <span className="px-3 py-1 bg-[#0D0D0D] border border-emerald-500/30 text-emerald-400 rounded-full font-bold">
            ✓ In-situ Station Use Only
          </span>
        </div>
      </div>

      {/* Upload Feedback Toast Alerts */}
      <AnimatePresence>
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-3 bg-[#E6007E]/10 border border-[#E6007E]/30 rounded-2xl text-xs text-[#E6007E] font-bold"
          >
            {uploadError}
          </motion.div>
        )}
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-bold"
          >
            {uploadSuccess}
          </motion.div>
        )}
      </AnimatePresence>

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
            No static machines match the search query "{searchQuery}".
          </div>
        ) : (
          machines.map((machine) => {
            const isAvailable = machine.operationalStatus === "AVAILABLE";
            const isMaintenance = machine.operationalStatus === "MAINTENANCE";
            const isUploading = uploadingMachineId === machine.id;
            const manualUrl = machine.customFields?.manualUrl;
            const manualFileName = machine.customFields?.manualFileName;
            const machineTags = machine.tags || [];

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

                  {/* 3-Tier Faceted Tags */}
                  {machineTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {machineTags.map((it: any) => {
                        const tag = it.tag;
                        const isDiscipline = tag.facet === "DISCIPLINE";
                        const isProcess = tag.facet === "PROCESS";
                        const isMaterial = tag.facet === "MATERIAL";

                        return (
                          <span
                            key={tag.id}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              isDiscipline
                                ? "bg-[#FFED00]/10 text-[#FFED00] border-[#FFED00]/30"
                                : isProcess
                                ? "bg-[#009FE3]/10 text-[#009FE3] border-[#009FE3]/30"
                                : isMaterial
                                ? "bg-[#E6007E]/10 text-[#E6007E] border-[#E6007E]/30"
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

                {/* PDF Manual Documents & Action Controls */}
                <div className="mt-6 pt-4 border-t border-[#262626] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {/* Manual Link or View Button */}
                    {manualUrl ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={manualUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#009FE3]/10 border border-[#009FE3]/30 text-[#009FE3] hover:bg-[#009FE3]/20 rounded-full text-xs font-bold transition-colors"
                        >
                          <span>📄 {manualFileName || "View PDF Manual"}</span>
                          <span>↗</span>
                        </a>

                        {/* Replace Manual */}
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => handleTriggerUpload(machine.id, true)}
                          className="px-2.5 py-1 bg-[#141414] hover:bg-[#262626] border border-[#262626] text-zinc-300 hover:text-white rounded-full text-[10px] font-bold"
                          title="Replace attached PDF manual"
                        >
                          🔄 Replace
                        </button>

                        {/* Delete Manual */}
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => handleDeleteManual(machine.id)}
                          className="px-2.5 py-1 bg-[#E6007E]/10 hover:bg-[#E6007E]/20 border border-[#E6007E]/30 text-[#E6007E] rounded-full text-[10px] font-bold"
                          title="Delete PDF manual"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-zinc-600 italic text-[11px]">
                          No manual PDF attached
                        </span>
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => handleTriggerUpload(machine.id, false)}
                          className="px-3 py-1.5 bg-[#141414] hover:bg-[#262626] border border-[#262626] text-zinc-300 hover:text-white rounded-full text-[11px] font-bold transition-colors"
                        >
                          {isUploading ? "Uploading PDF..." : "📤 Upload PDF Manual"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Status Switcher */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#262626]/50 text-xs">
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
    </div>
  );
}
