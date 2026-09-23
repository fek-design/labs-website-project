"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { CraftInspirationItem } from "@/lib/craft-data";

interface CraftInspirationGalleryProps {
  items: CraftInspirationItem[];
}

export function CraftInspirationGallery({ items }: CraftInspirationGalleryProps) {
  const smallCards = items.filter((item) => !item.isLarge);
  const largeCards = items.filter((item) => item.isLarge);

  return (
    <section className="w-full bg-white text-zinc-950 py-12 sm:py-16 px-4 sm:px-6 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Section Heading matching Figma #144:251 */}
        <div className="text-center space-y-2">
          <h3 className="font-notch text-2xl sm:text-4xl font-normal text-zinc-950 tracking-tight">
            Andre har lavet
          </h3>
          <p className="font-sans text-xs sm:text-sm text-zinc-600 font-light max-w-md mx-auto">
            Se eksempler på studerendes egne projekter, merch og prototyper lavet med maskinerne.
          </p>
        </div>

        {/* Gallery Grid matching Figma #144:252 */}
        <div className="space-y-4 sm:space-y-6">
          {/* Top Row: 2 Parallel Visual Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {smallCards.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative h-64 sm:h-80 bg-zinc-100 border border-[#DFDFDF] overflow-hidden group rounded-none shadow-xs"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 440px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top-Left Process & Time Badge matching Figma #144:254 */}
                <div className="absolute top-3 left-3 z-10 bg-black/75 backdrop-blur-xs px-3 py-2 border border-white/10 text-white rounded-none space-y-0.5 pointer-events-none">
                  <span className="font-sans text-xs sm:text-sm font-semibold block leading-tight">
                    {item.process}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-300 block font-light leading-none">
                    {item.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Row: Full-Width Feature Card matching Figma #144:257 */}
          {largeCards.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45 }}
              className="relative h-80 sm:h-[440px] md:h-[500px] w-full bg-zinc-100 border border-[#DFDFDF] overflow-hidden group rounded-none shadow-xs"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Badge */}
              <div className="absolute top-4 left-4 z-10 bg-black/75 backdrop-blur-xs px-3.5 py-2.5 border border-white/10 text-white rounded-none space-y-0.5 pointer-events-none">
                <span className="font-sans text-xs sm:text-base font-semibold block leading-tight">
                  {item.process}
                </span>
                <span className="font-mono text-[11px] sm:text-xs text-zinc-300 block font-light leading-none">
                  {item.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
