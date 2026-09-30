"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Camera,
  Wrench,
  Trash,
  Plus,
  FileText,
  ArrowSquareOut,
  Spinner,
} from "@phosphor-icons/react";
import { HardwareType, OperationalStatus, TrackingType } from "@prisma/client";
import { generateAssetTag } from "@/app/actions/inventory";

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any | null; // null for Create, item object for Edit
  labs: Array<{ id: string; name: string; slug: string }>;
  availableBulkItems?: any[];
  onSave: (formData: any) => Promise<void>;
  onDelete?: (itemId: string) => Promise<void>;
  onOpenManualsPicker: () => void;
  attachedManuals: any[];
  onRemoveManual: (manualId: string) => void;
}

export function InventoryItemModal({
  isOpen,
  onClose,
  item,
  labs,
  availableBulkItems = [],
  onSave,
  onDelete,
  onOpenManualsPicker,
  attachedManuals,
  onRemoveManual,
}: InventoryItemModalProps) {
  const isEdit = Boolean(item);

  const [name, setName] = useState("");
  const [labSlug, setLabSlug] = useState("makerspace");
  const [hardwareType, setHardwareType] = useState<HardwareType>("BORROWABLE_GEAR");
  const [trackingType, setTrackingType] = useState<TrackingType>("SERIALIZED");
  const [totalQuantity, setTotalQuantity] = useState<number>(1);
  const [operationalStatus, setOperationalStatus] = useState<OperationalStatus>("AVAILABLE");
  const [serialNumber, setSerialNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [notes, setNotes] = useState("");
  const [previewTag, setPreviewTag] = useState("MK-GEN-0001");
  const [bundleItems, setBundleItems] = useState<{ accessoryInventoryId: string; defaultQuantity: number; name?: string; assetTag?: string }[]>([]);
  const [selectedAccessoryId, setSelectedAccessoryId] = useState("");
  const [accessoryQty, setAccessoryQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize or reset form state
  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setLabSlug(item.lab?.slug || "makerspace");
      setHardwareType(item.hardwareType || "BORROWABLE_GEAR");
      setTrackingType(item.trackingType || "SERIALIZED");
      setTotalQuantity(item.totalQuantity || 1);
      setOperationalStatus(item.operationalStatus || "AVAILABLE");
      setNotes(item.notes || "");
      setSerialNumber(item.customFields?.serialNumber || "");
      setPurchaseDate(item.customFields?.purchaseDate || "");
      setPreviewTag(item.assetTag || "");

      // Hydrate bundle accessories
      if (item.bundleAccessories && item.bundleAccessories.length > 0) {
        setBundleItems(
          item.bundleAccessories.map((b: any) => ({
            accessoryInventoryId: b.accessoryInventoryId || b.accessory?.id,
            defaultQuantity: b.defaultQuantity || 1,
            name: b.accessory?.name,
            assetTag: b.accessory?.assetTag,
          }))
        );
      } else {
        setBundleItems([]);
      }
    } else {
      setName("");
      setLabSlug(labs[0]?.slug || "makerspace");
      setHardwareType("BORROWABLE_GEAR");
      setTrackingType("SERIALIZED");
      setTotalQuantity(1);
      setOperationalStatus("AVAILABLE");
      setSerialNumber("");
      setPurchaseDate("");
      setNotes("");
      setBundleItems([]);
    }
    setError(null);
  }, [item, labs, isOpen]);

  // Compute live deterministic tag preview for Create mode
  useEffect(() => {
    if (!isEdit && isOpen) {
      let isMounted = true;
      generateAssetTag({ labSlug, trackingType })
        .then((tag) => {
          if (isMounted) setPreviewTag(tag);
        })
        .catch((err) => console.error("Failed to generate tag preview", err));
      return () => {
        isMounted = false;
      };
    }
  }, [labSlug, trackingType, isEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Udstyrsnavn er påkrævet.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave({
        id: item?.id,
        name: name.trim(),
        labSlug,
        hardwareType,
        trackingType,
        totalQuantity: trackingType === "BULK" ? Math.max(1, Number(totalQuantity) || 1) : 1,
        operationalStatus,
        notes: notes.trim(),
        bundleItems: trackingType === "SERIALIZED" && hardwareType === "BORROWABLE_GEAR" ? bundleItems : [],
        customFields: {
          serialNumber: trackingType === "SERIALIZED" ? serialNumber.trim() : "",
          purchaseDate: purchaseDate.trim(),
        },
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Der opstod en fejl under gemningen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!item?.id || !onDelete) return;
    const confirmDelete = window.confirm(
      `Er du sikker på, at du vil slette "${item.name}" (${item.assetTag})?`
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      setError(null);
      await onDelete(item.id);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Kunne ikke slette genstanden.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-[576px] max-h-[90vh] overflow-y-auto bg-[#202021] border border-[#444444] rounded-xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5 text-white font-['Stack_Sans_Text',sans-serif]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#333333] pb-3">
          <h2 className="text-base sm:text-lg font-bold font-['Stack_Sans_Notch',sans-serif] tracking-wider uppercase text-white">
            {isEdit ? item.assetTag : "NY GENSTAND"}
          </h2>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Top thumbnail representation */}
          <div className="flex items-center gap-3">
            <div className="w-[50px] h-[50px] shrink-0 rounded-lg bg-[#444444] border border-[#555555] flex items-center justify-center text-[#d1d5db]">
              {hardwareType === "BORROWABLE_GEAR" ? (
                <Camera size={26} weight="regular" />
              ) : (
                <Wrench size={26} weight="regular" />
              )}
            </div>
            <div className="flex flex-col text-xs text-[#888888]">
              <span className="text-white font-bold text-sm">
                {name || (isEdit ? item.name : "Nyt udstyr")}
              </span>
              <span>
                {previewTag} • {trackingType === "BULK" ? "Puljevare (Bulk)" : hardwareType === "BORROWABLE_GEAR" ? "Udstyr" : "Maskine"}
              </span>
            </div>
          </div>

          {/* Tracking Type Toggle: SERIALIZED vs BULK */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#888888] font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
              Sporingstype (Individuel vs. Puljevare)
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#151517] border border-[#333333] rounded-lg">
              <button
                type="button"
                onClick={() => setTrackingType("SERIALIZED")}
                className={`py-2 px-3 rounded-md text-xs font-bold transition-all ${
                  trackingType === "SERIALIZED"
                    ? "bg-[#252527] text-white shadow-sm border border-[#555555]"
                    : "text-[#888888] hover:text-white"
                }`}
              >
                Individuelt udstyr (Unikt ID)
              </button>
              <button
                type="button"
                onClick={() => setTrackingType("BULK")}
                className={`py-2 px-3 rounded-md text-xs font-bold transition-all ${
                  trackingType === "BULK"
                    ? "bg-[#252527] text-[#FFED00] shadow-sm border border-[#FFED00]/40"
                    : "text-[#888888] hover:text-white"
                }`}
              >
                Puljevare (Batterier, kabler osv.)
              </button>
            </div>
            {trackingType === "BULK" && (
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Puljevarer spores via én delt stregkode for hele beholdningen (f.eks. på en skuffe eller kasse).
              </p>
            )}
          </div>

          {/* Create mode: Deterministic Asset Tag Banner (Figma 87:6420) */}
          {!isEdit && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#888888] font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
                ID - {trackingType === "BULK" ? "Delt Pulje Stregkode" : "Deterministic Asset Tag"}
              </label>
              <div className="bg-[#151517] border border-[#333333] rounded-lg p-3">
                <span className="text-[#1da9e4] font-mono font-bold text-sm block">
                  {previewTag}
                </span>
                <span className="text-[#888888] text-[11px] block mt-0.5">
                  Computeret via [LAB-PREFIX]-[KATEGORI]-[4-DIGIT-SEQUENCE]
                </span>
              </div>
            </div>
          )}

          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#888888] font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
              {isEdit ? "Navn" : "Udstyr / Maskin Navn"}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={trackingType === "BULK" ? "F.eks. Sony NP-FZ100 Batteri" : "F.eks. Sony FX30 Cinema Line Camera Kit"}
              className="bg-[#151517] border border-[#333333] rounded-lg px-3.5 py-2.5 text-sm text-[#d1d5db] focus:outline-none focus:border-[#1da9e4] transition-colors"
            />
          </div>

          {/* Quantity or Serial Number */}
          {trackingType === "BULK" ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#888888] font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
                Samlet beholdning (Antal i puljen)
              </label>
              <input
                type="number"
                min={1}
                required
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                placeholder="F.eks. 15"
                className="bg-[#151517] border border-[#333333] rounded-lg px-3.5 py-2.5 text-sm text-[#d1d5db] focus:outline-none focus:border-[#1da9e4] transition-colors font-mono"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#888888] font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
                  Serie nummer
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="456568567855785"
                  className="bg-[#151517] border border-[#333333] rounded-lg px-3.5 py-2.5 text-sm text-[#d1d5db] focus:outline-none focus:border-[#1da9e4] transition-colors font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#888888] font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
                  Indkøbsdato
                </label>
                <input
                  type="text"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  placeholder="DD/MM/ÅÅÅÅ"
                  className="bg-[#151517] border border-[#333333] rounded-lg px-3.5 py-2.5 text-sm text-[#d1d5db] focus:outline-none focus:border-[#1da9e4] transition-colors"
                />
              </div>
            </div>
          )}

          {/* Bundle Accessories Section for Serialized Gear */}
          {trackingType === "SERIALIZED" && hardwareType === "BORROWABLE_GEAR" && (
            <div className="flex flex-col gap-2 p-3 bg-[#151517] border border-[#333333] rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#888888] font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
                  Pakkesæt / Standard tilbehør ({bundleItems.length})
                </span>
                <span className="text-[11px] text-[#009FE3] font-medium">
                  Foreslås automatisk i POS
                </span>
              </div>

              {/* List of current bundle items */}
              {bundleItems.length > 0 && (
                <div className="flex flex-col gap-1.5 mb-1">
                  {bundleItems.map((b, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-[#202021] border border-[#444444] rounded text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#FFED00] font-bold font-mono">
                          {b.defaultQuantity}x
                        </span>
                        <span className="text-white font-medium">
                          {b.name || b.assetTag || "Tilbehør"}
                        </span>
                        {b.assetTag && (
                          <span className="text-[10px] text-zinc-400 font-mono">
                            ({b.assetTag})
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setBundleItems((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-zinc-400 hover:text-[#E6007E] p-1 transition-colors"
                        title="Fjern tilbehør fra sæt"
                      >
                        <X size={14} weight="bold" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add accessory selector */}
              {availableBulkItems.length > 0 ? (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedAccessoryId}
                    onChange={(e) => setSelectedAccessoryId(e.target.value)}
                    className="flex-1 bg-[#202021] border border-[#444444] rounded px-2.5 py-1.5 text-xs text-[#d1d5db] focus:outline-none focus:border-[#1da9e4]"
                  >
                    <option value="">Vælg tilbehør (puljevare)...</option>
                    {availableBulkItems
                      .filter((acc) => acc.id !== item?.id && !bundleItems.some((b) => b.accessoryInventoryId === acc.id))
                      .map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name} ({acc.assetTag})
                        </option>
                      ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={accessoryQty}
                    onChange={(e) => setAccessoryQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-16 bg-[#202021] border border-[#444444] rounded px-2 py-1.5 text-xs text-white text-center font-mono"
                    title="Standard antal"
                  />
                  <button
                    type="button"
                    disabled={!selectedAccessoryId}
                    onClick={() => {
                      const acc = availableBulkItems.find((a) => a.id === selectedAccessoryId);
                      if (acc) {
                        setBundleItems((prev) => [
                          ...prev,
                          {
                            accessoryInventoryId: acc.id,
                            defaultQuantity: accessoryQty,
                            name: acc.name,
                            assetTag: acc.assetTag,
                          },
                        ]);
                        setSelectedAccessoryId("");
                        setAccessoryQty(1);
                      }
                    }}
                    className="px-3 py-1.5 bg-[#009FE3] hover:bg-[#0082b8] text-white rounded text-xs font-bold transition-colors disabled:opacity-40"
                  >
                    Tilknyt
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-zinc-500 italic">
                  Opret puljevarer (f.eks. batterier eller kabler) for at tilknytte dem som standardudstyr.
                </p>
              )}
            </div>
          )}

          {/* Lab & Type / Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#888888] font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
                Lab
              </label>
              <select
                value={labSlug}
                onChange={(e) => setLabSlug(e.target.value)}
                className="bg-[#151517] border border-[#333333] rounded-lg px-3.5 py-2.5 text-sm text-[#d1d5db] focus:outline-none focus:border-[#1da9e4] focus:ring-1 focus:ring-[#1da9e4] transition-colors cursor-pointer"
              >
                <optgroup label="Køge Campus" className="bg-[#151517] text-zinc-400 font-semibold font-['Stack_Sans_Headline',sans-serif]">
                  {labs.map((l) => (
                    <option key={l.id} value={l.slug} className="text-white bg-[#151517]">
                      {l.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {isEdit ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#888888] font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
                  Status
                </label>
                <select
                  value={operationalStatus}
                  onChange={(e) => setOperationalStatus(e.target.value as OperationalStatus)}
                  className="bg-[#151517] border border-[#333333] rounded-lg px-3.5 py-2.5 text-sm text-[#d1d5db] focus:outline-none focus:border-[#1da9e4] transition-colors cursor-pointer"
                >
                  <option value="AVAILABLE">Ledig (Tilgængelig)</option>
                  <option value="MAINTENANCE">Vedligeholdelse</option>
                  <option value="BROKEN">Defekt / Udfaset</option>
                </select>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#888888] font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
                  Type
                </label>
                <select
                  value={hardwareType}
                  onChange={(e) => setHardwareType(e.target.value as HardwareType)}
                  className="bg-[#151517] border border-[#333333] rounded-lg px-3.5 py-2.5 text-sm text-[#d1d5db] focus:outline-none focus:border-[#1da9e4] transition-colors cursor-pointer"
                >
                  <option value="BORROWABLE_GEAR">Udstyr (Udlån)</option>
                  <option value="STATIONARY_MACHINE">Maskine (Stationær)</option>
                </select>
              </div>
            )}
          </div>

          {/* Manuals Section (Figma node 87:5806 & 87:6481) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#888888] font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
                Manualer ({attachedManuals.length})
              </span>
              <button
                type="button"
                onClick={onOpenManualsPicker}
                className="text-xs font-bold text-[#1da9e4] hover:text-[#52c1ee] flex items-center gap-1 transition-colors"
              >
                <span>Tilføj Manualer</span>
                <Plus size={12} weight="bold" />
              </button>
            </div>

            {attachedManuals.length > 0 ? (
              <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                {attachedManuals.map((man) => (
                  <div
                    key={man.id}
                    className="flex items-center justify-between p-2.5 bg-[#151517] border border-[#333333] rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 mr-2">
                      <FileText size={16} className="text-[#1da9e4] shrink-0" />
                      <span className="text-[#d1d5db] font-medium truncate">{man.title}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {man.fileUrl && (
                        <a
                          href={man.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 bg-[#1da9e4] hover:bg-[#1895ca] text-white rounded text-[11px] font-bold transition-colors"
                        >
                          <span>Se</span>
                          <ArrowSquareOut size={12} weight="bold" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onRemoveManual(man.id)}
                        className="p-1 text-[#888888] hover:text-[#e51d87] transition-colors"
                        title="Fjern manual"
                      >
                        <X size={14} weight="bold" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-[#151517] border border-[#333333] rounded-lg text-center text-xs text-[#666666]">
                Ingen manualer tilknyttet endnu.
              </div>
            )}
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#888888] font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
              Beskrivelse
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Beskriv udstyret, specifikationer, eller tilbehør..."
              className="bg-[#151517] border border-[#333333] rounded-lg px-3.5 py-2 text-sm text-[#d1d5db] focus:outline-none focus:border-[#1da9e4] transition-colors resize-none"
            />
          </div>

          {/* Footer Actions matching Figma node 87:5059 */}
          <div className="flex items-center justify-between pt-4 border-t border-[#333333] mt-2">
            {isEdit && onDelete ? (
              <button
                type="button"
                disabled={isDeleting || isSubmitting}
                onClick={handleDelete}
                className="flex items-center gap-1.5 bg-[#e51d87] hover:bg-[#c91874] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isDeleting ? <Spinner size={14} className="animate-spin" /> : <Trash size={14} />}
                <span>Slet</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || isDeleting}
                className="bg-[#151517] hover:bg-[#202021] border border-[#333333] text-[#888888] hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
              >
                Afbryd
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isDeleting}
                className="flex items-center gap-1.5 bg-[#1da9e4] hover:bg-[#1895ca] text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting && <Spinner size={14} className="animate-spin" />}
                <span>{isEdit ? "Gem" : "Opret"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
