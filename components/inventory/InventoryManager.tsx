"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getInventoryWithFilters,
  getLabsList,
  getFacetedTags,
  generateAssetTag,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  createTag,
} from "@/app/actions/inventory";
import { HardwareType, OperationalStatus, TagFacet } from "@prisma/client";
import { motion, AnimatePresence } from "motion/react";

export function InventoryManager() {
  const [items, setItems] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [facetedTags, setFacetedTags] = useState<{
    disciplines: any[];
    processes: any[];
  }>({
    disciplines: [],
    processes: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // Multi-Faceted Filters
  const [selectedLab, setSelectedLab] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");
  const [selectedProcess, setSelectedProcess] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Drawer State
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Tag Prompt State
  const [showNewTagModal, setShowNewTagModal] = useState<TagFacet | null>(null);
  const [newTagNameInput, setNewTagNameInput] = useState("");

  // New Item Form Data
  const [newName, setNewName] = useState("");
  const [newLabSlug, setNewLabSlug] = useState("makerspace");
  const [newHardwareType, setNewHardwareType] = useState<HardwareType>("BORROWABLE_GEAR");
  const [newNotes, setNewNotes] = useState("");
  const [selectedDisciplineSlug, setSelectedDisciplineSlug] = useState<string>("");
  const [selectedProcessSlug, setSelectedProcessSlug] = useState<string>("");
  const [previewTag, setPreviewTag] = useState<string>("MK-GEN-0001");

  const fetchInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      const [resItems, resLabs, resTags] = await Promise.all([
        getInventoryWithFilters({
          labSlug: selectedLab !== "ALL" ? selectedLab : undefined,
          hardwareType: selectedType !== "ALL" ? (selectedType as HardwareType) : undefined,
          operationalStatus: selectedStatus !== "ALL" ? (selectedStatus as OperationalStatus) : undefined,
          disciplineSlug: selectedDiscipline !== "ALL" ? selectedDiscipline : undefined,
          processSlug: selectedProcess !== "ALL" ? selectedProcess : undefined,
          searchQuery,
        }),
        getLabsList(),
        getFacetedTags(),
      ]);

      setItems(resItems);
      setLabs(resLabs);
      setFacetedTags(resTags);

      if (!selectedDisciplineSlug && resTags.disciplines.length > 0) {
        setSelectedDisciplineSlug(resTags.disciplines[0].slug);
      }
    } catch (err) {
      console.error("Failed to load inventory", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedLab,
    selectedType,
    selectedStatus,
    selectedDiscipline,
    selectedProcess,
    searchQuery,
    selectedDisciplineSlug,
  ]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Update preview tag when lab or primary category tag changes
  useEffect(() => {
    if (showAddDrawer) {
      const primarySlug = selectedProcessSlug || selectedDisciplineSlug || undefined;
      generateAssetTag({
        labSlug: newLabSlug,
        tagSlug: primarySlug,
      }).then((tag) => setPreviewTag(tag));
    }
  }, [showAddDrawer, newLabSlug, selectedDisciplineSlug, selectedProcessSlug]);

  const handleCreateNewTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagNameInput.trim() || !showNewTagModal) return;

    try {
      setIsSubmitting(true);
      const res = await createTag({
        name: newTagNameInput.trim(),
        facet: showNewTagModal,
      });

      if (res.success && res.tag) {
        const updatedTags = await getFacetedTags();
        setFacetedTags(updatedTags);

        if (showNewTagModal === "DISCIPLINE") setSelectedDisciplineSlug(res.tag.slug);
        if (showNewTagModal === "PROCESS") setSelectedProcessSlug(res.tag.slug);

        setShowNewTagModal(null);
        setNewTagNameInput("");
      }
    } catch (err: any) {
      alert(err.message || "Failed to create tag.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setFormError("Item / Machine Name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      const tagSlugs = [
        selectedDisciplineSlug,
        selectedProcessSlug,
      ].filter(Boolean);

      await createInventoryItem({
        name: newName.trim(),
        labSlug: newLabSlug,
        hardwareType: newHardwareType,
        notes: newNotes.trim() || undefined,
        tagSlugs,
      });

      setShowAddDrawer(false);
      setNewName("");
      setNewNotes("");
      fetchInventory();
    } catch (err: any) {
      setFormError(err.message || "Failed to create item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setIsSubmitting(true);
      setFormError(null);
      await updateInventoryItem({
        id: editingItem.id,
        name: editingItem.name,
        operationalStatus: editingItem.operationalStatus,
        notes: editingItem.notes,
      });

      setEditingItem(null);
      fetchInventory();
    } catch (err: any) {
      setFormError(err.message || "Failed to update item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return;
    try {
      setIsSubmitting(true);
      await deleteInventoryItem(id);
      setEditingItem(null);
      fetchInventory();
    } catch (err: any) {
      alert(err.message || "Could not delete item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-2xl font-mono text-white">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Inventory & Faceted Catalog
            </h2>
            <span className="bg-[#FFED00] text-black text-xs font-bold px-2.5 py-0.5 rounded-full">
              {items.length} Assets
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            2-Tier Namespaced Faceted Taxonomy (Discipline • Process) & Macro-Lab Assignments
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddDrawer(true)}
          className="px-5 py-2.5 bg-[#FFED00] hover:bg-[#ffe600] text-black font-bold text-xs rounded-full shadow-lg shadow-[#FFED00]/20 transition-transform hover:scale-[1.02]"
        >
          + Register New Asset (Auto-Tag)
        </button>
      </div>

      {/* 2-Tier Multi-Faceted Filter Bar */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pb-6 border-b border-[#262626]">
        {/* Macro Facility Lab Filter */}
        <div>
          <label className="text-[10px] text-zinc-500 uppercase block mb-1 font-bold">Facility Lab</label>
          <select
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#262626] text-[#009FE3] text-xs rounded-xl p-2.5 outline-none font-bold"
          >
            <option value="ALL">All Facilities</option>
            {labs.map((lab) => (
              <option key={lab.id} value={lab.slug}>
                {lab.name}
              </option>
            ))}
          </select>
        </div>

        {/* Operational Status */}
        <div>
          <label className="text-[10px] text-zinc-500 uppercase block mb-1 font-bold">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#262626] text-white text-xs rounded-xl p-2.5 outline-none font-bold"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="BROKEN">Broken</option>
          </select>
        </div>

        {/* 1. DISCIPLINE Filter */}
        <div>
          <label className="text-[10px] text-[#FFED00] uppercase block mb-1 font-bold">1. Discipline</label>
          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#FFED00]/30 text-white text-xs rounded-xl p-2.5 outline-none font-bold"
          >
            <option value="ALL">All Disciplines</option>
            {facetedTags.disciplines.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. PROCESS Filter */}
        <div>
          <label className="text-[10px] text-[#009FE3] uppercase block mb-1 font-bold">2. Process</label>
          <select
            value={selectedProcess}
            onChange={(e) => setSelectedProcess(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#009FE3]/30 text-white text-xs rounded-xl p-2.5 outline-none font-bold"
          >
            <option value="ALL">All Processes</option>
            {facetedTags.processes.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="text-[10px] text-zinc-500 uppercase block mb-1 font-bold">Search</label>
          <input
            type="text"
            placeholder="Search items, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#262626] text-white text-xs rounded-xl p-2.5 outline-none font-bold"
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="mt-4 overflow-x-auto">
        {items.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-xs">
            No inventory assets match the current faceted taxonomy filter selection.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-zinc-500 border-b border-[#262626]">
                <th className="py-3 px-3 font-semibold uppercase tracking-wider">Asset Tag & Name</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider">Faceted Dimensions</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider">Facility Lab</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider">Status</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider">Circulation</th>
                <th className="py-3 px-3 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {items.map((item) => {
                const activeLoan = item.loans?.[0];
                const itemTags = item.tags || [];

                return (
                  <tr key={item.id} className="hover:bg-[#1a1a1a] transition-colors">
                    {/* Name & Deterministic Tag */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-white text-sm">{item.name}</div>
                      <div className="flex items-center gap-2 text-[11px] text-[#009FE3] font-bold mt-0.5">
                        <span className="bg-[#009FE3]/10 px-2 py-0.5 rounded border border-[#009FE3]/30">
                          {item.assetTag}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-normal">
                          {item.hardwareType === "BORROWABLE_GEAR" ? "Borrowable Gear" : "Static Machine"}
                        </span>
                      </div>
                    </td>

                    {/* Faceted Dimensions Chips */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap items-center gap-1.5 max-w-xs">
                        {itemTags.map((it: any) => {
                          const tag = it.tag;
                          const isDiscipline = tag.facet === "DISCIPLINE";
                          const isProcess = tag.facet === "PROCESS";

                          return (
                            <span
                              key={tag.id}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${isDiscipline
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
                    </td>

                    {/* Facility Lab */}
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 bg-[#0D0D0D] border border-[#262626] rounded-full text-[11px] text-zinc-300 font-bold">
                        🏛️ {item.lab?.name}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${item.operationalStatus === "AVAILABLE"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : item.operationalStatus === "MAINTENANCE"
                              ? "bg-[#FFED00]/20 text-[#FFED00] border border-[#FFED00]/30"
                              : "bg-[#E6007E]/20 text-[#E6007E] border border-[#E6007E]/30"
                          }`}
                      >
                        {item.operationalStatus}
                      </span>
                    </td>

                    {/* Loan State */}
                    <td className="py-3 px-3">
                      {activeLoan ? (
                        <div>
                          <div className="text-[#009FE3] font-bold">
                            On Loan to {activeLoan.patron?.studentId}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            Due: {new Date(activeLoan.expectedReturn).toLocaleDateString("en-DK", { month: "short", day: "numeric" })}
                          </div>
                        </div>
                      ) : item.hardwareType === "BORROWABLE_GEAR" ? (
                        <span className="text-emerald-400 text-[11px] font-bold">✓ Ready for checkout</span>
                      ) : (
                        <span className="text-zinc-500 text-[11px]">Static Workstation</span>
                      )}
                    </td>

                    {/* Edit Actions */}
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setEditingItem(item)}
                        className="px-3.5 py-1.5 bg-[#0D0D0D] hover:bg-[#262626] border border-[#262626] rounded-full text-zinc-300 hover:text-white font-bold transition-colors"
                      >
                        ✎ Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add New Item Modal with 3-Tier Faceted Taxonomy */}
      <AnimatePresence>
        {showAddDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] border border-[#FFED00] rounded-3xl p-6 max-w-xl w-full shadow-2xl font-mono text-xs max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                <div>
                  <h3 className="text-sm font-bold text-[#FFED00]">Register Asset with Faceted Taxonomy</h3>
                  <p className="text-[11px] text-zinc-400">Deterministic auto-tagging + 3-tier dimensions</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddDrawer(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {formError && (
                <div className="mt-3 p-2 bg-[#E6007E]/10 border border-[#E6007E]/30 rounded-xl text-[#E6007E]">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3">
                {/* Auto-Generated Asset Tag Display */}
                <div className="bg-[#0D0D0D] border border-[#009FE3]/40 rounded-2xl p-3.5">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span className="font-bold uppercase tracking-wider text-[#009FE3]">
                      Deterministic Asset Tag (Auto-Generated)
                    </span>
                    <span className="text-[10px] bg-[#009FE3]/20 text-[#009FE3] px-2 py-0.5 rounded-full font-bold">
                      LOCKED
                    </span>
                  </div>
                  <div className="text-xl font-extrabold text-white tracking-widest">
                    {previewTag}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Computed via [LAB-PREFIX]-[CATEGORY]-[4-DIGIT-SEQUENCE]
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1 font-bold">Macro Facility Lab</label>
                    <select
                      value={newLabSlug}
                      onChange={(e) => setNewLabSlug(e.target.value)}
                      className="w-full bg-[#0D0D0D] border border-[#262626] text-white rounded-xl p-2.5 outline-none font-bold"
                    >
                      <option value="makerspace">Makerspace (Køge) [Default]</option>
                      <option value="medialab">MediaLab (Køge)</option>
                      <option value="roskilde">Roskilde Lab [Placeholder]</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-400 block mb-1 font-bold">Hardware Classification</label>
                    <select
                      value={newHardwareType}
                      onChange={(e) => setNewHardwareType(e.target.value as HardwareType)}
                      className="w-full bg-[#0D0D0D] border border-[#262626] text-white rounded-xl p-2.5 outline-none font-bold"
                    >
                      <option value="BORROWABLE_GEAR">Borrowable Gear (Medialab)</option>
                      <option value="STATIC_MACHINE">Static Machine (Makerspace)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1 font-bold">Item / Machine Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Brother GTX Pro Direct-to-Garment"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#FFED00] text-white rounded-xl p-2.5 outline-none font-bold"
                  />
                </div>

                {/* 2-Tier Faceted Taxonomy Selectors */}
                <div className="p-3.5 bg-[#0D0D0D] border border-[#262626] rounded-2xl space-y-3">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Faceted Taxonomy Dimensions
                  </div>

                  {/* 1. DISCIPLINE */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[#FFED00] font-bold">1. Discipline (Domain/Zone)</label>
                      <button
                        type="button"
                        onClick={() => setShowNewTagModal("DISCIPLINE")}
                        className="text-[10px] text-zinc-400 hover:text-[#FFED00]"
                      >
                        + Add New
                      </button>
                    </div>
                    <select
                      value={selectedDisciplineSlug}
                      onChange={(e) => setSelectedDisciplineSlug(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl p-2 outline-none font-bold"
                    >
                      <option value="">-- None --</option>
                      {facetedTags.disciplines.map((t) => (
                        <option key={t.slug} value={t.slug}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. PROCESS */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[#009FE3] font-bold">2. Process (Hardware Technique)</label>
                      <button
                        type="button"
                        onClick={() => setShowNewTagModal("PROCESS")}
                        className="text-[10px] text-zinc-400 hover:text-[#009FE3]"
                      >
                        + Add New
                      </button>
                    </div>
                    <select
                      value={selectedProcessSlug}
                      onChange={(e) => setSelectedProcessSlug(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] text-white rounded-xl p-2 outline-none font-bold"
                    >
                      <option value="">-- None --</option>
                      {facetedTags.processes.map((t) => (
                        <option key={t.slug} value={t.slug}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Notes / Description</label>
                  <textarea
                    rows={2}
                    placeholder="Operating notes, accessories, or specifics..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#262626] text-white rounded-xl p-2 outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddDrawer(false)}
                    className="px-4 py-2 bg-[#0D0D0D] border border-[#262626] text-zinc-400 rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-[#FFED00] text-black font-bold rounded-full shadow-lg shadow-[#FFED00]/20"
                  >
                    {isSubmitting ? "Saving..." : `Create Asset [${previewTag}]`}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Tag Creation Modal */}
      <AnimatePresence>
        {showNewTagModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] border border-[#262626] rounded-3xl p-6 max-w-sm w-full shadow-2xl font-mono text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                <h4 className="text-sm font-bold text-white">
                  Add New {showNewTagModal} Tag
                </h4>
                <button
                  type="button"
                  onClick={() => setShowNewTagModal(null)}
                  className="text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateNewTag} className="mt-4 space-y-3">
                <div>
                  <label className="text-zinc-400 block mb-1 font-bold">Tag Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sublimation"
                    value={newTagNameInput}
                    onChange={(e) => setNewTagNameInput(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#FFED00] text-white rounded-xl p-2.5 outline-none font-bold"
                    autoFocus
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewTagModal(null)}
                    className="px-3.5 py-1.5 bg-[#0D0D0D] text-zinc-400 rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newTagNameInput.trim()}
                    className="px-5 py-1.5 bg-[#FFED00] text-black font-bold rounded-full"
                  >
                    Create Tag
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Item Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] border border-[#009FE3] rounded-3xl p-6 max-w-lg w-full shadow-2xl font-mono text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                <h3 className="text-sm font-bold text-[#009FE3]">
                  Edit Asset: [{editingItem.assetTag}]
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {formError && (
                <div className="mt-3 p-2 bg-[#E6007E]/10 border border-[#E6007E]/30 rounded-xl text-[#E6007E]">
                  {formError}
                </div>
              )}

              <form onSubmit={handleUpdateSubmit} className="mt-4 space-y-3">
                <div>
                  <label className="text-zinc-400 block mb-1 font-bold">Item Name</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#009FE3] text-white rounded-xl p-2.5 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1 font-bold">Operational Status</label>
                  <select
                    value={editingItem.operationalStatus}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, operationalStatus: e.target.value as OperationalStatus })
                    }
                    className="w-full bg-[#0D0D0D] border border-[#262626] text-white rounded-xl p-2.5 outline-none"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="BROKEN">BROKEN</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={editingItem.notes || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-[#262626] text-white rounded-xl p-2 outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-[#262626] flex items-center justify-between">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleDeleteItem(editingItem.id)}
                    className="px-3.5 py-1.5 bg-[#E6007E]/20 text-[#E6007E] border border-[#E6007E]/40 rounded-full hover:bg-[#E6007E] hover:text-white transition-colors"
                  >
                    Delete Item
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="px-4 py-2 bg-[#0D0D0D] border border-[#262626] text-zinc-400 rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 bg-[#009FE3] text-black font-bold rounded-full shadow-lg shadow-[#009FE3]/20"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
