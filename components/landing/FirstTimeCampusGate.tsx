"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCampus, CampusKey, CAMPUS_DATA, STORAGE_KEY_CAMPUS } from "./CampusContext";
import { ArrowRight } from "@phosphor-icons/react";

interface FirstTimeCampusGateProps {
  forceShow?: boolean;
  onEnter?: (campus: CampusKey) => void;
}

const CAMPUSES: CampusKey[] = ["køge", "roskilde"];

export function FirstTimeCampusGate({ forceShow = false, onEnter }: FirstTimeCampusGateProps) {
  const { campus, setCampus } = useCampus();
  const [selectedCampus, setSelectedCampus] = useState<CampusKey>(
    campus in CAMPUS_DATA ? campus : "køge"
  );
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    try {
      const stored = localStorage.getItem(STORAGE_KEY_CAMPUS);
      if (stored && stored in CAMPUS_DATA) {
        setSelectedCampus(stored as CampusKey);
        if (forceShow) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      } else {
        setSelectedCampus("køge");
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, [forceShow]);

  // Lock background scrolling while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [isOpen]);

  // Synchronize internal selection if context changes
  useEffect(() => {
    if (campus in CAMPUS_DATA) {
      setSelectedCampus(campus);
    }
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

          {/* Top Header */}
          <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-between">
            <span className="font-notch text-2xl sm:text-3xl font-extrabold tracking-tighter text-white">
              LABS
            </span>
            <div className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase hidden sm:block">
              Makerspace &amp; Medialab Portal
            </div>
          </header>

          {/* Center Dynamic Readout Section */}
          <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto -mt-4 sm:-mt-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="space-y-5 sm:space-y-6"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extralight text-zinc-300 tracking-wide font-sans">
                Vælg Campus <br className="sm:hidden" />
                nærest dig:
              </h1>

              {/* Dynamic large selected campus name */}
              <div className="min-h-[64px] sm:min-h-[80px] flex items-center justify-center">
                <motion.div
                  key={selectedCampus}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="font-sans font-bold text-5xl sm:text-7xl md:text-8xl tracking-tight text-white capitalize drop-shadow-md"
                >
                  {CAMPUS_DATA[selectedCampus]?.name || "Køge"}
                </motion.div>
              </div>

              {/* Authentic Danish Makerspace Copy */}
              <div className="space-y-2 max-w-lg mx-auto pt-1">
                <p className="text-xs sm:text-sm md:text-base text-zinc-300 font-light leading-relaxed">
                  Zealand Labs er åbne faciliteter til hurtig prototyping, medieproduktion og digital fabrikation. Vælg din lokation for at se tilgængeligt udstyr, live maskinstatus og værkstedsressourcer.
                </p>
                <p className="text-[11px] sm:text-xs text-zinc-500 font-mono">
                  Du kan altid skifte lokation øverst i menuen.
                </p>
              </div>
            </motion.div>
          </main>

          {/* Bottom Campus Selector & "TRÆD IND" Action */}
          <footer className="relative z-10 w-full max-w-2xl mx-auto px-6 pb-10 sm:pb-14 flex flex-col items-center gap-6 sm:gap-8">
            {/* Campus Selector Row */}
            <div
              className="w-full flex items-center justify-center gap-6 sm:gap-10 py-2 px-1"
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
                    className={`relative text-xl sm:text-2xl transition-all duration-200 cursor-pointer touch-manipulation px-3 py-1 outline-none focus-visible:ring-2 focus-visible:ring-white rounded-none ${
                      isSelected
                        ? "text-white font-semibold scale-105"
                        : "text-zinc-500 font-extralight hover:text-zinc-300"
                    }`}
                  >
                    <span>{CAMPUS_DATA[cKey]?.name || cKey}</span>
                    {isSelected && (
                      <motion.div
                        layoutId="activeCampusUnderline"
                        className="absolute -bottom-1 left-2 right-2 h-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* "TRÆD IND" Entry CTA Button - Tier 1 Architectural Sharp (No Border Radius) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleEnter}
              className="w-full sm:w-auto px-8 py-3 bg-white text-black font-semibold text-sm sm:text-base tracking-wider uppercase rounded-none shadow-xl hover:bg-zinc-200 transition-all cursor-pointer flex items-center justify-center gap-2.5 touch-manipulation border border-white group"
            >
              <span>TRÆD IND</span>
              <ArrowRight
                size={16}
                weight="bold"
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </motion.button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
