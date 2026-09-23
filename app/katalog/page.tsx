import React from "react";
import { Metadata } from "next";
import { CampusProvider } from "@/components/landing/CampusContext";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { MarqueeRibbon } from "@/components/landing/MarqueeRibbon";
import { CatalogueGrid } from "@/components/catalogue/CatalogueGrid";

import { getCraftArticles } from "@/app/actions/crafts";

export const metadata: Metadata = {
  title: "Katalog — Udforsk Zealand Labs | Prototyper & Værksteder",
  description:
    "Gennemse det samlede katalog over prototyper, maskiner og digitale fabrikationsprocesser i Zealand Labs på tværs af Køge og Roskilde.",
};

export default async function CataloguePage() {
  const initialItems = await getCraftArticles();

  return (
    <CampusProvider>
      <div className="min-h-screen bg-black text-white selection:bg-brand-pink/30 selection:text-white flex flex-col justify-between overflow-x-hidden">
        {/* Sticky Header with Campus Switcher & Brand */}
        <LandingHeader />

        <main className="flex-1 w-full pt-20 sm:pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Catalogue Header Section - Figma frame 144:354 */}
            <div className="mb-8 sm:mb-10">
              <div className="flex flex-col items-start space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#009FE3]">
                  Zealand Labs / Inventory
                </span>
                <h1 className="font-notch text-3xl sm:text-5xl font-normal tracking-tight text-white uppercase">
                  Katalog
                </h1>
                {/* Cyan CMYK accent underline - Figma frame 144:359 */}
                <div className="h-[2px] w-14 sm:w-20 bg-[#009FE3] mt-1" />
              </div>
              <p className="mt-3 text-sm sm:text-base text-zinc-400 font-sans max-w-xl">
                Udforsk fysiske prototyper, maskiner og kreative processer tilgængelige for studerende og undervisere.
              </p>
            </div>

            {/* Interactive Catalogue Grid with QOL Filters */}
            <CatalogueGrid initialItems={initialItems} />
          </div>
        </main>

        {/* Marquee Ribbon - Figma node 144:432 */}
        <MarqueeRibbon />

        {/* Global Footer */}
        <LandingFooter className="mt-0" />
      </div>
    </CampusProvider>
  );
}
