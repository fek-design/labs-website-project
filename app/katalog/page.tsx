import React from "react";
import { Metadata } from "next";
import { CampusProvider } from "@/components/landing/CampusContext";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { MarqueeRibbon } from "@/components/landing/MarqueeRibbon";
import { CatalogueGrid } from "@/components/catalogue/CatalogueGrid";

import { getCraftArticles } from "@/app/actions/crafts";
import { generateCatalogueSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Katalog — Udforsk Zealand Labs | Prototyper & Værksteder",
  description:
    "Gennemse det samlede katalog over prototyper, maskiner og digitale fabrikationsprocesser i Zealand Labs på tværs af Køge og Roskilde.",
};

export default async function CataloguePage() {
  const initialItems = await getCraftArticles();
  const catalogueSchema = generateCatalogueSchema(initialItems);

  return (
    <CampusProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogueSchema) }}
      />
      <div className="min-h-screen bg-black text-white selection:bg-brand-pink/30 selection:text-white flex flex-col justify-between overflow-x-hidden">
        {/* Sticky Header with Campus Switcher & Brand */}
        <LandingHeader />

        <main className="flex-1 w-full pt-20 sm:pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Catalogue Header Section - Asymmetrical Layout */}
            <div className="mb-8 sm:mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-[#262626] pb-6">
              <div className="flex flex-col items-start space-y-2 max-w-prose">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#009FE3]">
                  Zealand Labs / Inventory
                </span>
                <h1 className="font-notch text-3xl sm:text-5xl font-normal tracking-tight text-white uppercase">
                  Katalog
                </h1>
                {/* Cyan CMYK accent underline */}
                <div className="h-[2px] w-14 sm:w-20 bg-[#009FE3] mt-1" />
                <p className="mt-3 text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
                  Udforsk fysiske prototyper, maskiner og kreative processer tilgængelige for studerende og undervisere på Køge Campus.
                </p>
              </div>

              {/* Right Visual Metadata Badge */}
              <div className="hidden lg:flex items-center gap-3 shrink-0">
                <div className="px-4 py-2 bg-[#151517] border border-[#333333] rounded-lg text-left">
                  <div className="text-[10px] font-headline uppercase font-semibold text-zinc-400">Total Prototyper</div>
                  <div className="text-xl font-bold font-notch text-white leading-tight">{initialItems.length} Projekter</div>
                </div>
              </div>
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
