"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useCampus, CampusKey } from "./CampusContext";
import { MapPin, ArrowUpRight } from "@phosphor-icons/react";

export function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [campusDropdown, setCampusDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { campus, setCampus } = useCampus();

  useEffect(() => {
    const handleScroll = () => {
      const pos =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setIsScrolled(pos > 60);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCampus = (newCampus: CampusKey) => {
    setCampus(newCampus);
    setCampusDropdown(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-out pointer-events-auto ${isScrolled
            ? "bg-black/85 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5"
            : "bg-transparent border-b border-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="font-notch text-2xl md:text-3xl font-extrabold tracking-tighter text-white touch-manipulation">
            LABS
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Location Indicator Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCampusDropdown(!campusDropdown)}
                className="flex items-center gap-1.5 text-xs text-white/90 font-medium px-3.5 py-2 min-h-[40px] rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/15 cursor-pointer transition-colors active:scale-95 touch-manipulation"
                aria-label="Skift lokation"
              >
                <span className="capitalize">{campus}</span>
                <MapPin size={14} weight="bold" className="text-white/80 shrink-0" aria-hidden="true" />
              </button>

              {/* Campus Dropdown */}
              <AnimatePresence>
                {campusDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-40 max-w-[calc(100vw-32px)] bg-[#121214] border border-white/12 rounded-lg shadow-xl p-1.5 z-50 font-sans text-xs"
                  >
                    {(["køge", "roskilde"] as CampusKey[]).map((cKey) => (
                      <button
                        key={cKey}
                        type="button"
                        onClick={() => toggleCampus(cKey)}
                        className={`w-full text-left px-3 py-2.5 min-h-[40px] rounded-lg transition-colors flex items-center justify-between cursor-pointer touch-manipulation capitalize ${
                          campus === cKey
                            ? "bg-brand-cyan/20 text-brand-cyan font-bold"
                            : "text-white/80 hover:bg-white/10"
                        }`}
                      >
                        <span>{cKey}</span>
                        {campus === cKey && <span className="text-[10px]">●</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger Menu Toggle with 44px hit target */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col justify-center items-center w-11 h-11 p-2 text-white focus:outline-none cursor-pointer rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation"
              aria-label="Toggle navigation menu"
            >
              <span className="w-5 flex flex-col gap-1.5 pointer-events-none">
                <span
                  className={`block w-full h-[2px] bg-white transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-[4px]" : ""
                    }`}
                />
                <span
                  className={`block w-full h-[2px] bg-white transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-[4px]" : ""
                    }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-down / Fullscreen Mobile Drawer with Safe Scrolling */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-between px-6 sm:px-8 pt-24 pb-12 overflow-y-auto"
          >
            <nav className="flex flex-col gap-6 text-2xl sm:text-3xl font-notch text-white my-auto">
              <a
                href="#prototypes"
                onClick={() => setIsOpen(false)}
                className="hover:text-brand-cyan transition-colors py-1"
              >
                Prototypes
              </a>
              <a
                href="#showcase"
                onClick={() => setIsOpen(false)}
                className="hover:text-brand-cyan transition-colors py-1"
              >
                Projekter & Hotspots
              </a>
              <a
                href="#support-pillars"
                onClick={() => setIsOpen(false)}
                className="hover:text-brand-cyan transition-colors py-1"
              >
                Prototyping & Labs
              </a>
              <a
                href="#machines"
                onClick={() => setIsOpen(false)}
                className="hover:text-brand-cyan transition-colors py-1"
              >
                Maskiner & Status
              </a>
              <div className="pt-6 border-t border-white/10">
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 text-base font-sans font-bold text-brand-yellow hover:underline py-2"
                >
                  <span>Admin Portal</span>
                  <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                </Link>
              </div>
            </nav>

            <div className="text-xs text-zinc-500 font-mono pt-6 border-t border-white/5">
              Zealand Labs • Roskilde & Køge Campus
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
