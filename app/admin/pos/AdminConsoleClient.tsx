"use client";

import React, { useState } from "react";
import { EquipmentPOS } from "@/components/pos/EquipmentPOS";
import { InventoryManager } from "@/components/inventory/InventoryManager";
import { MakerspaceMachineHub } from "@/components/makerspace/MakerspaceMachineHub";
import { AuditHistoryView } from "@/components/history/AuditHistoryView";
import { AdminSettingsView } from "@/components/settings/AdminSettingsView";
import { CraftItemsManager } from "@/components/admin/CraftItemsManager";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { AuthGate } from "@/components/auth/AuthGate";
import { logoutAdmin } from "@/app/actions/auth";
import { ADMIN_NAV_ITEMS, AdminNavTabId } from "@/lib/admin-nav";
import Link from "next/link";

interface AdminConsoleClientProps {
  initialStats: {
    activeLoansCount: number;
    overdueLoansCount: number;
    availableGearCount: number;
    totalGearCount: number;
  };
}

export function AdminConsoleClient({ initialStats }: AdminConsoleClientProps) {
  const [mainNav, setMainNav] = useState<AdminNavTabId>("FRONT_DESK");
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeLab, setActiveLab] = useState<"medialab" | "makerspace" | "dimselab">("medialab");

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.reload();
  };

  const currentNav = ADMIN_NAV_ITEMS.find((item) => item.id === mainNav);

  const labPillOptions = [
    { slug: "medialab" as const, label: "Medialab", color: "#009FE3" },
    { slug: "makerspace" as const, label: "Makerspace", color: "#FFED00" },
    { slug: "dimselab" as const, label: "Dimselab", color: "#E6007E" },
  ];

  return (
    <AuthGate>
      <div
        className={`min-h-screen bg-[#000000] text-white flex flex-col font-mono selection:bg-[#E6007E]/30 selection:text-white transition-[padding] duration-300 ease-in-out ${
          isExpanded ? "pl-64" : "pl-20"
        }`}
      >
        {/* Docked Left-Hand Navigation with Expandable Drawer & Clickable Labs */}
        <AdminSidebarNav
          activeTab={mainNav}
          onSelectTab={setMainNav}
          onLogout={handleLogout}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded((prev) => !prev)}
          activeLab={activeLab}
          onSelectLab={setActiveLab}
        />

        {/* Streamlined Admin Top Context Header with Clickable Labs */}
        <header className="border-b border-[#262626] bg-[#0D0D0D]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="font-extrabold tracking-tight text-base hover:text-[#FFED00] transition-colors"
              >
                ZEALAND LABS
              </Link>
              <span className="text-zinc-600">/</span>
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentNav?.accentColor || "#009FE3" }}
                />
                <span className="text-xs uppercase tracking-widest font-bold text-white">
                  {currentNav?.label || "Console"}
                </span>
              </div>
            </div>

            {/* Clickable Labs Switcher Bar */}
            <div className="flex items-center gap-1.5 bg-[#141416] p-1 rounded-full border border-zinc-800 text-xs">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold px-2 hidden sm:inline">
                Aktivt Lab:
              </span>
              {labPillOptions.map((lab) => {
                const isSelected = activeLab === lab.slug;
                return (
                  <button
                    key={lab.slug}
                    type="button"
                    onClick={() => setActiveLab(lab.slug)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-zinc-800 text-white shadow-md border border-zinc-700"
                        : "text-zinc-400 hover:text-white border border-transparent"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: lab.color }}
                    />
                    <span>{lab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Public Portal Quick Jump */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-3.5 py-1.5 bg-[#141416] hover:bg-[#262626] border border-[#262626] text-xs text-zinc-300 font-bold rounded-full transition-colors flex items-center gap-1"
              >
                <span>← Portalen</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
          {/* Dynamic Views */}
          {mainNav === "FRONT_DESK" && (
            <EquipmentPOS labSlug={activeLab} initialStats={initialStats} />
          )}

          {mainNav === "INVENTORY" && <InventoryManager />}

          {mainNav === "MAKERSPACE" && <MakerspaceMachineHub />}

          {mainNav === "CRAFTS" && <CraftItemsManager />}

          {mainNav === "HISTORY" && <AuditHistoryView />}

          {mainNav === "SETTINGS" && <AdminSettingsView />}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#262626] bg-[#0D0D0D] py-6 px-6 text-center text-xs text-zinc-600">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Zealand Labs Infrastructure • Zero Cloud Dependency Protocol</span>
            <span className="text-zinc-500">Roskilde & Køge Campuses • Open Spec Visual Contract</span>
          </div>
        </footer>
      </div>
    </AuthGate>
  );
}

