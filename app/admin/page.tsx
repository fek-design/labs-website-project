import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  let gearCount = 0;
  let machineCount = 0;
  let loanCount = 0;

  try {
    const [dbGearCount, dbMachineCount, dbLoanCount] = await Promise.all([
      prisma.inventory.count({ where: { hardwareType: "BORROWABLE_GEAR" } }),
      prisma.inventory.count({ where: { hardwareType: "STATIC_MACHINE" } }),
      prisma.loan.count({ where: { status: "ACTIVE" } }),
    ]);
    gearCount = dbGearCount;
    machineCount = dbMachineCount;
    loanCount = dbLoanCount;
  } catch (error) {
    console.warn("Database connection unavailable, using fallback counts in /admin:", error);
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between font-mono selection:bg-[#E6007E]/30 selection:text-white">
      {/* Navigation */}
      <header className="border-b border-[#262626] bg-[#0D0D0D]/80 backdrop-blur-md px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href="/" className="w-8 h-8 rounded-full bg-[#FFED00] flex items-center justify-center text-black font-extrabold text-xs flex-shrink-0">
              ZL
            </Link>
            <span className="font-extrabold tracking-tight text-sm sm:text-base">
              ZEALAND LABS <span className="text-[10px] sm:text-xs text-[#009FE3] ml-1 sm:ml-2">ADMIN CONSOLE</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/"
              className="flex-1 sm:flex-initial text-center px-3.5 sm:px-4 py-2 bg-[#141416] hover:bg-[#262626] text-zinc-300 text-xs font-bold rounded-full transition-all border border-[#262626] min-h-[36px] flex items-center justify-center"
            >
              ← Public Portal
            </Link>
            <Link
              href="/admin/pos"
              className="flex-1 sm:flex-initial text-center px-4 sm:px-5 py-2 bg-[#FFED00] hover:bg-[#ffe600] text-black text-xs font-bold rounded-full transition-all shadow-lg shadow-[#FFED00]/10 min-h-[36px] flex items-center justify-center"
            >
              Launch POS Desk ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full space-y-8 sm:space-y-12">
        <div className="space-y-3 sm:space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#262626] text-xs font-bold text-[#009FE3]">
            <span className="w-2 h-2 rounded-full bg-[#009FE3] animate-pulse" />
            <span className="text-[11px] sm:text-xs">Staff Administered • Zero-Cloud Local Infrastructure</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight uppercase leading-none">
            Makerspace & Medialab OS
          </h1>
          <p className="text-xs sm:text-base text-zinc-400 max-w-xl leading-relaxed">
            Offline-first barcode scanning, equipment loan calendar schedule, physical location tracking, and machine manuals repository.
          </p>
        </div>

        {/* Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Medialab Checkout & Calendar */}
          <div className="bg-[#141414] border border-[#262626] hover:border-[#009FE3] rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-bold text-[#009FE3]">RENTALS & CALENDAR</span>
                <span>{loanCount} Active Loans</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-3 group-hover:text-[#009FE3] transition-colors">
                Medialab Front Desk
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                1-month default loan durations, barcode scanner, and interactive schedule calendar on the front desk.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#262626]">
              <Link
                href="/admin/pos"
                className="text-xs font-bold text-[#FFED00] hover:underline"
              >
                Open POS & Calendar Desk →
              </Link>
            </div>
          </div>

          {/* Makerspace Machine Hub */}
          <div className="bg-[#141414] border border-[#262626] hover:border-[#FFED00] rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-bold text-[#FFED00]">STATIC MACHINES</span>
                <span>{machineCount} Workstations</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-3 group-hover:text-[#FFED00] transition-colors">
                Makerspace Manuals
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                3D printers, laser cutters, official user manuals, safety checklists, and maintenance logs (non-rental).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#262626]">
              <Link
                href="/admin/pos"
                className="text-xs font-bold text-[#FFED00] hover:underline"
              >
                Open Machine Hub →
              </Link>
            </div>
          </div>

          {/* Inventory & Physical Locations */}
          <div className="bg-[#141414] border border-[#262626] hover:border-emerald-500 rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all shadow-xl flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-bold text-emerald-400">PHYSICAL LOCATIONS</span>
                <span>{gearCount + machineCount} Items</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-3 group-hover:text-emerald-400 transition-colors">
                Inventory Tracking
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Physical room, shelf, and cabinet filters with streamlined item registration and tag editing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#262626]">
              <Link
                href="/admin/pos"
                className="text-xs font-bold text-emerald-400 hover:underline"
              >
                Manage Inventory & Locations →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#262626] bg-[#0D0D0D] py-6 px-6 text-center text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Zealand Labs Infrastructure • Zero Cloud Dependency Protocol</span>
          <span className="text-zinc-500">Roskilde Campus • Open Spec Visual Contract</span>
        </div>
      </footer>
    </div>
  );
}
