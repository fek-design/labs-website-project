"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCampus, CampusKey, CAMPUS_DATA, STORAGE_KEY_CAMPUS } from "./CampusContext";

interface FirstTimeCampusGateProps {
  forceShow?: boolean;
  onEnter?: (campus: CampusKey) => void;
}

const CAMPUSES: CampusKey[] = ["køge", "roskilde", "næstved", "holbæk"];

export function FirstTimeCampusGate({ forceShow = false, onEnter }: FirstTimeCampusGateProps) {
  const { campus, setCampus } = useCampus();
  const [selectedCampus, setSelectedCampus] = useState<CampusKey>(campus);
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (forceShow) {
      setIsOpen(true);
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY_CAMPUS);
      if (!stored || !(stored in CAMPUS_DATA)) {
        setIsOpen(true);
      } else {
        setSelectedCampus(stored as CampusKey);
      }
    } catch {
      // In restricted environments, keep gate closed if error reading
      setIsOpen(false);
    }
  }, [forceShow]);

  // Synchronize internal selection if context changes
  useEffect(() => {
    setSelectedCampus(campus);
  }, [campus]);

  const handleSelectCampus = (c: CampusKey) => {
    setSelectedCampus(c);
  };

  const handleEnter = () => {
    // Persist choice to localStorage and global CampusContext
    setCampus(selectedCampus, true);
    setIsOpen(false);
    if (onEnter) {
      onEnter(selectedCampus);
    }
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="first-time-campus-gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(12px)",
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-black text-white select-none pointer-events-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Vælg Zealand Labs Campus"
        >
          {/* Atmospheric Background with dark overlay & subtle blur */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 filter blur-[2px] transition-transform duration-1000"
              style={{ backgroundImage: `url('/images/landing/hero-bg.jpg')` }}
            />
            {/* Dark tinted overlay per Figma rgba(0, 0, 0, 0.81) */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
            {/* Subtle radial CMYK glow in background */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-cyan/10 blur-[120px] rounded-full pointer-events-none" />
          </div>

          {/* Top Header - Clearly apparent it is Zealand Labs */}
          <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-between">
            <span className="font-notch text-2xl sm:text-3xl font-extrabold tracking-tighter text-white">
              LABS
            </span>
            <div className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase hidden sm:block">
              Makerspace &amp; Medialab Portal
            </div>
          </header>

          {/* Center Dynamic Readout Section */}
          <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto -mt-6 sm:-mt-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extralight text-zinc-300 tracking-wide font-sans">
                Vælg Campus <br className="sm:hidden" />
                nærest dig:
              </h1>

              {/* Dynamic large selected campus name */}
              <div className="min-h-[72px] sm:min-h-[88px] flex items-center justify-center">
                <motion.div
                  key={selectedCampus}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="font-sans font-bold text-5xl sm:text-7xl md:text-8xl tracking-tight text-white capitalize drop-shadow-md"
                >
                  {CAMPUS_DATA[selectedCampus].name}
                </motion.div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md mx-auto pt-2">
                Tilpasser maskintelemetri, udstyrsudlån og åbningstider til dit lokale værksted.
              </p>
            </motion.div>
          </main>

          {/* Bottom Campus Selector & "TRÆD IND" Action (Figma Frame 144:470) */}
          <footer className="relative z-10 w-full max-w-2xl mx-auto px-6 pb-10 sm:pb-14 flex flex-col items-center gap-7 sm:gap-9">
            {/* Campus Selector Row with horizontal scroll on small devices */}
            <div
              className="w-full flex items-center justify-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar py-2 px-1"
              role="tablist"
              aria-label="Vælg campus lokation"
            >
              {CAMPUSES.map((cKey) => {
                const isSelected = selectedCampus === cKey;
                return (
                  <button
                    key={cKey}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelectCampus(cKey)}
                    className={`relative text-lg sm:text-2xl transition-all duration-200 cursor-pointer touch-manipulation px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-white rounded ${
                      isSelected
                        ? "text-white font-semibold scale-105"
                        : "text-zinc-500 font-extralight hover:text-zinc-300"
                    }`}
                  >
                    <span>{CAMPUS_DATA[cKey].name}</span>
                    {isSelected && (
                      <motion.div
                        layoutId="activeCampusUnderline"
                        className="absolute -bottom-1 left-2 right-2 h-0.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* "TRÆD IND" Entry CTA Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleEnter}
              className="w-full sm:w-auto min-w-[240px] px-10 py-4 bg-white text-black font-semibold text-lg sm:text-xl tracking-wider rounded-full shadow-2xl hover:bg-zinc-100 transition-all cursor-pointer flex items-center justify-center gap-2 touch-manipulation border border-white"
            >
              <span>TRÆD IND</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </motion.button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
