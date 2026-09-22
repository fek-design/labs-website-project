import React from "react";
import { prisma } from "@/lib/prisma";
import { CampusProvider } from "@/components/landing/CampusContext";
import { FirstTimeCampusGate } from "@/components/landing/FirstTimeCampusGate";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { MarqueeRibbon } from "@/components/landing/MarqueeRibbon";
import { PrototypeCarousel } from "@/components/landing/PrototypeCarousel";
import { HotspotShowcase } from "@/components/landing/HotspotShowcase";
import { CampusLabExplorer } from "@/components/landing/CampusLabExplorer";
import {
  MachineTelemetrySection,
  CampusTelemetryCatalog,
  MachineItem,
} from "@/components/landing/MachineTelemetrySection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default async function LandingPage() {
  const catalog: CampusTelemetryCatalog = {
    køge: {
      makerspace: { count: 0, items: [] },
      medialab: { count: 0, items: [] },
      dimselab: { count: 0, items: [] },
    },
    roskilde: {
      makerspace: { count: 0, items: [] },
      medialab: { count: 0, items: [] },
      dimselab: { count: 0, items: [] },
    },
  };

  let fallbackMachineCount = 10;
  let fallbackMachines: MachineItem[] = [];

  try {
    const allDbInventory = await prisma.inventory.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        operationalStatus: true,
        hardwareType: true,
        imageUrl: true,
        lab: {
          select: {
            slug: true,
            campus: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    for (const item of allDbInventory) {
      const isRoskilde =
        item.lab.campus.toLowerCase().includes("roskilde") ||
        item.lab.slug === "roskilde";
      const campusKey = isRoskilde ? "roskilde" : "køge";

      let labKey: "makerspace" | "medialab" | "dimselab" = "makerspace";

      if (isRoskilde) {
        const loc = item.location?.toLowerCase() || "";
        const tagSlugs = item.tags.map((t) => t.tag.slug.toLowerCase());
        const isDimse =
          loc.includes("dimse") ||
          tagSlugs.includes("electronics") ||
          tagSlugs.includes("soldering-smd");
        const isMedia =
          item.hardwareType === "BORROWABLE_GEAR" ||
          loc.includes("media") ||
          tagSlugs.some((s) => s.includes("media") || s.includes("audio") || s.includes("camera") || s.includes("lighting"));

        if (isDimse) {
          labKey = "dimselab";
        } else if (isMedia) {
          labKey = "medialab";
        } else {
          labKey = "makerspace";
        }
      } else {
        // Køge
        if (
          item.lab.slug === "medialab" ||
          item.hardwareType === "BORROWABLE_GEAR"
        ) {
          labKey = "medialab";
        } else {
          labKey = "makerspace";
        }
      }

      const cleanItem: MachineItem = {
        id: item.id,
        name: item.name,
        location: item.location,
        operationalStatus: item.operationalStatus,
        hardwareType: item.hardwareType,
        imageUrl: item.imageUrl,
      };

      catalog[campusKey][labKey].items.push(cleanItem);
      catalog[campusKey][labKey].count += 1;
    }

    fallbackMachineCount = catalog.køge.makerspace.count;
    fallbackMachines = catalog.køge.makerspace.items;
  } catch (error) {
    console.warn("Database inventory query falling back to static defaults:", error);
  }

  return (
    <CampusProvider>
      {/* Location picker intro gate (always shown on load) */}
      <FirstTimeCampusGate forceShow={true} />

      <div className="min-h-screen bg-black text-white selection:bg-brand-pink/30 selection:text-white flex flex-col justify-between overflow-x-hidden">
        {/* Fixed/Overlay Navigation with Campus Switcher */}
        <LandingHeader />

        <main className="flex-1 w-full">
          {/* Hero Section */}
          <HeroSection />

          {/* Running Ticker Marquee (Dual-track seamless loop) */}
          <MarqueeRibbon />

          {/* Contiguous High-Contrast White Showcase Zone (Prototype Carousel & Image Gallery) */}
          <div className="w-full bg-white text-zinc-950 transition-colors duration-300">
            <PrototypeCarousel />
            <HotspotShowcase />
          </div>

          {/* Dynamic Location-Aware Lab Tabs & Synchronized Spotlight Showcase */}
          <CampusLabExplorer />

          {/* Real-time Hardware Telemetry & Machines (Autoscrolling Clipped 3-Card List) */}
          <MachineTelemetrySection
            machineCount={fallbackMachineCount}
            machines={fallbackMachines}
            catalog={catalog}
          />
        </main>

        {/* Brand Cyan Footer */}
        <LandingFooter />
      </div>
    </CampusProvider>
  );
}
