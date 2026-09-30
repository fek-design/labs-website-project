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
import { ScannerInput, ScannerMode } from "./ScannerInput";
import { PatronCard } from "./PatronCard";
import { CheckoutCart } from "./CheckoutCart";
import { ActiveSessionPanel } from "./ActiveSessionPanel";
import { AnimatedCounter } from "./AnimatedCounter";
import { ActiveLoansTable } from "./ActiveLoansTable";
import { OverdueInspector } from "./OverdueInspector";
import { LoanCalendar } from "./LoanCalendar";
import { motion, AnimatePresence } from "motion/react";
import { User, X, Check, Package } from "@phosphor-icons/react";
import { getAuthSession } from "@/app/actions/auth";

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

  // Calendar real-time sync key
  const [calendarSyncKey, setCalendarSyncKey] = useState<number>(0);

  // Inspected Loan state (merged from popup to active session)
  const [inspectedLoan, setInspectedLoan] = useState<any | null>(null);

  // Scanned item return check-off state
  const [scannedReturnAssetTag, setScannedReturnAssetTag] = useState<string | null>(null);

  // Companion bundle suggestion modal state
  const [pendingBundlePrompt, setPendingBundlePrompt] = useState<{
    parent: any;
    accessories: Array<{
      accessory: any;
      defaultQuantity: number;
      selectedQuantity: number;
      included: boolean;
    }>;
  } | null>(null);

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const handleConfirmBundle = () => {
    if (!pendingBundlePrompt) return;
    const itemsToAdd = pendingBundlePrompt.accessories.filter((a) => a.included && a.selectedQuantity > 0);
    if (itemsToAdd.length === 0) {
      setPendingBundlePrompt(null);
      return;
    }

    setCartItems((prev) => {
      let updated = [...prev];
      for (const entry of itemsToAdd) {
        const acc = entry.accessory;
        const addQty = entry.selectedQuantity;
        const existingIdx = updated.findIndex((i) => i.id === acc.id);
        if (existingIdx !== -1) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: (updated[existingIdx].quantity || 1) + addQty,
          };
        } else {
          updated.push({
            ...acc,
            quantity: addQty,
          });
        }
      }
      return updated;
    });

    setScanMessage(`Tilføjede pakkesæt tilbehør til kurven.`);
    setTimeout(() => setScanMessage(null), 3000);
    setPendingBundlePrompt(null);
  };

  const handleSelectLoan = async (loan: any) => {
    setInspectedLoan(loan);
    const targetPatronId = loan.patronId || loan.patron?.id;
    if (targetPatronId) {
      try {
        const fullPatron = await getPatronDetails(targetPatronId);
        if (fullPatron) {
          setActivePatron(fullPatron);
        } else if (loan.patron) {
          setActivePatron(loan.patron);
        }
      } catch (err) {
        console.error("Failed to load full patron details for loan:", err);
        if (loan.patron) {
          setActivePatron(loan.patron);
        }
      }
    } else if (loan.patron) {
      setActivePatron(loan.patron);
    }
    // Scroll smoothly to active session panel
    setTimeout(() => {
      const el = document.getElementById("active-session-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  // Admin Operator Information
  const [adminName, setAdminName] = useState<string>("Admin");

  useEffect(() => {
    getAuthSession().then((session) => {
      if (session?.user?.username) {
        const raw = session.user.username;
        const formatted = raw.charAt(0).toUpperCase() + raw.slice(1);
        setAdminName(formatted);
      }
    }).catch(() => {
      // Fallback
    });
  }, []);

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
      setAvailableGear(
        gearRes.filter(
          (g: any) =>
            (g.trackingType === "BULK"
              ? ((g.availableQuantity ?? g.totalQuantity) > 0)
              : g.loans.length === 0) && g.operationalStatus === "AVAILABLE"
        )
      );

      if (currentPatronId && refreshedPatron) {
        setActivePatron(refreshedPatron);
      }

      setCalendarSyncKey((k) => k + 1);
    } catch (err) {
      console.error("Error refreshing POS data", err);
    }
  }, [labSlug]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleScannedAsset = async (item: any) => {
    // Bulk items handling: auto-increment if already in cart
    if (item.trackingType === "BULK") {
      const existingCartItem = cartItems.find((c) => c.id === item.id);
      if (existingCartItem) {
        const nextQty = (existingCartItem.quantity || 1) + 1;
        setCartItems((prev) =>
          prev.map((c) => (c.id === item.id ? { ...c, quantity: nextQty } : c))
        );
        setScanMessage(`Øget antal for ${item.name} (${nextQty} stk)`);
        return;
      }

      if (item.operationalStatus !== "AVAILABLE" && item.operationalStatus !== "MAINTENANCE") {
        setScanMessage(`Puljevare ${item.assetTag} har status ${item.operationalStatus}.`);
        return;
      }

      setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);
      setScanMessage(`Tilføjet puljevare: ${item.name} (${item.assetTag})`);
      return;
    }

    // Serialized items handling
    if (cartItems.some((c) => c.id === item.id)) {
      setScanMessage(`Udstyr ${item.assetTag} er allerede i kurven.`);
      return;
    }

    // Check if item has an active loan
    if (item.loans && item.loans.length > 0) {
      const activeLoan = item.loans[0];
      const isLoanedToActivePatron =
        activePatron &&
        (activeLoan.patron?.id === activePatron.id || activeLoan.patronId === activePatron.id);

      if (isLoanedToActivePatron) {
        setScannedReturnAssetTag(item.assetTag);
        setScanMessage(`Afkrydset for returnering: ${item.name} (${item.assetTag})`);
        return;
      }

      if (!activePatron && activeLoan.patron) {
        try {
          const fullPatron = await getPatronDetails(activeLoan.patron.id);
          setActivePatron(fullPatron || activeLoan.patron);
        } catch (e) {
          setActivePatron(activeLoan.patron);
        }
        setScannedReturnAssetTag(item.assetTag);
        setScanMessage(`Lån fundet - låner tilknyttet: ${activeLoan.patron.studentId}`);
        return;
      }

      setScanMessage(
        `Udstyr ${item.assetTag} er udlånt til en anden (${activeLoan.patron?.studentId || "aktivt lån"}).`
      );
      return;
    }

    if (item.operationalStatus !== "AVAILABLE") {
      setScanMessage(`Udstyr ${item.assetTag} har status ${item.operationalStatus}.`);
      return;
    }

    setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);
    setScanMessage(`Tilføjet ${item.name} (${item.assetTag})`);

    // Trigger companion bundle prompt if accessories are configured
    if (item.bundleAccessories && item.bundleAccessories.length > 0) {
      const accessories = item.bundleAccessories.map((ba: any) => ({
        accessory: ba.accessory,
        defaultQuantity: ba.defaultQuantity || 1,
        selectedQuantity: ba.defaultQuantity || 1,
        included: true,
      }));
      setPendingBundlePrompt({
        parent: item,
        accessories,
      });
    }
  };

  // Handle Scan Heuristic & Auto-Association with Mode Support
  const handleScanMatch = async ({
    query,
    mode = "AUTO",
  }: {
    type: "PATRON" | "ASSET";
    query: string;
    mode?: ScannerMode;
  }) => {
    setIsSearching(true);
    setScanMessage(null);

    try {
      const res = await searchPatronOrAsset(query, labSlug);

      // Force STUDENT mode
      if (mode === "STUDENT") {
        if (res.exactMatch?.type === "PATRON") {
          setActivePatron(res.exactMatch.data);
          setScanMessage(`Studerende tilknyttet: ${res.exactMatch.data.studentId}`);
        } else if (res.patrons.length > 0) {
          setActivePatron(res.patrons[0]);
          setScanMessage(`Studerende tilknyttet: ${res.patrons[0].studentId}`);
        } else {
          setShowNewPatronPrompt(query);
        }
        return;
      }

      // Force UDSTYR mode
      if (mode === "UDSTYR") {
        const item = res.exactMatch?.type === "ASSET" ? res.exactMatch.data : res.assets[0];
        if (item) {
          await handleScannedAsset(item);
        } else {
          setScanMessage(`Intet udstyr fundet for "${query}".`);
        }
        return;
      }

      // AUTO mode
      if (res.exactMatch) {
        if (res.exactMatch.type === "PATRON") {
          setActivePatron(res.exactMatch.data);
          setScanMessage(`Studerende tilknyttet: ${res.exactMatch.data.studentId}`);
        } else if (res.exactMatch.type === "ASSET") {
          await handleScannedAsset(res.exactMatch.data);
        }
      } else {
        if (res.patrons.length === 1) {
          setActivePatron(res.patrons[0]);
          setScanMessage(`Studerende tilknyttet: ${res.patrons[0].studentId}`);
        } else if (res.assets.length === 1) {
          await handleScannedAsset(res.assets[0]);
        } else if (query.length >= 6 && !query.startsWith("ML-") && !query.startsWith("MS-") && !query.startsWith("DL-")) {
          setShowNewPatronPrompt(query);
        } else {
          setScanMessage(`Ingen match fundet for "${query}".`);
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
      {/* 1. Top Header & KPI Metric Ribbon (Figma 79:842) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black font-notch tracking-tight flex items-baseline gap-1">
            <span className="text-white">LABS</span>
            <span className="text-[#FFED00]">Dashboard</span>
          </h1>
          <p className="text-sm font-notch font-bold text-zinc-400 mt-1">
            Velkommen, {adminName}
          </p>
        </div>

        {/* 3 Top KPI Metric Counters */}
        <div className="flex flex-wrap items-center gap-8 sm:gap-12">
          {/* 1. Aktive lån */}
          <div
            onClick={() => setActiveTab(activeTab === "ACTIVE_LOANS" ? "FRONT_DESK" : "ACTIVE_LOANS")}
            className="flex items-baseline gap-3 cursor-pointer group transition-transform hover:scale-[1.02]"
            title="Se alle aktive lån"
          >
            <AnimatedCounter
              value={stats.activeLoansCount}
              className="text-5xl sm:text-6xl font-bold font-notch text-white leading-none group-hover:text-[#009FE3] transition-colors"
            />
            <span className="text-sm text-zinc-400 font-notch font-normal leading-tight">
              Aktive<br />lån
            </span>
          </div>

          {/* 2. Overskredet Returneringer */}
          <div
            onClick={() => setActiveTab(activeTab === "OVERDUE" ? "FRONT_DESK" : "OVERDUE")}
            className="flex items-baseline gap-3 cursor-pointer group transition-transform hover:scale-[1.02]"
            title="Se overskredne lån"
          >
            <AnimatedCounter
              value={stats.overdueLoansCount}
              className={`text-5xl sm:text-6xl font-bold font-notch leading-none transition-colors ${
                stats.overdueLoansCount > 0 ? "text-[#E6007E]" : "text-white group-hover:text-[#E6007E]"
              }`}
            />
            <span className="text-sm text-zinc-400 font-notch font-normal leading-tight">
              Overskredet<br />Returneringer
            </span>
          </div>

          {/* 3. Ledigt udstyr */}
          <div className="flex items-baseline gap-3">
            <span className="text-5xl sm:text-6xl font-bold font-notch text-white leading-none">
              <AnimatedCounter value={stats.availableGearCount} />{" "}
              <span className="text-2xl sm:text-3xl text-zinc-500 font-normal">/ {stats.totalGearCount}</span>
            </span>
            <span className="text-sm text-zinc-400 font-notch font-normal leading-tight">
              Ledigt<br />udstyr
            </span>
          </div>
        </div>
      </div>

      {/* 2. Front Desk Primary Dashboard & Secondary Table Views */}
      {activeTab === "FRONT_DESK" && (
        <div className="space-y-6">
          {/* Upper Section: 2-Column Calendar & Date Activity Schedule (Figma 79:854) */}
          <LoanCalendar
            labSlug={labSlug}
            syncTrigger={calendarSyncKey}
            onSync={refreshData}
            onSelectLoan={handleSelectLoan}
          />

          {/* Middle Section: Universal Full-Width Barcode Scanner (Figma 79:2117) */}
          <div className="space-y-1.5">
            {scanMessage && (
              <div className="text-xs text-[#009FE3] font-bold font-mono animate-pulse px-1">
                {scanMessage}
              </div>
            )}
            <ScannerInput
              onScanMatch={handleScanMatch}
              isSearching={isSearching}
              placeholder="Scan eller søg..."
            />
          </div>

          {/* Lower Section: Split "Aktiv Session" Panel (Figma 104:7685) */}
          <ActiveSessionPanel
            patron={activePatron}
            items={cartItems}
            inspectedLoan={inspectedLoan}
            onClearInspectedLoan={() => setInspectedLoan(null)}
            lastScannedReturnAssetTag={scannedReturnAssetTag}
            onClearScannedReturnAssetTag={() => setScannedReturnAssetTag(null)}
            onRemoveItem={(id) => setCartItems((prev) => prev.filter((i) => i.id !== id))}
            onUpdateQuantity={handleUpdateQuantity}
            onClearSession={() => {
              setActivePatron(null);
              setCartItems([]);
              setInspectedLoan(null);
              setScannedReturnAssetTag(null);
              setScanMessage("Session ryddet.");
              setTimeout(() => setScanMessage(null), 2000);
            }}
            onCheckoutSuccess={() => {
              refreshData();
            }}
            onRefresh={() => {
              refreshData();
              setInspectedLoan(null);
            }}
          />

          {/* Optional: Available Gear Quick Catalog */}
          <div className="bg-[#151517] border border-[#333333] rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold font-headline text-white">Hurtig katalog (Ledigt udstyr)</h3>
                <p className="text-xs text-zinc-400 font-mono">Klik på en genstand for at tilføje direkte til sessionen</p>
              </div>
              <input
                type="text"
                placeholder="Filtrer udstyr..."
                value={gearSearch}
                onChange={(e) => setGearSearch(e.target.value)}
                className="bg-[#202021] border border-[#444444] focus:border-[#FFED00] text-white text-xs px-3 py-1.5 rounded-lg outline-none w-48 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-56 overflow-y-auto pr-1">
              {filteredGear.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleScannedAsset(item)}
                  className="text-left bg-[#202021] hover:bg-[#28282a] border border-[#444444] hover:border-[#009FE3] p-3 rounded-lg transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-white text-xs font-notch truncate">{item.name}</div>
                    <div className="text-[11px] text-[#009FE3] mt-0.5 font-bold font-mono">
                      [{item.assetTag}]
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                    <span>Ledig</span>
                    <span className="text-[#FFED00] font-bold">+ Tilføj</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Active Loans Table */}
      {activeTab === "ACTIVE_LOANS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2e2e2e]">
            <h2 className="text-base font-bold font-headline text-white">Alle aktive udlån ({stats.activeLoansCount})</h2>
            <button
              type="button"
              onClick={() => setActiveTab("FRONT_DESK")}
              className="text-xs font-mono text-[#009FE3] hover:underline cursor-pointer"
            >
              ← Tilbage til Dashboard
            </button>
          </div>
          <ActiveLoansTable loans={activeLoans} onRefresh={refreshData} />
        </div>
      )}

      {/* VIEW 3: Overdue Inspector */}
      {activeTab === "OVERDUE" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#2e2e2e]">
            <h2 className="text-base font-bold font-headline text-[#E6007E]">Overskredne returneringer ({stats.overdueLoansCount})</h2>
            <button
              type="button"
              onClick={() => setActiveTab("FRONT_DESK")}
              className="text-xs font-mono text-[#009FE3] hover:underline cursor-pointer"
            >
              ← Tilbage til Dashboard
            </button>
          </div>
          <OverdueInspector overdueLoans={overdueLoans} onRefresh={refreshData} />
        </div>
      )}

      {/* New Patron Prompt Modal */}
      <AnimatePresence>
        {showNewPatronPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#151517] border border-[#333333] rounded-lg p-6 max-w-md w-full shadow-2xl font-mono text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#2e2e2e]">
                <h4 className="font-bold text-sm text-[#FFED00] font-headline">Opret & Tilknyt Studerende</h4>
                <button
                  type="button"
                  onClick={() => setShowNewPatronPrompt(null)}
                  aria-label="Luk modal"
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} weight="bold" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Student ID</label>
                  <input
                    type="text"
                    disabled
                    value={showNewPatronPrompt}
                    className="w-full bg-[#101012] border border-[#2e2e2e] text-white rounded-lg p-2.5 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Student Email</label>
                  <input
                    type="email"
                    placeholder={`${showNewPatronPrompt.toLowerCase()}@edu.zealand.dk`}
                    value={newPatronEmail}
                    onChange={(e) => setNewPatronEmail(e.target.value)}
                    className="w-full bg-[#101012] border border-[#2e2e2e] focus:border-[#FFED00] text-white rounded-lg p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPatronPrompt(null)}
                  className="px-4 py-2 bg-[#202021] border border-[#444444] text-zinc-300 hover:text-white rounded-lg cursor-pointer"
                >
                  Annuller
                </button>
                <button
                  type="button"
                  onClick={handleRegisterPatron}
                  className="px-5 py-2 bg-[#ffd900] text-black font-bold rounded-lg shadow-md cursor-pointer hover:bg-yellow-400 transition-colors"
                >
                  Opret & Tilknyt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Companion Bundle Suggestion Modal */}
      <AnimatePresence>
        {pendingBundlePrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-[#151517] border border-[#333333] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative font-mono"
            >
              <button
                type="button"
                onClick={() => setPendingBundlePrompt(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full cursor-pointer transition-colors"
                title="Luk"
              >
                <X size={18} weight="bold" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFED00]/15 border border-[#FFED00]/30 text-[#FFED00] flex items-center justify-center shrink-0">
                  <Package size={22} weight="bold" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-notch text-white">
                    Pakkesæt tilgængeligt
                  </h3>
                  <p className="text-xs text-zinc-400 font-headline">
                    Anbefalet tilbehør til {pendingBundlePrompt.parent.name}
                  </p>
                </div>
              </div>

              <div className="text-xs text-zinc-300 mb-3">
                Dette udstyr har et tilknyttet pakkesæt. Vælg hvilke puljevarer du ønsker at tilføje til lånet:
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 my-4">
                {pendingBundlePrompt.accessories.map((item, idx) => {
                  const acc = item.accessory;
                  return (
                    <div
                      key={acc.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                        item.included
                          ? "bg-[#202021] border-[#FFED00]/40"
                          : "bg-[#18181a] border-[#333333] opacity-60"
                      }`}
                    >
                      <label className="flex items-center gap-2.5 cursor-pointer min-w-0 flex-1 select-none">
                        <input
                          type="checkbox"
                          checked={item.included}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setPendingBundlePrompt((prev) => {
                              if (!prev) return null;
                              const next = [...prev.accessories];
                              next[idx] = { ...next[idx], included: checked };
                              return { ...prev, accessories: next };
                            });
                          }}
                          className="w-4 h-4 rounded border-[#444444] bg-[#151517] text-[#FFED00] accent-[#FFED00] cursor-pointer"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate font-notch">
                            {acc.name}
                          </div>
                          <div className="text-[11px] text-[#009FE3] font-mono">
                            [{acc.assetTag}]
                            {acc.trackingType === "BULK" && (
                              <span className="ml-2 text-zinc-400">
                                ({acc.availableQuantity !== undefined ? acc.availableQuantity : acc.totalQuantity} ledige)
                              </span>
                            )}
                          </div>
                        </div>
                      </label>

                      {item.included && (
                        <div className="flex items-center bg-[#151517] border border-[#333333] rounded-lg overflow-hidden shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setPendingBundlePrompt((prev) => {
                                if (!prev) return null;
                                const next = [...prev.accessories];
                                next[idx] = {
                                  ...next[idx],
                                  selectedQuantity: Math.max(1, next[idx].selectedQuantity - 1),
                                };
                                return { ...prev, accessories: next };
                              });
                            }}
                            className="px-2 py-1 text-zinc-400 hover:text-white hover:bg-[#252527] transition-colors font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 font-bold text-white font-mono">
                            {item.selectedQuantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setPendingBundlePrompt((prev) => {
                                if (!prev) return null;
                                const next = [...prev.accessories];
                                next[idx] = {
                                  ...next[idx],
                                  selectedQuantity: next[idx].selectedQuantity + 1,
                                };
                                return { ...prev, accessories: next };
                              });
                            }}
                            className="px-2 py-1 text-zinc-400 hover:text-white hover:bg-[#252527] transition-colors font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#2e2e2e] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setPendingBundlePrompt(null)}
                  className="px-4 py-2 rounded-full bg-[#202021] hover:bg-zinc-800 border border-[#333333] text-zinc-300 text-xs font-headline transition-colors cursor-pointer"
                >
                  Spring over
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBundle}
                  className="px-5 py-2 rounded-full bg-[#FFED00] hover:bg-[#e6d500] text-black font-extrabold text-xs font-headline transition-all shadow-md shadow-[#FFED00]/20 cursor-pointer"
                >
                  + Tilføj valgte til kurv
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
