import React from "react";
import { prisma } from "@/lib/prisma";
import { CampusProvider } from "@/components/landing/CampusContext";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { MarqueeRibbon } from "@/components/landing/MarqueeRibbon";
import { PrototypeCarousel } from "@/components/landing/PrototypeCarousel";
import { HotspotShowcase } from "@/components/landing/HotspotShowcase";
import { CampusLabExplorer } from "@/components/landing/CampusLabExplorer";
import { MachineTelemetrySection } from "@/components/landing/MachineTelemetrySection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default async function LandingPage() {
  let machineCount = 10;
  let machines: { id: string; name: string; location?: string | null; operationalStatus?: string | null }[] = [];

  try {
    const [dbMachineCount, dbMachines] = await Promise.all([
      prisma.inventory.count({ where: { hardwareType: "STATIC_MACHINE" } }),
      prisma.inventory.findMany({
        where: { hardwareType: "STATIC_MACHINE" },
        select: {
          id: true,
          name: true,
          location: true,
          operationalStatus: true,
        },
        orderBy: { name: "asc" },
      }),
    ]);
    if (dbMachineCount > 0) {
      machineCount = dbMachineCount;
      machines = dbMachines;
    }
  } catch (error) {
    console.warn("Database machine query falling back to static defaults:", error);
  }

  return (
    <CampusProvider>
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
          <MachineTelemetrySection machineCount={machineCount} machines={machines} />
        </main>

        {/* Brand Cyan Footer */}
        <LandingFooter />
      </div>
    </CampusProvider>
  );
}
