"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { CraftManualReference } from "@/lib/craft-data";

interface CraftManualsSectionProps {
  manuals: CraftManualReference[];
}

export function CraftManualsSection({ manuals }: CraftManualsSectionProps) {
  return (
    <section className="w-full bg-white text-zinc-950 pb-16 sm:pb-24 px-4 sm:px-6 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Section Heading matching Figma #144:261 */}
        <div className="text-center space-y-2">
          <h3 className="font-notch text-2xl sm:text-4xl font-normal text-zinc-950 tracking-tight">
            Relevante Manualer
          </h3>
          <p className="font-sans text-xs sm:text-sm text-zinc-600 font-light max-w-md mx-auto">
            Gennemgå sikkerhedsinstrukser og vejledninger inden du starter maskinen.
          </p>
        </div>

        {/* 4 Cards Grid matching Figma #144:262 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {manuals.map((man, idx) => (
            <motion.a
              key={man.id}
              href={man.href || "/uploads/manuals/Makerspace_Universal_Safety_SOP_v2.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="bg-[#E9E9E9] hover:bg-[#dedede] border border-[#DFDFDF] hover:border-zinc-400 p-4 rounded-none flex flex-col items-center justify-between min-h-[140px] sm:min-h-[160px] text-center transition-all group cursor-pointer focus:outline-none"
            >
              {/* Silhouette / Thumbnail matching Figma #144:264 */}
              <div className="relative w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all">
                <Image
                  src="/images/landing/carousel-tshirt.png"
                  alt={man.title}
                  fill
                  sizes="64px"
                  className="object-contain filter grayscale"
                />
              </div>

              <div className="space-y-0.5 w-full">
                <span className="font-notch text-xs sm:text-sm font-bold text-zinc-950 block truncate group-hover:text-black">
                  {man.model}
                </span>
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block truncate">
                  {man.tag}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
