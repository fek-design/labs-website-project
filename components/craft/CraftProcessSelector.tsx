"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { CraftProcess } from "@/lib/craft-data";

interface CraftProcessSelectorProps {
  processes: CraftProcess[];
}

export function CraftProcessSelector({ processes }: CraftProcessSelectorProps) {
  const [activeProcessId, setActiveProcessId] = useState<string>(processes[0]?.id || "print");
  const activeProcess = processes.find((p) => p.id === activeProcessId) || processes[0];

  return (
    <section className="w-full px-4 sm:px-6 max-w-4xl mx-auto space-y-6 sm:space-y-8 pt-4">
      {/* Section Header */}
      <div className="space-y-1">
        <h3 className="font-notch text-2xl sm:text-3xl font-light text-white tracking-tight uppercase">
          Type
        </h3>
        <p className="font-sans text-xs sm:text-sm text-zinc-400 font-light">
          Vælg produktionsmetode for at se maskiner, filkrav og tidsestimater.
        </p>
      </div>

      {/* Process Tabs matching Figma #144:553 */}
      <div className="flex items-center gap-3 sm:gap-4 border-b border-[#262626] pb-3">
        {processes.map((proc) => {
          const isActive = proc.id === activeProcessId;

          return (
            <button
              type="button"
              key={proc.id}
              onClick={() => setActiveProcessId(proc.id)}
              className="relative group p-3 sm:p-4 bg-[#151517] hover:bg-[#1a1a1e] border border-[#262626] rounded-none flex flex-col items-center justify-between w-24 sm:w-28 h-24 sm:h-28 transition-all cursor-pointer focus:outline-none touch-manipulation"
              aria-label={`Vælg ${proc.name}`}
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <Image
                  src={proc.iconImage || "/images/landing/carousel-tshirt.png"}
                  alt={proc.name}
                  fill
                  sizes="48px"
                  className="object-contain"
                />
              </div>

              <span
                className={`font-notch text-xs sm:text-sm uppercase tracking-wide transition-colors ${
                  isActive ? "text-white font-bold" : "text-zinc-400 group-hover:text-zinc-200"
                }`}
              >
                {proc.name}
              </span>

              {/* Animated active hairline indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeProcessUnderline"
                  className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-brand-cyan shadow-[0_0_10px_#009FE3]"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Machine Specifications Viewport matching Figma #144:240 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeProcess.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              {activeProcess.subtitle} • {activeProcess.machines.length} Maskine{activeProcess.machines.length > 1 ? "r" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {activeProcess.machines.map((machine) => (
              <div
                key={machine.id}
                className="w-full bg-[#151517] border border-[#262626] hover:border-zinc-500/50 rounded-none p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all group"
              >
                {/* Machine Photo Window */}
                <div className="relative w-full h-56 sm:h-64 bg-black/60 border border-[#262626] overflow-hidden flex items-center justify-center p-3">
                  <Image
                    src={machine.image}
                    alt={machine.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 bg-black/80 backdrop-blur-xs border border-white/10 text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Klar
                  </div>
                </div>

                {/* Machine Specs Content matching Figma #144:243 */}
                <div className="space-y-3">
                  <div className="border-b border-white/10 pb-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 block">
                      {machine.model}
                    </span>
                    <h4 className="font-notch text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                      {machine.name}
                    </h4>
                  </div>

                  {/* 3 Key Limits: Størrelse, Filformat, Tid */}
                  <div className="grid grid-cols-3 gap-2 py-1 font-mono text-[11px] sm:text-xs text-zinc-300">
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Max Størrelse</span>
                      <span className="font-semibold text-white truncate block">{machine.maxSize}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Filformat</span>
                      <span className="font-semibold text-white truncate block">{machine.fileFormat}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase">Tid</span>
                      <span className="font-semibold text-white truncate block">{machine.time}</span>
                    </div>
                  </div>

                  {/* Recommendation and finish note */}
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <p className="font-sans text-xs text-zinc-300 leading-relaxed font-light">
                      {machine.description}
                    </p>
                    <span className="block font-mono text-[11px] text-brand-cyan/90 font-light">
                      {machine.finishDetails}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
