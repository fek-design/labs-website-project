"use client";

import React from "react";
import { motion } from "motion/react";
import { Warning, Timer, GraduationCap } from "@phosphor-icons/react";

interface CraftPrerequisitesProps {
  prerequisites: {
    materials: string;
    estimatedTime: string;
    difficulty: string;
  };
}

export function CraftPrerequisites({ prerequisites }: CraftPrerequisitesProps) {
  return (
    <section className="w-full px-4 sm:px-6 max-w-4xl mx-auto">
      {/* High-Impact Cyan Prerequisites Block matching Figma #144:229 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full bg-[#009FE3] text-white p-6 sm:p-10 rounded-none shadow-2xl relative overflow-hidden group"
      >
        {/* Subtle dynamic background graphic element */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

        <div className="relative z-10 space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <h3 className="font-notch text-2xl sm:text-3xl font-bold tracking-tight uppercase">
              Forudsætninger
            </h3>
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest bg-black/20 px-2.5 py-1 text-white/90">
              Huskeliste
            </span>
          </div>

          <ul className="space-y-3.5 sm:space-y-4 font-sans text-sm sm:text-base font-medium">
            <li className="flex items-start gap-3">
              <Warning size={20} weight="bold" className="shrink-0 text-white mt-0.5" aria-hidden="true" />
              <span className="leading-snug text-white/95">
                {prerequisites.materials}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Timer size={20} weight="bold" className="shrink-0 text-white mt-0.5" aria-hidden="true" />
              <span className="leading-snug text-white/95">
                {prerequisites.estimatedTime}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <GraduationCap size={20} weight="bold" className="shrink-0 text-white mt-0.5" aria-hidden="true" />
              <span className="leading-snug text-white/95">
                {prerequisites.difficulty}
              </span>
            </li>
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
