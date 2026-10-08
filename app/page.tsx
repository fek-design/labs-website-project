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
import { getCraftArticles } from "@/app/actions/crafts";

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

  let featuredCrafts: any[] = [];
  try {
    const allCraftArticles = await getCraftArticles();
    featuredCrafts = allCraftArticles
      .filter((c) => c.isFeaturedOnFrontpage)
      .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999))
      .slice(0, 5);
  } catch (craftErr) {
    console.warn("Could not fetch featured craft articles:", craftErr);
  }

  try {
    const kogeInventory = await prisma.inventory.findMany({
      where: {
        lab: {
          slug: {
            in: ["makerspace", "medialab"],
          },
        },
      },
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
      },
      orderBy: { name: "asc" },
    });

    for (const item of kogeInventory) {
      const labKey = item.lab.slug as "makerspace" | "medialab";
      if (labKey === "makerspace" || labKey === "medialab") {
        const cleanItem: MachineItem = {
          id: item.id,
          name: item.name,
          location: item.location,
          operationalStatus: item.operationalStatus,
          hardwareType: item.hardwareType,
          imageUrl: item.imageUrl,
        };

        catalog.køge[labKey].items.push(cleanItem);
        catalog.køge[labKey].count += 1;
      }
    }

    fallbackMachineCount = catalog.køge.makerspace.count;
    fallbackMachines = catalog.køge.makerspace.items;
  } catch (error) {
    console.warn("Database inventory query falling back to static defaults:", error);
  }

  return (
    <CampusProvider>
      {/* Location picker intro gate (shown on first visit) */}
      <FirstTimeCampusGate />

      <div className="min-h-screen bg-black text-white selection:bg-brand-pink/30 selection:text-white flex flex-col justify-between overflow-x-hidden">
        {/* Fixed/Overlay Navigation with Campus Switcher */}
        <LandingHeader />

        <main id="main-content" className="flex-1 w-full">
          {/* Hero Section */}
          <HeroSection />

          {/* Running Ticker Marquee (Dual-track seamless loop) */}
          <MarqueeRibbon />

          {/* Contiguous High-Contrast White Showcase Zone (Prototype Carousel & Image Gallery) */}
          <div className="w-full bg-white text-zinc-950 transition-colors duration-300">
            <PrototypeCarousel items={featuredCrafts} />
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
