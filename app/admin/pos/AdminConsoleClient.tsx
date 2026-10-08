"use client";

import React, { useState, useEffect } from "react";
import { EquipmentPOS } from "@/components/pos/EquipmentPOS";
import { InventoryManager } from "@/components/inventory/InventoryManager";
import { AuditHistoryView } from "@/components/history/AuditHistoryView";
import { AdminSettingsView } from "@/components/settings/AdminSettingsView";
import { ManualsManager } from "@/components/manuals/ManualsManager";
import { CatalogueAdminManager } from "@/components/catalogue/CatalogueAdminManager";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import { AuthGate } from "@/components/auth/AuthGate";
import { logoutAdmin } from "@/app/actions/auth";
import { getAdminProfile } from "@/app/actions/settings";
import { AdminNavTabId } from "@/lib/admin-nav";

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
  const [activeLab, setActiveLab] = useState<"medialab" | "makerspace">("medialab");

  // Hydrate workspace session from the administrator's assigned location/lab
  useEffect(() => {
    getAdminProfile()
      .then((profile) => {
        if (profile?.assignedLabSlug === "medialab" || profile?.assignedLabSlug === "makerspace") {
          setActiveLab(profile.assignedLabSlug);
        }
      })
      .catch(() => {
        // Fallback to default medialab
      });
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.reload();
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-[#000000] text-white flex flex-col font-mono selection:bg-[#E6007E]/30 selection:text-white pl-20">
        {/* Backdrop Scrim when Sidebar is Expanded as an Overlay */}
        {isExpanded && (
          <div
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40 cursor-pointer transition-opacity duration-300"
            aria-label="Luk sidepanel"
          />
        )}

        {/* Docked Left-Hand Navigation with Expandable Overlay Drawer */}
        <AdminSidebarNav
          activeTab={mainNav}
          onSelectTab={setMainNav}
          onLogout={handleLogout}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded((prev) => !prev)}
          activeLab={activeLab}
          onSelectLab={setActiveLab}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6 sm:py-8 space-y-8">
          {/* Dynamic Views */}
          {mainNav === "FRONT_DESK" && (
            <EquipmentPOS labSlug={activeLab} initialStats={initialStats} />
          )}

          {mainNav === "INVENTORY" && (
            <InventoryManager
              activeLab={activeLab}
              onSelectLab={(lab) => {
                if (lab === "medialab" || lab === "makerspace") setActiveLab(lab);
              }}
            />
          )}

          {mainNav === "CATALOGUE" && (
            <CatalogueAdminManager
              activeLab={activeLab}
              onSelectLab={setActiveLab}
            />
          )}

          {mainNav === "MANUALS" && (
            <ManualsManager
              activeLab={activeLab}
              onSelectLab={setActiveLab}
            />
          )}

          {mainNav === "HISTORY" && <AuditHistoryView />}

          {mainNav === "SETTINGS" && (
            <AdminSettingsView
              activeLab={activeLab}
              onSelectLab={setActiveLab}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#262626] bg-[#0D0D0D] py-6 px-6 text-center text-xs text-zinc-600">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Zealand Labs Infrastructure • Zero Cloud Dependency Protocol</span>
            <span className="text-zinc-500">Køge Campus • Open Spec Visual Contract</span>
          </div>
        </footer>
      </div>
    </AuthGate>
  );
}

