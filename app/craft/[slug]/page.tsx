import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CampusProvider } from "@/components/landing/CampusContext";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { getCraftItem, getAllCraftSlugs } from "@/lib/craft-data";
import { CraftHero } from "@/components/craft/CraftHero";
import { CraftPrerequisites } from "@/components/craft/CraftPrerequisites";
import { CraftProcessSelector } from "@/components/craft/CraftProcessSelector";
import { CraftInspirationGallery } from "@/components/craft/CraftInspirationGallery";
import { CraftManualsSection } from "@/components/craft/CraftManualsSection";
import { MarqueeRibbon } from "@/components/landing/MarqueeRibbon";

import { getCraftArticles } from "@/app/actions/crafts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const items = await getCraftArticles();
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const items = await getCraftArticles();
  const item = items.find((i) => i.slug.toLowerCase() === slug.toLowerCase()) || getCraftItem(slug);

  if (!item) {
    return {
      title: "Værksted & Prototype | Zealand Labs",
    };
  }

  return {
    title: `${item.title} — Sådan laver du den | Zealand Labs`,
    description: `Få overblik over maskiner, forudsætninger og tidsestimater til fremstilling af ${item.title} i Zealand Labs.`,
  };
}

export default async function CraftItemPage({ params }: PageProps) {
  const { slug } = await params;
  const items = await getCraftArticles();
  const item = items.find((i) => i.slug.toLowerCase() === slug.toLowerCase()) || getCraftItem(slug);

  if (!item) {
    notFound();
  }

  return (
    <CampusProvider>
      <div className="min-h-screen bg-black text-white selection:bg-brand-pink/30 selection:text-white flex flex-col justify-between overflow-x-hidden">
        {/* Fixed Navigation with Campus Context */}
        <LandingHeader />

        <main className="flex-1 w-full">
          {/* Upper Sections with Flow Spacing */}
          <div className="space-y-10 sm:space-y-14">
            {/* Hero Photography & Location Hours */}
            <CraftHero item={item} />

            {/* Cyan High-Contrast Prerequisites Block */}
            <CraftPrerequisites prerequisites={item.prerequisites} />

            {/* Process Switcher & Machine Limit Cards */}
            <CraftProcessSelector processes={item.processes} />
          </div>

          {/* Canonical Running Ticker Marquee with No Surrounding Padding Space */}
          <MarqueeRibbon />

          {/* Contiguous White Zone: Inspiration Gallery & Manuals */}
          <div className="w-full bg-white text-zinc-950 transition-colors">
            <CraftInspirationGallery items={item.inspiration} />
            <CraftManualsSection manuals={item.manuals} />
          </div>
        </main>

        {/* Brand Cyan Footer directly connected with zero margin */}
        <LandingFooter className="mt-0" />
      </div>
    </CampusProvider>
  );
}
