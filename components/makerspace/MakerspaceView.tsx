"use client";

import React from "react";
import Link from "next/link";
import { CampusProvider } from "@/components/landing/CampusContext";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { MarqueeRibbon } from "@/components/landing/MarqueeRibbon";
import { ArrowUpRight, Clock, MapPin, ShieldCheck, Wrench, Sparkle } from "@phosphor-icons/react";

export interface LabMachineItem {
  name: string;
  model: string;
  location: string;
  status: string;
  type: string;
}

interface MakerspaceViewProps {
  machines: LabMachineItem[];
}

export function MakerspaceView({ machines }: MakerspaceViewProps) {
  return (
    <CampusProvider>
      <div className="min-h-screen bg-black text-white selection:bg-[#009FE3]/30 selection:text-white flex flex-col justify-between overflow-x-hidden">
        {/* Universal Top Navigation */}
        <LandingHeader />

        <main id="main-content" className="flex-1 w-full pt-20 sm:pt-24 pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-12 sm:space-y-16">
            {/* Header Hero Section */}
            <div className="space-y-4 pt-4 sm:pt-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#009FE3] animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#009FE3] font-bold">
                  Zealand Labs • Fysisk Prototyping
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="font-notch text-4xl sm:text-6xl font-light tracking-tight text-white uppercase">
                  Makerspace
                </h1>
                <div className="h-0.5 w-16 bg-[#009FE3]" />
              </div>

              <p className="font-sans text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed font-light">
                Makerspace er vores åbne værksted for fysisk fabrikation, rapid prototyping og didaktisk udvikling.
                Her kan studerende og undervisere bringe digitale modeller til live med 3D-print, laserskæring og tekstiltryk.
              </p>

              {/* Lab Metadata Utility Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-zinc-400">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#151517] border border-[#262626]">
                  <MapPin size={13} weight="bold" className="text-[#009FE3]" />
                  <span>Lyngvej 21, 4600 Køge</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#151517] border border-[#262626]">
                  <Clock size={13} weight="bold" className="text-zinc-500" />
                  <span>Hverdage 08:30 – 16:00 (Onsdag 14–17 åbent værksted)</span>
                </span>
              </div>
            </div>

            {/* Asymmetrical 8-12-16 Grid: Core Workshop Focus & Capabilities */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column (5 of 12): Focus & Rules */}
              <div className="lg:col-span-5 bg-[#151517] border border-[#262626] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Wrench size={18} weight="bold" className="text-[#009FE3]" />
                    <h2 className="font-headline text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                      Værkstedets Fokus
                    </h2>
                  </div>

                  <ul className="space-y-3 text-xs sm:text-sm font-sans text-zinc-300">
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#009FE3] mt-1.5 shrink-0" />
                      <span><strong>Fysisk Prototyping:</strong> Fra CAD-skitse til håndgribelig prototype på få timer.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#009FE3] mt-1.5 shrink-0" />
                      <span><strong>Merch & Tekstil:</strong> Tryk t-shirts, muleposer og bannere med professionelle varmepressere.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#009FE3] mt-1.5 shrink-0" />
                      <span><strong>Materialekendskab:</strong> Arbejd med PLA, PETG, akryl, krydsfinér og varmeoverførselsfolie.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#262626]">
                  <Link
                    href="/craft/t-shirt"
                    className="inline-flex items-center justify-between w-full p-3 rounded-xl bg-[#202021] hover:bg-zinc-800 border border-[#333333] text-xs font-headline font-bold text-white transition-colors group"
                  >
                    <span>Se trin-for-trin guide til T-shirt tryk</span>
                    <ArrowUpRight size={14} weight="bold" className="text-[#009FE3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column (7 of 12): Active Machine Roster */}
              <div className="lg:col-span-7 bg-[#151517] border border-[#262626] rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkle size={18} weight="bold" className="text-[#009FE3]" />
                    <h2 className="font-headline text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                      Maskinpark i Makerspace
                    </h2>
                  </div>
                  <Link
                    href="/katalog"
                    className="text-xs font-mono text-[#009FE3] hover:underline"
                  >
                    Se hele kataloget →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {machines.map((machine, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#202021] border border-[#333333] space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#009FE3]">
                            {machine.type}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                            Ledig
                          </span>
                        </div>
                        <h3 className="font-headline text-sm font-bold text-white mt-1">
                          {machine.name}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500 block truncate">
                        {machine.location}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Safety & Protocol Banner */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#151517] border border-[#262626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} weight="bold" className="text-emerald-400 shrink-0" />
                  <h3 className="font-headline text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                    Sikkerhed & Adgangskrav
                  </h3>
                </div>
                <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-xl">
                  Brug af laserskærer og maskiner kræver en kort introduktion fra lab-vagten. 
                  Ryd altid op efter dig selv og bortskaf affaldsmaterialer i de dertil indrettede affaldsspande.
                </p>
              </div>

              <Link
                href="/katalog"
                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-[#009FE3] hover:bg-[#0089c4] text-black font-headline font-extrabold text-xs uppercase tracking-wider transition-colors shrink-0"
              >
                <span>Find Materialer i Kataloget</span>
                <ArrowUpRight size={14} weight="bold" />
              </Link>
            </div>
          </div>
        </main>

        <MarqueeRibbon />
        <LandingFooter className="mt-0" />
      </div>
    </CampusProvider>
  );
}
