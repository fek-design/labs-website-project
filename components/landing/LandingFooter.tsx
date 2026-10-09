"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Clock, ShieldCheck } from "@phosphor-icons/react";

interface LandingFooterProps {
  className?: string;
}

export function LandingFooter({ className = "" }: LandingFooterProps) {
  return (
    <footer
      className={`w-full bg-[#09090b] text-white border-t border-[#262626] py-12 sm:py-16 px-4 sm:px-8 select-none ${className}`}
      aria-label="Sidefod og navigation"
    >
      <div className="max-w-5xl mx-auto">
        {/* Responsive 8-12-16 Grid Structure (Stacked on mobile, Scaled 12-col on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          {/* Column 1: Zealand Labs Brand, Location & Live Status (Spans 4 of 12) */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <div className="space-y-1.5">
              <span className="font-notch text-3xl sm:text-4xl font-extrabold tracking-tighter text-white block">
                LABS
              </span>
              <p className="font-headline text-xs font-semibold text-zinc-400">
                Zealand Sjællands Erhvervsakademi
              </p>
            </div>

            <div className="space-y-2 text-xs font-sans text-zinc-400">
              <div className="flex items-center gap-2">
                <MapPin size={14} weight="bold" className="text-[#009FE3] shrink-0" aria-hidden="true" />
                <span>Lyngvej 21, 4600 Køge</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} weight="bold" className="text-zinc-500 shrink-0" aria-hidden="true" />
                <span>Hverdage 08:30 – 16:00 (Onsdag 14–17 i Makerspace)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Udforsk (Spans 3 of 12) */}
          <div className="space-y-3 lg:col-span-3">
            <span className="font-headline text-xs font-bold uppercase tracking-wider text-[#009FE3] block">
              Udforsk
            </span>
            <nav className="flex flex-col gap-2 font-sans text-xs sm:text-sm text-zinc-300" aria-label="Udforsk links">
              <Link
                href="/katalog"
                className="hover:text-white transition-colors py-0.5 inline-flex items-center justify-between group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#009FE3] rounded"
              >
                <span className="font-bold text-white group-hover:text-[#009FE3] transition-colors">
                  Udstyrskatalog & Udlån
                </span>
                <span className="text-[10px] font-mono text-zinc-500 group-hover:text-[#009FE3]">↗</span>
              </Link>
              <Link
                href="/craft/t-shirt"
                className="hover:text-white transition-colors py-0.5 text-zinc-400 hover:text-zinc-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#009FE3] rounded"
              >
                Prototype Guides
              </Link>
              <Link
                href="/#showcase"
                className="hover:text-white transition-colors py-0.5 text-zinc-400 hover:text-zinc-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#009FE3] rounded"
              >
                Projekter & Hotspots
              </Link>
              <Link
                href="/#machines"
                className="hover:text-white transition-colors py-0.5 text-zinc-400 hover:text-zinc-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#009FE3] rounded"
              >
                Maskintelemetri (Live)
              </Link>
              <Link
                href="/#prototypes"
                className="hover:text-white transition-colors py-0.5 text-zinc-400 hover:text-zinc-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#009FE3] rounded"
              >
                Inspiration & Galleri
              </Link>
            </nav>
          </div>

          {/* Column 3: Værksteder & Support (Spans 3 of 12) */}
          <div className="space-y-3 lg:col-span-3">
            <span className="font-headline text-xs font-bold uppercase tracking-wider text-[#FFED00] block">
              Værksteder & Support
            </span>
            <nav className="flex flex-col gap-2 font-sans text-xs sm:text-sm text-zinc-300" aria-label="Værksted og support links">
              <Link
                href="/makerspace"
                className="hover:text-white transition-colors py-0.5 text-zinc-300 hover:text-[#009FE3] inline-flex items-center justify-between focus:outline-none focus-visible:ring-1 focus-visible:ring-[#009FE3] rounded"
              >
                <span>Makerspace Værksted</span>
                <span className="text-[10px] font-mono text-[#009FE3]">↗</span>
              </Link>
              <Link
                href="/medialab"
                className="hover:text-white transition-colors py-0.5 text-zinc-300 hover:text-[#E6007E] inline-flex items-center justify-between focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E6007E] rounded"
              >
                <span>MediaLab AV-Udlån</span>
                <span className="text-[10px] font-mono text-[#E6007E]">↗</span>
              </Link>
              <Link
                href="/#support-pillars"
                className="hover:text-white transition-colors py-0.5 text-zinc-400 hover:text-zinc-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FFED00] rounded"
              >
                Prototyping Retningslinjer
              </Link>
              <span className="text-[11px] text-zinc-500 pt-2 block border-t border-white/10">
                Brug for vejledning eller materialer? Mød op i lab-åbningstiden eller tag fat i lab-vagten.
              </span>
            </nav>
          </div>

          {/* Column 4: Personale & Gateway (Spans 2 of 12) */}
          <div className="space-y-3 lg:col-span-2">
            <span className="font-headline text-xs font-bold uppercase tracking-wider text-[#E6007E] block">
              Personale
            </span>
            <nav className="flex flex-col gap-2 font-sans text-xs sm:text-sm text-zinc-300" aria-label="Personale links">
              <Link
                href="/admin"
                className="hover:text-white transition-colors py-0.5 inline-flex items-center gap-1 font-bold text-white hover:text-[#FFED00] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FFED00] rounded"
              >
                <span>Admin Portal</span>
                <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
              </Link>
              <Link
                href="/admin/pos"
                className="hover:text-white transition-colors py-0.5 text-zinc-400 hover:text-zinc-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#009FE3] rounded"
              >
                POS Udlånsskranke
              </Link>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 bg-[#151517] px-2 py-1 rounded border border-[#262626]">
                  <ShieldCheck size={12} weight="bold" className="text-emerald-400" aria-hidden="true" />
                  <span>Zero-Cloud</span>
                </span>
              </div>
            </nav>
          </div>
        </div>

        {/* Bottom Utility Bar (Divisible by 8 rhythm: pt-8 mt-12 = 32px / 48px) */}
        <div className="pt-8 mt-12 border-t border-[#262626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span>Zealand Sjællands Erhvervsakademi</span>
            <span>•</span>
            <span>Køge Campus</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-500">
            <span>100% Offline Local Network Infrastructure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
