"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { CraftItemData } from "@/lib/craft-data";

interface CraftHeroProps {
  item: CraftItemData;
}

export function CraftHero({ item }: CraftHeroProps) {
  return (
    <section className="w-full bg-black text-white pt-24 sm:pt-28 pb-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Top Back Link */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/#prototypes"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer group"
        >
          <span className="text-zinc-600 group-hover:text-brand-cyan transition-colors">←</span>
          <span>Tilbage til prototyper</span>
        </Link>
      </motion.div>

      {/* Hero Visual Image Banner with Subtle Zoom on Hover */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full h-[320px] sm:h-[440px] md:h-[500px] overflow-hidden rounded-none border border-[#262626] bg-[#151517] shadow-2xl"
      >
        <Image
          src={item.heroImage}
          alt={item.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 896px"
          className="object-cover object-center filter contrast-[1.03]"
        />
        {/* Subtle Bottom Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Micro Category Badge in Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-block px-3 py-1 bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono uppercase tracking-widest text-zinc-300">
            {item.category}
          </span>
        </div>
      </motion.div>

      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-2"
      >
        <h1 className="font-notch text-4xl sm:text-6xl md:text-7xl font-light text-white tracking-tight uppercase leading-none">
          {item.title}
        </h1>
      </motion.div>

      {/* Location & Opening Hours Card matching Figma #144:533 */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full bg-[#151517] border border-[#262626] p-4 sm:p-6 rounded-none space-y-3"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-headline text-xs sm:text-sm font-semibold text-white tracking-wide uppercase">
            Tilgængelige Lokationer & Åbningstider
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 pt-1">
          {item.locations.map((loc, idx) => (
            <div key={idx} className="space-y-0.5 border-l-2 border-brand-cyan/60 pl-3">
              <span className="font-notch text-sm sm:text-base font-normal text-white block">
                {loc.name}
              </span>
              <span className="font-sans text-xs sm:text-sm text-zinc-400 font-light block">
                {loc.hours}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
