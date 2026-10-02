"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash,
  PencilSimple,
  Package,
  Check,
  WarningCircle,
  Spinner,
} from "@phosphor-icons/react";
import {
  getBundlePresets,
  saveBundlePreset,
  deleteBundlePreset,
} from "@/app/actions/inventory";
import { getLabInventory } from "@/app/actions/pos";

interface BundlePresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export function BundlePresetsModal({
  isOpen,
  onClose,
  onUpdated,
}: BundlePresetsModalProps) {
  const [presets, setPresets] = useState<any[]>([]);
  const [bulkAccessories, setBulkAccessories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<{ accessoryInventoryId: string; defaultQuantity: number; name?: string; assetTag?: string }[]>([]);

  // Item add helper state
  const [selectedAccId, setSelectedAccId] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [allPresets, inventoryItems] = await Promise.all([
        getBundlePresets(),
        getLabInventory(),
      ]);
      setPresets(allPresets || []);
      const bulkOnly = (inventoryItems || []).filter(
        (i: any) => i.trackingType === "BULK" || i.hardwareType === "BORROWABLE_GEAR"
      );
      setBulkAccessories(bulkOnly);
    } catch (err: any) {
      setError(err?.message || "Kunne ikke hente pakkesæt");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      setIsEditing(false);
      setEditingId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setItems([]);
    setSelectedAccId("");
    setSelectedQty(1);
    setIsEditing(true);
  };

  const handleStartEdit = (preset: any) => {
    setEditingId(preset.id);
    setName(preset.name);
    setDescription(preset.description || "");
    setItems(
      (preset.items || []).map((it: any) => ({
        accessoryInventoryId: it.accessoryInventoryId,
        defaultQuantity: it.defaultQuantity || 1,
        name: it.accessory?.name,
        assetTag: it.accessory?.assetTag,
      }))
    );
    setSelectedAccId("");
    setSelectedQty(1);
    setIsEditing(true);
  };

  const handleAddItemToPreset = () => {
    if (!selectedAccId) return;
    const acc = bulkAccessories.find((a) => a.id === selectedAccId);
    if (!acc) return;

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.accessoryInventoryId === selectedAccId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].defaultQuantity += selectedQty;
        return updated;
      }
      return [
        ...prev,
        {
          accessoryInventoryId: acc.id,
          defaultQuantity: selectedQty,
          name: acc.name,
          assetTag: acc.assetTag,
        },
      ];
    });

    setSelectedAccId("");
    setSelectedQty(1);
  };

  const handleRemoveItemFromPreset = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Angiv et pakkenavn");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await saveBundlePreset({
        id: editingId || undefined,
        name,
        description,
        items: items.map((it) => ({
          accessoryInventoryId: it.accessoryInventoryId,
          defaultQuantity: it.defaultQuantity,
        })),
      });

      setIsEditing(false);
      setEditingId(null);
      await loadData();
      if (onUpdated) onUpdated();
    } catch (err: any) {
      setError(err?.message || "Fejl ved lagring af pakkesæt");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (presetId: string, presetName: string) => {
    if (!confirm(`Er du sikker på, at du vil slette pakken "${presetName}"?`)) return;

    setIsLoading(true);
    try {
      await deleteBundlePreset(presetId);
      await loadData();
      if (onUpdated) onUpdated();
    } catch (err: any) {
      setError(err?.message || "Fejl ved sletning");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-[#151517] border border-[#333333] rounded-2xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#202021] border border-[#333333] flex items-center justify-center text-[#009FE3]">
              <Package size={22} weight="bold" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-notch text-white leading-tight">
                Pakkesæt & Kits
              </h2>
              <p className="text-xs text-zinc-400 font-headline">
                Opret genbrugelige pakkesæt én gang og tildel dem til flere maskiner eller kameraer
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#202021] transition-colors"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-lg flex items-center gap-2 text-xs text-red-400">
              <WarningCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isEditing ? (
            /* Preset Editor Form */
            <form onSubmit={handleSave} className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
                <h3 className="text-sm font-bold text-white font-headline">
                  {editingId ? "Rediger pakkesæt" : "Opret nyt pakkesæt"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Annuller
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 font-headline">
                    Pakkenavn *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="f.eks. Sony A7 IV Videokit"
                    className="w-full bg-[#202021] border border-[#333333] rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#009FE3]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 font-headline">
                    Beskrivelse
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="f.eks. Inkluderer 2x batterier og dobbeltlader"
                    className="w-full bg-[#202021] border border-[#333333] rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#009FE3]"
                  />
                </div>
              </div>

              {/* Items in Preset */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300 font-headline">
                    Medfølgende tilbehør ({items.length})
                  </label>
                  <span className="text-[11px] text-[#009FE3]">
                    Foreslås samlet ved scanning af tilknyttet maskine
                  </span>
                </div>

                {items.length > 0 ? (
                  <div className="space-y-2">
                    {items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-[#202021] border border-[#333333] rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#FFED00] bg-[#151517] px-2 py-0.5 rounded border border-[#333333]">
                            {it.defaultQuantity}x
                          </span>
                          <span className="text-white font-medium">
                            {it.name || it.assetTag || "Tilbehør"}
                          </span>
                          {it.assetTag && (
                            <span className="text-[10px] text-zinc-500 font-mono">
                              ({it.assetTag})
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItemFromPreset(idx)}
                          className="text-zinc-400 hover:text-[#E6007E] p-1 transition-colors"
                          title="Fjern tilbehør"
                        >
                          <Trash size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-[#202021] border border-dashed border-[#333333] rounded-lg text-center text-xs text-zinc-500">
                    Ingen tilbehørsdele tilføjet til pakken endnu
                  </div>
                )}

                {/* Add Item Row */}
                <div className="flex items-center gap-2 pt-1">
                  <select
                    value={selectedAccId}
                    onChange={(e) => setSelectedAccId(e.target.value)}
                    className="flex-1 bg-[#202021] border border-[#333333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#009FE3]"
                  >
                    <option value="">Vælg tilbehør / puljevare...</option>
                    {bulkAccessories.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.assetTag})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={selectedQty}
                    onChange={(e) => setSelectedQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-16 bg-[#202021] border border-[#333333] rounded-lg px-2 py-2 text-xs text-white text-center font-mono focus:outline-none focus:border-[#009FE3]"
                    title="Standard antal"
                  />
                  <button
                    type="button"
                    disabled={!selectedAccId}
                    onClick={handleAddItemToPreset}
                    className="px-4 py-2 bg-[#202021] hover:bg-[#262626] border border-[#444444] text-white rounded-lg text-xs font-headline font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40"
                  >
                    <Plus size={14} weight="bold" />
                    <span>Tilføj</span>
                  </button>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg text-xs font-headline font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#009FE3] hover:bg-[#0089c4] text-white rounded-lg text-xs font-headline font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isSaving && <Spinner size={14} className="animate-spin" />}
                  <span>{editingId ? "Gem ændringer" : "Opret pakkesæt"}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Presets List View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-headline font-semibold uppercase tracking-wider">
                  Eksisterende pakkesæt ({presets.length})
                </span>
                <button
                  type="button"
                  onClick={handleStartCreate}
                  className="px-3.5 py-1.5 bg-[#009FE3] hover:bg-[#0089c4] text-white rounded-lg text-xs font-headline font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus size={14} weight="bold" />
                  <span>Nyt pakkesæt</span>
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center p-12 text-zinc-400">
                  <Spinner size={24} className="animate-spin mr-2" />
                  <span className="text-xs font-headline">Henter pakkesæt...</span>
                </div>
              ) : presets.length === 0 ? (
                <div className="p-12 text-center bg-[#202021] border border-dashed border-[#333333] rounded-xl space-y-3">
                  <Package size={36} className="mx-auto text-zinc-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold font-headline text-white">
                      Ingen pakkesæt oprettet endnu
                    </p>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      Opret et pakkesæt som for eksempel &quot;Sony A7 Videokit&quot; med batterier og ladere, og tilknyt det til flere kameraer.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartCreate}
                    className="px-4 py-2 bg-[#009FE3] hover:bg-[#0089c4] text-white rounded-lg text-xs font-headline font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Plus size={14} weight="bold" />
                    <span>Opret dit første pakkesæt</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {presets.map((preset) => (
                    <div
                      key={preset.id}
                      className="p-4 bg-[#202021] border border-[#333333] rounded-xl flex flex-col justify-between gap-3 group hover:border-[#444444] transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold font-headline text-white">
                            {preset.name}
                          </h4>
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(preset)}
                              className="p-1 text-zinc-400 hover:text-[#009FE3] transition-colors"
                              title="Rediger pakkesæt"
                            >
                              <PencilSimple size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(preset.id, preset.name)}
                              className="p-1 text-zinc-400 hover:text-[#E6007E] transition-colors"
                              title="Slet pakkesæt"
                            >
                              <Trash size={15} />
                            </button>
                          </div>
                        </div>

                        {preset.description && (
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                            {preset.description}
                          </p>
                        )}
                      </div>

                      {/* Included accessories summary */}
                      <div className="space-y-1.5 pt-2 border-t border-[#262626]">
                        <span className="text-[10px] text-zinc-400 uppercase font-headline tracking-wider">
                          Tilbehør ({preset.items?.length || 0})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(preset.items || []).map((it: any, i: number) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#151517] border border-[#333333] text-[11px] text-zinc-300 font-mono"
                            >
                              <span className="text-[#FFED00] font-bold">
                                {it.defaultQuantity}x
                              </span>
                              <span>{it.accessory?.name || it.accessory?.assetTag || "Vare"}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Equipment assignments badge */}
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                        <span>
                          Tilknyttet:{" "}
                          <strong className="text-white">
                            {preset.assignments?.length || 0}
                          </strong>{" "}
                          maskiner/udstyr
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
