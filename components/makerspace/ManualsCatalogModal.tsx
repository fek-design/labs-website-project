"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  getManualsCatalog,
  uploadManual,
  assignManualToMachine,
  unassignManualFromMachine,
  deleteManual,
} from "@/app/actions/manuals";

interface ManualsCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  focusMachineId?: string;
  focusMachineName?: string;
  machinesList?: any[];
  onRefresh?: () => void;
}

export function ManualsCatalogModal({
  isOpen,
  onClose,
  focusMachineId,
  focusMachineName,
  machinesList = [],
  onRefresh,
}: ManualsCatalogModalProps) {
  const [manuals, setManuals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"BROWSE" | "UPLOAD">("BROWSE");

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [selectedMachineIdToLink, setSelectedMachineIdToLink] = useState<string>(
    focusMachineId || ""
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Machine link picker dropdown state per manual
  const [linkingManualId, setLinkingManualId] = useState<string | null>(null);
  const [targetMachineId, setTargetMachineId] = useState<string>("");

  const fetchCatalog = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getManualsCatalog(searchQuery);
      setManuals(data);
    } catch (err) {
      console.error("Failed to load manuals catalog:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      fetchCatalog();
      if (focusMachineId) {
        setSelectedMachineIdToLink(focusMachineId);
      }
    }
  }, [isOpen, fetchCatalog, focusMachineId]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setFormError("Please select a PDF document to upload.");
      return;
    }

    startTransition(async () => {
      try {
        setFormError(null);
        const formData = new FormData();
        formData.append("file", uploadFile);
        if (uploadTitle.trim()) formData.append("title", uploadTitle.trim());
        if (uploadDescription.trim()) formData.append("description", uploadDescription.trim());
        if (selectedMachineIdToLink) formData.append("inventoryId", selectedMachineIdToLink);

        await uploadManual(formData);

        setUploadFile(null);
        setUploadTitle("");
        setUploadDescription("");
        setActiveTab("BROWSE");
        await fetchCatalog();
        if (onRefresh) onRefresh();
      } catch (err: any) {
        setFormError(err.message || "Failed to upload manual.");
      }
    });
  };

  const handleToggleLink = async (manualId: string, isCurrentlyLinked: boolean, machineId?: string) => {
    const targetId = machineId || focusMachineId;
    if (!targetId) return;

    startTransition(async () => {
      try {
        if (isCurrentlyLinked) {
          await unassignManualFromMachine({ inventoryId: targetId, manualId });
        } else {
          await assignManualToMachine({ inventoryId: targetId, manualId });
        }
        await fetchCatalog();
        if (onRefresh) onRefresh();
      } catch (err: any) {
        alert(err.message || "Failed to update manual association.");
      }
    });
  };

  const handleAssignToSelectedMachine = async (manualId: string) => {
    if (!targetMachineId) return;

    startTransition(async () => {
      try {
        await assignManualToMachine({ inventoryId: targetMachineId, manualId });
        setLinkingManualId(null);
        setTargetMachineId("");
        await fetchCatalog();
        if (onRefresh) onRefresh();
      } catch (err: any) {
        alert(err.message || "Failed to link manual.");
      }
    });
  };

  const handleDeleteManual = async (manualId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from the catalog? This unlinks it from all machines and deletes the local file.`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteManual({ manualId });
        await fetchCatalog();
        if (onRefresh) onRefresh();
      } catch (err: any) {
        alert(err.message || "Failed to delete manual.");
      }
    });
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "PDF Doc";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#141414] border border-[#262626] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d0d0d]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📚</span>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Centralized Manuals & SOP Catalog
              </h3>
              <span className="bg-[#009FE3]/10 text-[#009FE3] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#009FE3]/30">
                {manuals.length} Documents
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Many-to-Many documentation library • Link shared safety SOPs & guides across all machines
            </p>
            {focusMachineName && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFED00]/10 text-[#FFED00] border border-[#FFED00]/30 rounded-full text-[11px] font-bold">
                <span>Linking to machine:</span>
                <span className="underline">{focusMachineName}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-[#1a1a1a] p-1 rounded-full border border-[#262626]">
              <button
                type="button"
                onClick={() => setActiveTab("BROWSE")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  activeTab === "BROWSE"
                    ? "bg-[#FFED00] text-black shadow-md shadow-[#FFED00]/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Browse Library
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("UPLOAD")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  activeTab === "UPLOAD"
                    ? "bg-[#FFED00] text-black shadow-md shadow-[#FFED00]/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                + Upload PDF
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-[#262626] rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "UPLOAD" ? (
            /* Upload New Manual Tab */
            <form onSubmit={handleUploadSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="text-sm font-bold text-white pb-2 border-b border-[#262626]">
                Upload PDF to Central Documentation Library
              </div>

              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
                  {formError}
                </div>
              )}

              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-bold">
                  PDF File <span className="text-[#E6007E]">*</span>
                </label>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setUploadFile(file);
                    if (file && !uploadTitle) {
                      setUploadTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
                    }
                  }}
                  className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#FFED00] text-zinc-300 text-xs rounded-xl p-3 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#FFED00] file:text-black hover:file:bg-[#ffe600]"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-bold">
                  Document Title <span className="text-zinc-500 font-normal">(Human Readable)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Universal Laser Safety SOP v2.4"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#FFED00] text-white text-xs rounded-xl p-3 outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-bold">
                  Description / Procedures
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of operation steps, PPE guidelines, emergency stops..."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#FFED00] text-white text-xs rounded-xl p-3 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1 font-bold">
                  Initial Machine Assignment <span className="text-zinc-500 font-normal">(Optional)</span>
                </label>
                <select
                  value={selectedMachineIdToLink}
                  onChange={(e) => setSelectedMachineIdToLink(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#262626] text-white text-xs rounded-xl p-3 outline-none font-bold"
                >
                  <option value="">-- No Immediate Machine Link (Library Only) --</option>
                  {machinesList.map((m) => (
                    <option key={m.id} value={m.id}>
                      [{m.assetTag}] {m.name} ({m.lab?.name || "Lab"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setActiveTab("BROWSE")}
                  className="px-5 py-2.5 bg-[#0D0D0D] border border-[#262626] text-zinc-400 text-xs font-bold rounded-full hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !uploadFile}
                  className="px-6 py-2.5 bg-[#FFED00] hover:bg-[#ffe600] text-black font-bold text-xs rounded-full shadow-lg shadow-[#FFED00]/20 disabled:opacity-50"
                >
                  {isPending ? "Uploading..." : "Save to Catalog"}
                </button>
              </div>
            </form>
          ) : (
            /* Browse Catalog Tab */
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search manuals by title, description, or filename..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-[#0D0D0D] border border-[#262626] focus:border-[#009FE3] text-white text-xs rounded-xl p-3 outline-none font-bold"
                />
              </div>

              {isLoading ? (
                <div className="text-center py-16 text-zinc-500 text-xs">
                  Loading documentation catalog...
                </div>
              ) : manuals.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[#262626] rounded-2xl p-6">
                  <span className="text-3xl block mb-2">📄</span>
                  <p className="text-zinc-400 text-xs font-bold">No manuals found in catalog.</p>
                  <p className="text-zinc-600 text-[11px] mt-1">Upload a PDF manual to start building the library.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("UPLOAD")}
                    className="mt-4 px-4 py-2 bg-[#FFED00] text-black font-bold text-xs rounded-full"
                  >
                    + Upload First Manual
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {manuals.map((manual) => {
                    const linkedMachines = manual.machines || [];
                    const isLinkedToFocusedMachine = focusMachineId
                      ? linkedMachines.some((m: any) => m.inventory?.id === focusMachineId)
                      : false;

                    return (
                      <div
                        key={manual.id}
                        className={`bg-[#0D0D0D] border ${
                          isLinkedToFocusedMachine
                            ? "border-[#FFED00]/50 shadow-md shadow-[#FFED00]/10"
                            : "border-[#262626]"
                        } rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-colors`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2.5">
                              <span className="text-2xl p-2 bg-[#141414] border border-[#262626] rounded-xl text-rose-400">
                                📕
                              </span>
                              <div>
                                <h4 className="font-bold text-white text-xs leading-snug">
                                  {manual.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-1">
                                  <span className="font-mono">{manual.fileName}</span>
                                  <span>•</span>
                                  <span>{formatFileSize(manual.fileSize)}</span>
                                </div>
                              </div>
                            </div>

                            <a
                              href={manual.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 bg-[#009FE3]/10 hover:bg-[#009FE3]/20 text-[#009FE3] text-[10px] font-bold rounded-lg border border-[#009FE3]/30 flex items-center gap-1 shrink-0"
                            >
                              <span>View</span>
                              <span>↗</span>
                            </a>
                          </div>

                          {manual.description && (
                            <p className="text-[11px] text-zinc-400 mt-2.5 line-clamp-2 leading-relaxed bg-[#141414] p-2 rounded-xl border border-[#262626]">
                              {manual.description}
                            </p>
                          )}

                          {/* Machine Linkage Chips */}
                          <div className="mt-3">
                            <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1.5 flex items-center justify-between">
                              <span>Linked Workstations ({linkedMachines.length})</span>
                            </div>

                            {linkedMachines.length === 0 ? (
                              <span className="text-[10px] text-zinc-600 italic">
                                Not currently linked to any machine.
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {linkedMachines.map((m: any) => {
                                  const inv = m.inventory;
                                  if (!inv) return null;
                                  const isThisFocused = inv.id === focusMachineId;

                                  return (
                                    <span
                                      key={inv.id}
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                        isThisFocused
                                          ? "bg-[#FFED00]/15 text-[#FFED00] border-[#FFED00]/40"
                                          : "bg-[#1a1a1a] text-zinc-300 border-[#262626]"
                                      }`}
                                    >
                                      <span>[{inv.assetTag}]</span>
                                      <span className="truncate max-w-[120px]">{inv.name}</span>
                                      <button
                                        type="button"
                                        title={`Unlink from ${inv.name}`}
                                        onClick={() => handleToggleLink(manual.id, true, inv.id)}
                                        className="hover:text-rose-400 ml-0.5"
                                      >
                                        ✕
                                      </button>
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between gap-2">
                          {/* Machine Quick Link / Unlink (Focus Mode) */}
                          {focusMachineId ? (
                            <button
                              type="button"
                              onClick={() => handleToggleLink(manual.id, isLinkedToFocusedMachine)}
                              disabled={isPending}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                                isLinkedToFocusedMachine
                                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                                  : "bg-[#FFED00] text-black hover:bg-[#ffe600] shadow-md shadow-[#FFED00]/10"
                              }`}
                            >
                              <span>{isLinkedToFocusedMachine ? "✕ Unlink Machine" : "+ Link to Workstation"}</span>
                            </button>
                          ) : (
                            /* General Mode Machine Linker Dropdown */
                            <div className="flex-1 flex items-center gap-1.5">
                              {linkingManualId === manual.id ? (
                                <div className="flex items-center gap-1.5 flex-1">
                                  <select
                                    value={targetMachineId}
                                    onChange={(e) => setTargetMachineId(e.target.value)}
                                    className="bg-[#141414] border border-[#262626] text-white text-[11px] rounded-xl p-1.5 flex-1 outline-none font-bold"
                                  >
                                    <option value="">Select Machine to Link...</option>
                                    {machinesList
                                      .filter((m) => !linkedMachines.some((lm: any) => lm.inventory?.id === m.id))
                                      .map((m) => (
                                        <option key={m.id} value={m.id}>
                                          [{m.assetTag}] {m.name}
                                        </option>
                                      ))}
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => handleAssignToSelectedMachine(manual.id)}
                                    disabled={!targetMachineId || isPending}
                                    className="px-2.5 py-1.5 bg-[#009FE3] text-black font-bold text-[11px] rounded-xl disabled:opacity-40"
                                  >
                                    Link
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setLinkingManualId(null);
                                      setTargetMachineId("");
                                    }}
                                    className="px-2 py-1.5 text-zinc-500 hover:text-white text-[11px]"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setLinkingManualId(manual.id)}
                                  className="text-[10px] text-zinc-400 hover:text-[#FFED00] font-bold flex items-center gap-1"
                                >
                                  <span>+ Link to Another Machine</span>
                                </button>
                              )}
                            </div>
                          )}

                          {/* Delete Document Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteManual(manual.id, manual.title)}
                            disabled={isPending}
                            title="Delete manual from catalog"
                            className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/10"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
