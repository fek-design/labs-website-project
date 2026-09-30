"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getInventoryWithFilters,
  getLabsList,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  assignBundleItem,
  removeBundleItem,
} from "@/app/actions/inventory";
import {
  assignManualToMachine,
  unassignManualFromMachine,
} from "@/app/actions/manuals";
import { getAuthSession } from "@/app/actions/auth";
import { AnimatedCounter } from "@/components/pos/AnimatedCounter";
import { OperationalStatus } from "@prisma/client";
import { InventoryToolbar } from "./InventoryToolbar";
import { InventoryFilterBar } from "./InventoryFilterBar";
import { InventoryListView } from "./InventoryListView";
import { InventoryGridView } from "./InventoryGridView";
import { InventoryItemModal } from "./InventoryItemModal";
import { InventoryManualsDrawer } from "./InventoryManualsDrawer";

interface InventoryManagerProps {
  activeLab?: "medialab" | "makerspace" | string;
  onSelectLab?: (lab: "medialab" | "makerspace") => void;
}

export function InventoryManager({ activeLab, onSelectLab }: InventoryManagerProps = {}) {
  const [items, setItems] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminName, setAdminName] = useState<string>("Admin");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLab, setSelectedLab] = useState<string>(activeLab || "ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // View Mode: List or Grid (with localStorage persistence)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isManualsDrawerOpen, setIsManualsDrawerOpen] = useState(false);
  const [attachedManuals, setAttachedManuals] = useState<any[]>([]);

  // Fetch admin session username for greeting
  useEffect(() => {
    getAuthSession().then((session) => {
      if (session?.user?.username) {
        const raw = session.user.username;
        const formatted = raw.charAt(0).toUpperCase() + raw.slice(1);
        setAdminName(formatted);
      }
    }).catch(() => {
      // Fallback to "Admin"
    });
  }, []);

  // Sync selectedLab if activeLab prop changes from outside (e.g. sidebar)
  useEffect(() => {
    if (activeLab) {
      setSelectedLab(activeLab);
    }
  }, [activeLab]);

  // Load viewMode preference from localStorage on mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("zealand_inventory_view_mode");
      if (savedMode === "list" || savedMode === "grid") {
        setViewMode(savedMode);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleViewModeChange = (mode: "list" | "grid") => {
    setViewMode(mode);
    try {
      localStorage.setItem("zealand_inventory_view_mode", mode);
    } catch {
      // Ignore localStorage errors
    }
  };

  // Fetch Inventory & Labs
  const fetchInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      const [resItems, resLabs] = await Promise.all([
        getInventoryWithFilters({
          labSlug: selectedLab !== "ALL" ? selectedLab : undefined,
          hardwareType: selectedType !== "ALL" ? (selectedType as any) : undefined,
          operationalStatus: selectedStatus !== "ALL" ? (selectedStatus as any) : undefined,
          searchQuery,
        }),
        getLabsList(),
      ]);

      setItems(resItems || []);
      setLabs(resLabs || []);
    } catch (err) {
      console.error("Failed to load inventory:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedLab, selectedType, selectedStatus, searchQuery]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Open Create Item Modal
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setAttachedManuals([]);
    setIsItemModalOpen(true);
  };

  // Open Edit Item Modal
  const handleOpenEditModal = (item: any) => {
    setEditingItem(item);
    const existingManuals = item.manuals?.map((m: any) => m.manual).filter(Boolean) || [];
    setAttachedManuals(existingManuals);
    setIsItemModalOpen(true);
  };

  // Save Item (Create or Update)
  const handleSaveItem = async (formData: any) => {
    if (formData.id) {
      // Update existing item
      await updateInventoryItem({
        id: formData.id,
        name: formData.name,
        labSlug: formData.labSlug,
        trackingType: formData.trackingType,
        totalQuantity: formData.totalQuantity,
        operationalStatus: formData.operationalStatus,
        notes: formData.notes,
        purchaseDate: formData.purchaseDate,
        location: formData.location,
        customFields: formData.customFields,
      });

      // Synchronize bundle accessories if configured
      if (formData.bundleItems) {
        const currentBundleAccessories = editingItem?.bundleAccessories || [];
        const newAccessoryIds = formData.bundleItems.map((b: any) => b.accessoryInventoryId);

        // Remove unlinked
        for (const oldB of currentBundleAccessories) {
          const accId = oldB.accessoryInventoryId || oldB.accessory?.id;
          if (accId && !newAccessoryIds.includes(accId)) {
            await removeBundleItem({ parentInventoryId: formData.id, accessoryInventoryId: accId });
          }
        }

        // Add or update linked
        for (const newB of formData.bundleItems) {
          await assignBundleItem({
            parentInventoryId: formData.id,
            accessoryInventoryId: newB.accessoryInventoryId,
            defaultQuantity: newB.defaultQuantity,
          });
        }
      }

      // Synchronize manuals
      const currentManualIds = editingItem?.manuals?.map((m: any) => m.manualId) || [];
      const newManualIds = attachedManuals.map((m) => m.id);

      // Manuals to assign
      const toAssign = newManualIds.filter((id) => !currentManualIds.includes(id));
      for (const manualId of toAssign) {
        await assignManualToMachine({ inventoryId: formData.id, manualId });
      }

      // Manuals to unassign
      const toUnassign = currentManualIds.filter((id: string) => !newManualIds.includes(id));
      for (const manualId of toUnassign) {
        await unassignManualFromMachine({ inventoryId: formData.id, manualId });
      }
    } else {
      // Create new item
      const res = await createInventoryItem({
        name: formData.name,
        labSlug: formData.labSlug,
        hardwareType: formData.hardwareType,
        trackingType: formData.trackingType,
        totalQuantity: formData.totalQuantity,
        operationalStatus: formData.operationalStatus,
        notes: formData.notes,
        purchaseDate: formData.purchaseDate,
        location: formData.location,
        customFields: formData.customFields,
        bundleItems: formData.bundleItems,
      });

      if (res.item && attachedManuals.length > 0) {
        for (const manual of attachedManuals) {
          await assignManualToMachine({ inventoryId: res.item.id, manualId: manual.id });
        }
      }
    }

    await fetchInventory();
  };

  // Delete Item
  const handleDeleteItem = async (itemId: string) => {
    await deleteInventoryItem(itemId);
    await fetchInventory();
  };

  // Manuals Drawer Actions
  const handleToggleManual = (manual: any) => {
    setAttachedManuals((prev) => {
      const exists = prev.some((m) => m.id === manual.id);
      if (exists) {
        return prev.filter((m) => m.id !== manual.id);
      } else {
        return [...prev, manual];
      }
    });
  };

  const handleRemoveAttachedManual = (manualId: string) => {
    setAttachedManuals((prev) => prev.filter((m) => m.id !== manualId));
  };

  // Canonical KPI metric calculations
  const totalCount = items.length;
  const availableCount = items.filter(
    (i) => i.operationalStatus === "AVAILABLE" && (!i.loans || i.loans.length === 0)
  ).length;
  const inUseCount = items.filter((i) => i.loans && i.loans.length > 0).length;

  const handleLabChange = (slug: string) => {
    setSelectedLab(slug);
    if (onSelectLab && (slug === "medialab" || slug === "makerspace")) {
      onSelectLab(slug);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1512px] mx-auto p-4 sm:p-6 lg:p-8 bg-[#0e0d0f] min-h-screen text-white font-text">
      {/* 1. Top Header & KPI Metric Ribbon (Canonical POS Architecture) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black font-notch tracking-tight flex items-baseline gap-1.5">
            <span className="text-white">LABS</span>
            <span className="text-[#1da9e4]">Inventar</span>
          </h1>
          <p className="text-sm font-headline font-bold text-zinc-400 mt-1">
            Velkommen, {adminName}
          </p>
        </div>

        {/* 3 Top KPI Metric Counters */}
        <div className="flex flex-wrap items-center gap-8 sm:gap-12">
          {/* 1. Ledigt udstyr */}
          <div className="flex items-baseline gap-3">
            <AnimatedCounter
              value={availableCount}
              className="text-5xl sm:text-6xl font-bold font-notch text-white leading-none"
            />
            <span className="text-sm text-zinc-400 font-headline font-normal leading-tight">
              Ledigt<br />udstyr
            </span>
          </div>

          {/* 2. I brug / Udlånt */}
          <div className="flex items-baseline gap-3">
            <AnimatedCounter
              value={inUseCount}
              className="text-5xl sm:text-6xl font-bold font-notch text-[#E6007E] leading-none"
            />
            <span className="text-sm text-zinc-400 font-headline font-normal leading-tight">
              I brug<br />Udlånt
            </span>
          </div>

          {/* 3. Total inventar */}
          <div className="flex items-baseline gap-3">
            <span className="text-5xl sm:text-6xl font-bold font-notch text-white leading-none">
              <AnimatedCounter value={totalCount} />
            </span>
            <span className="text-sm text-zinc-400 font-headline font-normal leading-tight">
              Total<br />inventar
            </span>
          </div>
        </div>
      </div>

      {/* Main card wrapper matching Figma frame 84:3583 / 86:4522 */}
      <div className="flex flex-col gap-5 p-4 sm:p-6 bg-[#151517] border border-[#333333] rounded-2xl shadow-xl">
        {/* Search Toolbar with List/Grid toggle and Tilføj button */}
        <InventoryToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onOpenCreateModal={handleOpenCreateModal}
        />

        {/* Filter Strip with item count and inline LAB, TYPE, STATUS dropdowns */}
        <InventoryFilterBar
          totalCount={items.length}
          labs={labs}
          selectedLab={selectedLab}
          onLabChange={handleLabChange}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        {/* Inventory Views */}
        {viewMode === "list" ? (
          <InventoryListView
            items={items}
            isLoading={isLoading}
            onEditItem={handleOpenEditModal}
          />
        ) : (
          <InventoryGridView
            items={items}
            isLoading={isLoading}
            onEditItem={handleOpenEditModal}
          />
        )}
      </div>

      {/* Item Modal (Create or Edit) with paired dual-pane Manuals Library Drawer */}
      <InventoryItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setIsManualsDrawerOpen(false);
        }}
        item={editingItem}
        labs={labs}
        availableBulkItems={items.filter((i) => i.trackingType === "BULK")}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        onOpenManualsPicker={() => setIsManualsDrawerOpen(true)}
        isManualsPickerOpen={isManualsDrawerOpen}
        onCloseManualsPicker={() => setIsManualsDrawerOpen(false)}
        onToggleManual={handleToggleManual}
        selectedManualIds={attachedManuals.map((m) => m.id)}
        attachedManuals={attachedManuals}
        onRemoveManual={handleRemoveAttachedManual}
      />

      {/* Standalone Manuals Library Drawer (only rendered if item modal is NOT open) */}
      {!isItemModalOpen && (
        <InventoryManualsDrawer
          isOpen={isManualsDrawerOpen}
          onClose={() => setIsManualsDrawerOpen(false)}
          selectedManualIds={attachedManuals.map((m) => m.id)}
          onToggleManual={handleToggleManual}
        />
      )}
    </div>
  );
}
