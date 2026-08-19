"use client";

import React, { useState } from "react";
import { EquipmentPOS } from "@/components/pos/EquipmentPOS";
import { InventoryManager } from "@/components/inventory/InventoryManager";
import { MakerspaceMachineHub } from "@/components/makerspace/MakerspaceMachineHub";
import { AuditHistoryView } from "@/components/history/AuditHistoryView";
import { AdminSettingsView } from "@/components/settings/AdminSettingsView";
import { AuthGate } from "@/components/auth/AuthGate";
import { logoutAdmin } from "@/app/actions/auth";
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
  const [mainNav, setMainNav] = useState<
    "FRONT_DESK" | "INVENTORY" | "MAKERSPACE" | "HISTORY" | "SETTINGS"
  >("FRONT_DESK");

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.reload();
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-[#000000] text-white flex flex-col font-mono selection:bg-[#E6007E]/30 selection:text-white">
        {/* Admin Top Navigation */}
        <header className="border-b border-[#262626] bg-[#0D0D0D]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-white hover:text-[#FFED00] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#FFED00] flex items-center justify-center text-black font-extrabold text-xs">
                  ZL
                </div>
                <span className="font-extrabold tracking-tight text-base">
                  ZEALAND LABS
                </span>
              </Link>
              <span className="text-zinc-600">/</span>
              <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">
                Operational OS
              </span>
            </div>

            {/* Master Navigation Bar Tabs */}
            <div className="flex items-center gap-1.5 bg-[#141414] border border-[#262626] p-1 rounded-full text-xs overflow-x-auto max-w-full">
              {(
                [
                  { id: "FRONT_DESK", label: "Front Desk & Calendar" },
                  { id: "INVENTORY", label: "Inventory & Catalog" },
                  { id: "MAKERSPACE", label: "Makerspace Machines" },
                  { id: "HISTORY", label: "Audit Logs" },
                  { id: "SETTINGS", label: "Settings" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMainNav(tab.id)}
                  className={`px-4 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                    mainNav === tab.id
                      ? tab.id === "MAKERSPACE"
                        ? "bg-[#FFED00] text-black shadow-lg shadow-[#FFED00]/20"
                        : tab.id === "INVENTORY"
                        ? "bg-[#009FE3] text-black shadow-lg shadow-[#009FE3]/20"
                        : tab.id === "HISTORY"
                        ? "bg-[#E6007E] text-white shadow-lg shadow-[#E6007E]/20"
                        : "bg-white text-black shadow-lg shadow-white/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Logout Action & Node Status */}
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141414] border border-[#262626] text-xs text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Local Node Active</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-full bg-[#141414] hover:bg-[#262626] border border-[#262626] hover:border-zinc-500 text-xs text-zinc-400 hover:text-white transition-colors font-bold"
                title="Logout from Admin Console"
              >
                Logout ✕
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-8">
          {/* Dynamic Views */}
          {mainNav === "FRONT_DESK" && (
            <EquipmentPOS labSlug="medialab" initialStats={initialStats} />
          )}

          {mainNav === "INVENTORY" && <InventoryManager />}

          {mainNav === "MAKERSPACE" && <MakerspaceMachineHub />}

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
