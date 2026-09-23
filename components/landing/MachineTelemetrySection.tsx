"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCampus } from "./CampusContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface MachineItem {
  id: string;
  name: string;
  location?: string | null;
  operationalStatus?: string | null;
  hardwareType?: string | null;
  imageUrl?: string | null;
}

export interface LabTelemetryData {
  count: number;
  items: MachineItem[];
}

export type CampusTelemetryCatalog = Record<
  "køge" | "roskilde",
  Record<string, LabTelemetryData>
>;

export function formatMilestoneCount(count: number): string {
  if (count < 5) return `${count}`;
  const floored = Math.floor(count / 5) * 5;
  return `${floored}+`;
}

interface LabSemanticConfig {
  statLabel: string;
  headline: React.ReactNode;
  description: string;
  defaultLocation: string;
  fallbackItems: MachineItem[];
}

const LAB_SEMANTICS: Record<string, LabSemanticConfig> = {
  makerspace: {
    statLabel: "Maskiner",
    headline: (
      <>
        Vi har sikkert en maskine
        <br />
        til dit formål
      </>
    ),
    description:
      "Få fri adgang til industrielt hardware til rapid prototyping. Tjek maskinens live-status og opsætning hjemmefra, mød op, scan QR-koden, og begynd at bygge.",
    defaultLocation: "Makerspace Workstation",
    fallbackItems: [
      { id: "fb-m1", name: "Original Prusa MK4", location: "Makerspace - 3D Lab", operationalStatus: "AVAILABLE" },
      { id: "fb-m2", name: "Bambu Lab X1-Carbon Combo", location: "Makerspace - 3D Lab", operationalStatus: "AVAILABLE" },
      { id: "fb-m3", name: "Flux Beambox Pro 50W Laser", location: "Makerspace - Laser Cut", operationalStatus: "AVAILABLE" },
      { id: "fb-m4", name: "Brother GTX Pro DTG Printer", location: "Makerspace - Tekstil", operationalStatus: "AVAILABLE" },
      { id: "fb-m5", name: "Epilog Zing 24 Laser", location: "Makerspace - Laser Cut", operationalStatus: "AVAILABLE" },
      { id: "fb-m6", name: "Formlabs Form 4 SLA", location: "Makerspace - Precision", operationalStatus: "MAINTENANCE" },
    ],
  },
  medialab: {
    statLabel: "Udstyrsenheder",
    headline: (
      <>
        Vi har sikkert udstyret
        <br />
        til dit formål
      </>
    ),
    description:
      "Få fri adgang til professionelt medie- og AV-udstyr. Tjek tilgængelighed i realtid, reserver til dine produktioner, og hent udstyret i laboratoriet.",
    defaultLocation: "Medialab Udlån",
    fallbackItems: [
      { id: "fb-ml1", name: "Sony FX30 Cinema Kit", location: "Medialab - Udlån", operationalStatus: "AVAILABLE" },
      { id: "fb-ml2", name: "RØDE Wireless PRO Dual Mic", location: "Medialab - Lyd", operationalStatus: "AVAILABLE" },
      { id: "fb-ml3", name: "Aputure Amaran 200d S LED", location: "Medialab - Lys", operationalStatus: "AVAILABLE" },
      { id: "fb-ml4", name: "Meta Quest 3 512GB VR", location: "Medialab - XR", operationalStatus: "AVAILABLE" },
      { id: "fb-ml5", name: "Sony Alpha A7 IV Full-Frame", location: "Medialab - Udlån", operationalStatus: "AVAILABLE" },
      { id: "fb-ml6", name: "Shure SM7B Podcast Mic", location: "Medialab - Lyd", operationalStatus: "AVAILABLE" },
    ],
  },
  dimselab: {
    statLabel: "Hardware & Værktøj",
    headline: (
      <>
        Vi har grejet
        <br />
        til dit projekt
      </>
    ),
    description:
      "Udforsk microcontroller-programmering, sensorer og interaktive installationer. Her finder du loddeudstyr, måleinstrumenter og komponenter til dine fysiske prototyper.",
    defaultLocation: "Dimselab Værksted",
    fallbackItems: [
      { id: "fb-d1", name: "Hakko FX-888D Loddestation", location: "Dimselab - Værksted", operationalStatus: "AVAILABLE" },
      { id: "fb-d2", name: "Rigol DS1054Z Oscilloskop", location: "Dimselab - Målebænk", operationalStatus: "AVAILABLE" },
      { id: "fb-d3", name: "Arduino Mega 2560 IoT Kit", location: "Dimselab - Komponenter", operationalStatus: "AVAILABLE" },
      { id: "fb-d4", name: "Raspberry Pi 5 Lab Starter", location: "Dimselab - Komponenter", operationalStatus: "AVAILABLE" },
      { id: "fb-d5", name: "Quick 861DW Varmluftstation", location: "Dimselab - Værksted", operationalStatus: "AVAILABLE" },
      { id: "fb-d6", name: "ESP32-S3 AI & Vision Dev Kit", location: "Dimselab - Komponenter", operationalStatus: "AVAILABLE" },
    ],
  },
};

interface MachineTelemetryProps {
  machineCount?: number;
  machines?: MachineItem[];
  catalog?: CampusTelemetryCatalog;
}

export function MachineTelemetrySection({
  machineCount = 10,
  machines = [],
  catalog,
}: MachineTelemetryProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { campus, activeLabId } = useCampus();

  useGSAP(
    () => {
      // Header reveal
      gsap.from(".gsap-telemetry-header", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 24,
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
      });

      // Left stat block reveal
      gsap.from(".gsap-telemetry-stat", {
        scrollTrigger: {
          trigger: ".gsap-telemetry-stat",
          start: "top 88%",
          toggleActions: "play none none none",
        },
        y: 28,
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
      });

      // Right viewport reveal
      gsap.from(".gsap-telemetry-viewport", {
        scrollTrigger: {
          trigger: ".gsap-telemetry-viewport",
          start: "top 88%",
          toggleActions: "play none none none",
        },
        y: 28,
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  // Determine the active semantics (Makerspace vs Medialab vs Dimselab)
  const semantics = LAB_SEMANTICS[activeLabId] || LAB_SEMANTICS.makerspace;

  // Retrieve data from prehydrated catalog if available, matching campus & active lab
  const campusData = catalog ? catalog[campus] : null;
  const labData = campusData ? campusData[activeLabId] : null;

  // Items resolution: catalog -> legacy props -> fallback semantic items
  let activeItems: MachineItem[] = [];
  let rawCount = 0;

  if (labData && labData.items && labData.items.length > 0) {
    activeItems = labData.items;
    rawCount = labData.count;
  } else if (machines.length > 0 && activeLabId === "makerspace") {
    activeItems = machines;
    rawCount = machines.length;
  } else {
    activeItems = semantics.fallbackItems;
    rawCount = semantics.fallbackItems.length;
  }

  const formattedCount = formatMilestoneCount(rawCount);

  // If fewer than 4 items, repeat to provide enough vertical height for continuous autoscroll
  const workingSet = activeItems.length < 4
    ? [...activeItems, ...activeItems, ...activeItems, ...activeItems].slice(0, 8)
    : activeItems;

  // Duplicate for seamless 0% -> -50% infinite translation loop
  const tickerItems = [...workingSet, ...workingSet];

  // Pick contextual icon based on active lab
  const defaultItemImage =
    activeLabId === "medialab"
      ? "/images/landing/showcase-camera.png"
      : activeLabId === "dimselab"
      ? "/images/landing/showcase-3dprint.png"
      : "/images/landing/machine-prusa.png";

  return (
    <section
      ref={containerRef}
      id="machines"
      className="w-full bg-black text-white py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-10 transition-all duration-300"
    >
      {/* Dynamic Headings based on Active Lab */}
      <div className="gsap-telemetry-header space-y-3 sm:space-y-4 max-w-2xl">
        <h2 className="font-notch text-2xl sm:text-4xl md:text-5xl font-light text-white tracking-tight leading-tight">
          {semantics.headline}
        </h2>
        <p className="font-sans text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
          {semantics.description}
        </p>
      </div>

      {/* Grid: Stat Counter on Left, Clipped Autoscrolling Cards on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left Stat Counter */}
        <div className="gsap-telemetry-stat md:col-span-4 flex flex-col justify-center">
          <span className="font-sans text-xs sm:text-base font-semibold text-white/80">
            {semantics.statLabel}
          </span>
          <span className="font-notch text-5xl sm:text-7xl md:text-8xl font-extrabold text-white tracking-tighter leading-none mt-1">
            {formattedCount}
          </span>
          <span className="text-[11px] sm:text-xs text-zinc-500 font-mono mt-2 sm:mt-3">
            Realtidsstatus fra Zealand Labs ({campus.toUpperCase()})
          </span>
        </div>

        {/* Right Machine Status Viewport - Fixed 3 Cards Height (~270px), Clipped, Autoscrolling */}
        <div className="gsap-telemetry-viewport md:col-span-8 relative h-[270px] overflow-hidden rounded-xl border border-[#262626] bg-[#0c0c0e]/80 p-2 shadow-2xl">
          {/* Top & bottom edge gradient fades */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#0c0c0e] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#0c0c0e] to-transparent z-10" />

          {/* Autoscrolling Track Container with key reset for smooth transition on campus/lab switch */}
          <div
            key={`${campus}-${activeLabId}`}
            className="animate-telemetry-vertical gap-2 sm:gap-2.5 active:[animation-play-state:paused] hover:[animation-play-state:paused]"
          >
            {tickerItems.map((item, idx) => {
              const isAvail = item.operationalStatus === "AVAILABLE" || !item.operationalStatus;
              const isMaint = item.operationalStatus === "MAINTENANCE";

              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="w-full bg-[#141416] border border-[#262626] rounded-lg p-2.5 sm:p-3.5 flex items-center justify-between gap-3 sm:gap-4 hover:border-white/30 hover:shadow-lg transition-all flex-shrink-0 cursor-default"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-md bg-[#18181b] border border-[#262626] overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imageUrl || defaultItemImage}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-sans text-xs sm:text-base font-bold text-white tracking-tight truncate">
                        {item.name}
                      </h4>
                      <span className="block font-sans text-[11px] sm:text-xs text-zinc-400 truncate">
                        {item.location || semantics.defaultLocation}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 pr-1 sm:pr-2 flex-shrink-0">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isAvail
                          ? "bg-emerald-400 animate-pulse"
                          : isMaint
                          ? "bg-brand-yellow"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="font-sans text-[11px] sm:text-xs font-semibold text-zinc-300">
                      {isAvail ? "Klar" : isMaint ? "Service" : "Optaget"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
