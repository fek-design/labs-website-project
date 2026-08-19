"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  searchPatronOrAsset,
  getPatronDetails,
  createOrUpdatePatron,
  getLabInventory,
  getActiveLoans,
  getOverdueLoans,
  getPosStats,
} from "@/app/actions/pos";
import { ScannerInput } from "./ScannerInput";
import { PatronCard } from "./PatronCard";
import { CheckoutCart } from "./CheckoutCart";
import { ActiveLoansTable } from "./ActiveLoansTable";
import { OverdueInspector } from "./OverdueInspector";
import { LoanCalendar } from "./LoanCalendar";
import { motion, AnimatePresence } from "motion/react";

interface EquipmentPOSProps {
  labSlug?: string;
  initialStats?: {
    activeLoansCount: number;
    overdueLoansCount: number;
    availableGearCount: number;
    totalGearCount: number;
  };
}

export function EquipmentPOS({ labSlug = "medialab", initialStats }: EquipmentPOSProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"FRONT_DESK" | "ACTIVE_LOANS" | "OVERDUE">("FRONT_DESK");

  // State
  const [activePatron, setActivePatron] = useState<any | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const [overdueLoans, setOverdueLoans] = useState<any[]>([]);
  const [availableGear, setAvailableGear] = useState<any[]>([]);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>("ALL");
  const [gearSearch, setGearSearch] = useState<string>("");

  const [stats, setStats] = useState(
    initialStats || {
      activeLoansCount: 0,
      overdueLoansCount: 0,
      availableGearCount: 0,
      totalGearCount: 0,
    }
  );

  // Search Results
  const [isSearching, setIsSearching] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // New Patron registration modal state
  const [showNewPatronPrompt, setShowNewPatronPrompt] = useState<string | null>(null);
  const [newPatronEmail, setNewPatronEmail] = useState("");

  const activePatronRef = React.useRef<any>(null);
  activePatronRef.current = activePatron;

  const refreshData = useCallback(async () => {
    try {
      const currentPatronId = activePatronRef.current?.id;
      const [statsRes, activeRes, overdueRes, gearRes, refreshedPatron] = await Promise.all([
        getPosStats(labSlug),
        getActiveLoans(labSlug),
        getOverdueLoans(labSlug),
        getLabInventory(labSlug),
        currentPatronId ? getPatronDetails(currentPatronId) : Promise.resolve(null),
      ]);

      setStats(statsRes);
      setActiveLoans(activeRes);
      setOverdueLoans(overdueRes);
      setAvailableGear(gearRes.filter((g: any) => g.loans.length === 0 && g.operationalStatus === "AVAILABLE"));

      if (currentPatronId && refreshedPatron) {
        setActivePatron(refreshedPatron);
      }
    } catch (err) {
      console.error("Error refreshing POS data", err);
    }
  }, [labSlug]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle Scan Heuristic & Auto-Association
  const handleScanMatch = async ({ query }: { type: "PATRON" | "ASSET"; query: string }) => {
    setIsSearching(true);
    setScanMessage(null);

    try {
      const res = await searchPatronOrAsset(query, labSlug);

      if (res.exactMatch) {
        if (res.exactMatch.type === "PATRON") {
          setActivePatron(res.exactMatch.data);
          setScanMessage(`Patron attached: ${res.exactMatch.data.studentId}`);
        } else if (res.exactMatch.type === "ASSET") {
          const item = res.exactMatch.data;
          if (cartItems.some((c) => c.id === item.id)) {
            setScanMessage(`Item ${item.assetTag} is already in cart.`);
          } else if (item.loans.length > 0) {
            setScanMessage(`Item ${item.assetTag} currently has an ACTIVE loan.`);
          } else if (item.operationalStatus !== "AVAILABLE") {
            setScanMessage(`Item ${item.assetTag} is in status ${item.operationalStatus}.`);
          } else {
            setCartItems((prev) => [...prev, item]);
            setScanMessage(`Added ${item.name} (${item.assetTag}) to cart.`);
          }
        }
      } else {
        if (res.patrons.length === 1) {
          setActivePatron(res.patrons[0]);
          setScanMessage(`Patron attached: ${res.patrons[0].studentId}`);
        } else if (res.assets.length === 1 && res.assets[0].loans.length === 0) {
          const item = res.assets[0];
          if (!cartItems.some((c) => c.id === item.id)) {
            setCartItems((prev) => [...prev, item]);
            setScanMessage(`Added ${item.name} to cart.`);
          }
        } else if (query.length >= 6 && !query.startsWith("ML-") && !query.startsWith("MS-")) {
          setShowNewPatronPrompt(query);
        } else {
          setScanMessage(`No matches found for "${query}".`);
        }
      }
    } catch (err) {
      console.error("Scan error", err);
    } finally {
      setIsSearching(false);
      setTimeout(() => setScanMessage(null), 3000);
    }
  };

  const handleRegisterPatron = async () => {
    if (!showNewPatronPrompt) return;
    try {
      const res = await createOrUpdatePatron({
        studentId: showNewPatronPrompt,
        email: newPatronEmail.trim() || undefined,
      });
      if (res.patron) {
        setActivePatron(res.patron);
        setShowNewPatronPrompt(null);
        setNewPatronEmail("");
        setScanMessage(`Created and attached patron ${res.patron.studentId}`);
      }
    } catch (err) {
      console.error("Failed to create patron", err);
    }
  };

  const handleClearPatron = () => {
    setActivePatron(null);
    setScanMessage("Patron detached.");
    setTimeout(() => setScanMessage(null), 2000);
  };

  // Filter available gear
  const filteredGear = availableGear.filter((item) => {
    const matchesTag =
      selectedTagFilter === "ALL" ||
      item.tags?.some((t: any) => t.tag?.slug === selectedTagFilter);
    const q = gearSearch.toLowerCase();
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.assetTag.toLowerCase().includes(q) ||
      item.lab?.name?.toLowerCase().includes(q);

    return matchesTag && matchesQuery;
  });

  return (
    <div className="w-full text-white font-mono space-y-6">
      {/* 1. Header & Live Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Active Loans */}
        <div
          onClick={() => setActiveTab("ACTIVE_LOANS")}
          className="bg-[#141414] border border-[#262626] hover:border-[#009FE3] p-5 rounded-3xl cursor-pointer transition-all shadow-xl group"
        >
          <div className="flex items-center justify-between text-xs text-zinc-500 uppercase tracking-wider">
            <span>Active Loans</span>
            <span className="w-2 h-2 rounded-full bg-[#009FE3] group-hover:animate-ping" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            {stats.activeLoansCount}
          </div>
          <div className="text-[11px] text-[#009FE3] mt-1">In 1-month circulation</div>
        </div>

        {/* Overdue */}
        <div
          onClick={() => setActiveTab("OVERDUE")}
          className={`bg-[#141414] border p-5 rounded-3xl cursor-pointer transition-all shadow-xl group ${
            stats.overdueLoansCount > 0
              ? "border-[#E6007E] bg-[#E6007E]/5"
              : "border-[#262626] hover:border-[#E6007E]"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-zinc-500 uppercase tracking-wider">
            <span>Overdue Returns</span>
            <span
              className={`w-2 h-2 rounded-full ${
                stats.overdueLoansCount > 0 ? "bg-[#E6007E] animate-ping" : "bg-zinc-600"
              }`}
            />
          </div>
          <div
            className={`text-3xl sm:text-4xl font-extrabold mt-2 ${
              stats.overdueLoansCount > 0 ? "text-[#E6007E]" : "text-zinc-400"
            }`}
          >
            {stats.overdueLoansCount}
          </div>
          <div className="text-[11px] text-[#E6007E] mt-1">Zero-cloud calculated</div>
        </div>

        {/* Calendar Overview */}
        <div
          onClick={() => setActiveTab("FRONT_DESK")}
          className="bg-[#141414] border border-[#262626] hover:border-[#FFED00] p-5 rounded-3xl cursor-pointer transition-all shadow-xl group"
        >
          <div className="flex items-center justify-between text-xs text-zinc-500 uppercase tracking-wider">
            <span>Calendar Schedule</span>
            <span className="w-2 h-2 rounded-full bg-[#FFED00]" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            {new Date().toLocaleDateString("en-DK", { day: "numeric", month: "short" })}
          </div>
          <div className="text-[11px] text-[#FFED00] mt-1">Live on Front Desk</div>
        </div>

        {/* Available Gear */}
        <div className="bg-[#141414] border border-[#262626] p-5 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between text-xs text-zinc-500 uppercase tracking-wider">
            <span>Available Gear</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            {stats.availableGearCount}
            <span className="text-sm text-zinc-500 font-normal ml-1">/ {stats.totalGearCount}</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Ready for 1-month checkout</div>
        </div>
      </div>

      {/* 2. Universal Barcode Scanner */}
      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs uppercase tracking-wider font-bold text-zinc-400">
            Zealand POS Laser Barcode & Student Badge Scanner
          </label>
          {scanMessage && (
            <span className="text-xs text-[#009FE3] font-bold animate-pulse">{scanMessage}</span>
          )}
        </div>
        <ScannerInput
          onScanMatch={handleScanMatch}
          isSearching={isSearching}
          placeholder="Scan Asset Barcode (e.g. ML-CAM-001) or Student ID (20240199)..."
        />
      </div>

      {/* 3. Sub-Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[#262626] pb-3 overflow-x-auto">
        {(
          [
            { id: "FRONT_DESK", label: "Front Desk (Checkout & Calendar Schedule)" },
            { id: "ACTIVE_LOANS", label: `Active Loans (${stats.activeLoansCount})` },
            { id: "OVERDUE", label: `Overdue Inspector (${stats.overdueLoansCount})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? tab.id === "OVERDUE" && stats.overdueLoansCount > 0
                  ? "bg-[#E6007E] text-white shadow-lg shadow-[#E6007E]/20"
                  : "bg-[#009FE3] text-black shadow-lg shadow-[#009FE3]/20"
                : "bg-[#141414] text-zinc-400 hover:text-white border border-[#262626]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Tab Views Content */}
      <div>
        {/* VIEW 1: FRONT DESK (Scanner + Basket + Interactive Calendar Schedule on Front!) */}
        {activeTab === "FRONT_DESK" && (
          <div className="space-y-8">
            {/* Top Row: Patron Card / Basket & Available Gear */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Col (7 cols): Patron & Available Gear */}
              <div className="lg:col-span-7 space-y-6">
                {activePatron ? (
                  <PatronCard
                    patron={activePatron}
                    onClear={handleClearPatron}
                  />
                ) : (
                  <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 text-center text-zinc-400">
                    <div className="w-10 h-10 rounded-full bg-[#0D0D0D] border border-[#262626] flex items-center justify-center mx-auto mb-2 text-[#009FE3]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-0.5">No Student Patron Scanned</h4>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                      Scan student badge or enter ID in the scanner to attach patron.
                    </p>
                  </div>
                )}

                {/* Available Gear Catalog with Location & Search */}
                <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Available Borrowable Gear</h3>
                      <p className="text-xs text-zinc-500">Click any gear item to add to the checkout basket</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Filter gear..."
                      value={gearSearch}
                      onChange={(e) => setGearSearch(e.target.value)}
                      className="bg-[#0D0D0D] border border-[#262626] focus:border-[#009FE3] text-white text-xs px-3 py-1.5 rounded-full outline-none w-40"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {filteredGear.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (!cartItems.some((c) => c.id === item.id)) {
                            setCartItems((prev) => [...prev, item]);
                          }
                        }}
                        className="text-left bg-[#0D0D0D] hover:bg-[#1a1a1a] border border-[#262626] hover:border-[#009FE3] p-3 rounded-2xl transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="font-bold text-white text-xs">{item.name}</div>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#009FE3] mt-0.5 font-bold">
                            <span>[{item.assetTag}]</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500">
                          <span>1-Month Rental</span>
                          <span className="text-emerald-400 font-bold">+ Add to Basket</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Col (5 cols): Checkout Basket */}
              <div className="lg:col-span-5">
                <CheckoutCart
                  patron={activePatron}
                  items={cartItems}
                  onRemoveItem={(id) => setCartItems((prev) => prev.filter((i) => i.id !== id))}
                  onClearCart={() => setCartItems([])}
                  onRestoreCart={(restored) => setCartItems(restored)}
                  onCheckoutSuccess={() => {
                    refreshData();
                  }}
                />
              </div>
            </div>

            {/* Bottom Section: Integrated Live Calendar Schedule directly on Front Desk */}
            <div className="pt-4 border-t border-[#262626]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Loan Schedule Calendar</h3>
                  <p className="text-xs text-zinc-400">
                    Front-desk view of active checkouts, expected 1-month returns, and overdue items
                  </p>
                </div>
              </div>
              <LoanCalendar labSlug={labSlug} />
            </div>
          </div>
        )}

        {/* VIEW 2: Active Loans Table */}
        {activeTab === "ACTIVE_LOANS" && (
          <ActiveLoansTable loans={activeLoans} onRefresh={refreshData} />
        )}

        {/* VIEW 3: Overdue Inspector */}
        {activeTab === "OVERDUE" && (
          <OverdueInspector overdueLoans={overdueLoans} onRefresh={refreshData} />
        )}
      </div>

      {/* New Patron Prompt Modal */}
      <AnimatePresence>
        {showNewPatronPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] border border-[#009FE3] rounded-3xl p-6 max-w-md w-full shadow-2xl font-mono text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                <h4 className="font-bold text-sm text-[#009FE3]">Register Student Patron</h4>
                <button
                  type="button"
                  onClick={() => setShowNewPatronPrompt(null)}
                  className="text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Student ID</label>
                  <input
                    type="text"
                    disabled
                    value={showNewPatronPrompt}
                    className="w-full bg-[#0D0D0D] border border-[#262626] text-white rounded-xl p-2.5 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Student Email</label>
                  <input
                    type="email"
                    placeholder={`${showNewPatronPrompt.toLowerCase()}@edu.zealand.dk`}
                    value={newPatronEmail}
                    onChange={(e) => setNewPatronEmail(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#009FE3] text-white rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPatronPrompt(null)}
                  className="px-4 py-2 bg-[#0D0D0D] border border-[#262626] text-zinc-300 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRegisterPatron}
                  className="px-5 py-2 bg-[#009FE3] text-black font-bold rounded-full shadow-lg shadow-[#009FE3]/20"
                >
                  Create & Attach
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
