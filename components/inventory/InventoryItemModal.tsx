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
import { HardwareType, OperationalStatus } from "@prisma/client";
import { generateAssetTag } from "@/app/actions/inventory";

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any | null; // null for Create, item object for Edit
  labs: Array<{ id: string; name: string; slug: string }>;
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
  const [operationalStatus, setOperationalStatus] = useState<OperationalStatus>("AVAILABLE");
  const [serialNumber, setSerialNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [notes, setNotes] = useState("");
  const [previewTag, setPreviewTag] = useState("MK-GEN-0001");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize or reset form state
  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setLabSlug(item.lab?.slug || "makerspace");
      setHardwareType(item.hardwareType || "BORROWABLE_GEAR");
      setOperationalStatus(item.operationalStatus || "AVAILABLE");
      setNotes(item.notes || "");
      setSerialNumber(item.customFields?.serialNumber || "");
      setPurchaseDate(item.customFields?.purchaseDate || "");
      setPreviewTag(item.assetTag || "");
    } else {
      setName("");
      setLabSlug(labs[0]?.slug || "makerspace");
      setHardwareType("BORROWABLE_GEAR");
      setOperationalStatus("AVAILABLE");
      setSerialNumber("");
      setPurchaseDate("");
      setNotes("");
    }
    setError(null);
  }, [item, labs, isOpen]);

  // Compute live deterministic tag preview for Create mode
  useEffect(() => {
    if (!isEdit && isOpen) {
      let isMounted = true;
      generateAssetTag({ labSlug })
        .then((tag) => {
          if (isMounted) setPreviewTag(tag);
        })
        .catch((err) => console.error("Failed to generate tag preview", err));
      return () => {
        isMounted = false;
      };
    }
  }, [labSlug, isEdit, isOpen]);

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
        operationalStatus,
        notes: notes.trim(),
        customFields: {
          serialNumber: serialNumber.trim(),
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
                {previewTag} • {hardwareType === "BORROWABLE_GEAR" ? "Udstyr" : "Maskine"}
              </span>
            </div>
          </div>

          {/* Create mode: Deterministic Asset Tag Banner (Figma 87:6420) */}
          {!isEdit && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#888888] font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif]">
                ID - Deterministic Asset Tag
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
              placeholder="F.eks. Sony FX30 Cinema Line Camera Kit"
              className="bg-[#151517] border border-[#333333] rounded-lg px-3.5 py-2.5 text-sm text-[#d1d5db] focus:outline-none focus:border-[#1da9e4] transition-colors"
            />
          </div>

          {/* Serial Number & Purchase Date */}
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
