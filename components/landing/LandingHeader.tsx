"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useCampus } from "./CampusContext";
import { MapPin, ArrowUpRight } from "@phosphor-icons/react";

export function LandingHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { campus } = useCampus();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Dynamic Scroll Listener
  useEffect(() => {
    let lastScrollY = window.scrollY || 0;

    const handleScroll = () => {
      const currentScrollY = Math.max(
        0,
        window.scrollY ||
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0
      );

      setIsScrolled(currentScrollY > 60);

      if (isOpen) {
        setIsVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      // Hide when scrolling down past 60px
      if (currentScrollY > 60 && currentScrollY > lastScrollY + 5) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY - 5 || currentScrollY <= 60) {
        // Show immediately when scrolling up or at top
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Handle cross-route incoming hash anchor scrolls
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash && pathname === "/") {
      const hash = window.location.hash.replace("#", "");
      const timer = setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Cross-route anchor navigation handler
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (pathname === "/") {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${targetId}`);
    }
    setIsOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-out pointer-events-auto ${
          isVisible || isOpen ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-3"
            : "bg-transparent border-b border-transparent py-4 sm:py-6"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <Link
            href="/"
            className="font-notch text-2xl md:text-3xl font-extrabold tracking-tighter text-white touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3] rounded"
          >
            LABS
          </Link>

          {/* Right: Location Indicator Badge & Universal Hamburger Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Location Indicator Badge */}
            <div className="flex items-center gap-1.5 text-xs text-white font-bold px-3 sm:px-3.5 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] rounded-full bg-black/60 backdrop-blur-md border border-white/15 select-none font-headline">
              <span>{campus.toUpperCase()} CAMPUS</span>
              <MapPin size={13} weight="bold" className="text-[#009FE3] shrink-0" aria-hidden="true" />
            </div>

            {/* Universal Hamburger Menu Toggle (Accessible across all viewports) */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col justify-center items-center w-11 h-11 sm:w-12 sm:h-12 p-2 text-white focus:outline-none cursor-pointer rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors touch-manipulation focus-visible:ring-2 focus-visible:ring-[#009FE3]"
              aria-label={isOpen ? "Luk navigationsmenu" : "Åbn navigationsmenu"}
              aria-expanded={isOpen}
            >
              <span className="w-5 flex flex-col gap-1.5 pointer-events-none">
                <span
                  className={`block w-full h-[2px] bg-white transition-transform duration-300 ${
                    isOpen ? "rotate-45 translate-y-[4px]" : ""
                  }`}
                />
                <span
                  className={`block w-full h-[2px] bg-white transition-transform duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-[4px]" : ""
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
            role="dialog"
            aria-modal="true"
            aria-label="Mobil navigation"
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-between px-6 sm:px-8 pt-24 pb-12 overflow-y-auto"
          >
            <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-between">
              <nav className="flex flex-col gap-4 sm:gap-6 text-xl sm:text-2xl font-notch text-white my-auto">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block pt-2">
                  Studerende & Værksteder
                </span>
                <Link
                  href="/katalog"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-[#009FE3] transition-colors py-1 flex items-center justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3] rounded"
                >
                  <span>Udstyrskatalog & Udlån</span>
                  <span className="text-xs font-mono text-zinc-500 group-hover:text-[#009FE3] transition-colors">
                    SE ALLE →
                  </span>
                </Link>
                <a
                  href="#prototypes"
                  onClick={(e) => handleAnchorClick(e, "prototypes")}
                  className="hover:text-[#009FE3] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3] rounded"
                >
                  Prototypes & Guides
                </a>
                <a
                  href="#showcase"
                  onClick={(e) => handleAnchorClick(e, "showcase")}
                  className="hover:text-[#009FE3] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3] rounded"
                >
                  Projekter & Hotspots
                </a>
                <a
                  href="#machines"
                  onClick={(e) => handleAnchorClick(e, "machines")}
                  className="hover:text-[#009FE3] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3] rounded"
                >
                  Maskiner & Live Status
                </a>
                <a
                  href="#support-pillars"
                  onClick={(e) => handleAnchorClick(e, "support-pillars")}
                  className="hover:text-[#009FE3] transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3] rounded"
                >
                  Laboratorier & Support
                </a>
                <Link
                  href="/makerspace"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-[#009FE3] transition-colors py-1 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3] rounded"
                >
                  <span>Makerspace Værksted</span>
                  <span className="text-xs font-mono text-[#009FE3]">KØGE ↗</span>
                </Link>
                <Link
                  href="/medialab"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-[#E6007E] transition-colors py-1 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E6007E] rounded"
                >
                  <span>Medialab AV-Studio</span>
                  <span className="text-xs font-mono text-[#E6007E]">KØGE ↗</span>
                </Link>

                <div className="pt-6 mt-2 border-t border-white/10 flex flex-col gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block pb-1">
                    Underviser & Personale
                  </span>
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-between text-base font-sans font-bold text-[#FFED00] hover:underline py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3] rounded"
                  >
                    <span>Admin Launchpad & Værktøjer</span>
                    <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/admin/pos"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-between text-sm font-sans text-zinc-400 hover:text-white py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3] rounded"
                  >
                    <span>POS Udlånsskranke</span>
                    <span className="text-xs font-mono text-zinc-500">DIREKTE ↗</span>
                  </Link>
                </div>
              </nav>

              <div className="text-xs text-zinc-500 font-mono pt-6 border-t border-white/5 flex items-center justify-between">
                <span>Zealand Labs • {campus.toUpperCase()} CAMPUS</span>
                <span className="text-[11px] text-zinc-600">Offline Local Infrastructure</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
