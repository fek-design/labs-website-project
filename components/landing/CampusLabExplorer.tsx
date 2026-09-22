"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCampus, LAB_CMYK_TOKENS } from "./CampusContext";

export function CampusLabExplorer() {
  const { currentLabs, activeLabId, setActiveLabId, activeLab, campus } = useCampus();
  const activeCmyk = LAB_CMYK_TOKENS[activeLab.id] || LAB_CMYK_TOKENS.makerspace;
  const isLightAccent = activeLab.id === "dimselab" || activeLab.id === "makerspace";

  return (
    <div id="support-pillars" className="w-full bg-black text-white py-12 sm:py-16 transition-colors duration-300">
      {/* Prototyping & Understøttelse Section */}
      <section className="w-full px-4 sm:px-6 max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="space-y-5 sm:space-y-6 max-w-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full transition-colors"
                style={{ backgroundColor: activeLab.accentColor }}
              />
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Campus {campus.toUpperCase()} • {currentLabs.length} LABORATORIER
              </span>
            </div>
            <h2 className="font-notch text-2xl sm:text-4xl md:text-5xl font-light text-white tracking-tight leading-tight">
              Prototyping &
              <br />
              Understøttelse
            </h2>
          </div>

          {/* Dynamic Bullet Points for Selected Lab */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={activeLab.id}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-2.5 sm:space-y-3 font-sans text-xs sm:text-base text-zinc-300 font-light min-h-[90px] sm:min-h-[100px]"
            >
              {activeLab.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors"
                    style={{ backgroundColor: activeLab.accentColor }}
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>

          {/* Dynamic Step Indicator Tabs based on active campus lab count */}
          <div className="pt-2 border-t border-white/15">
            <div className="flex items-center gap-2 sm:gap-3">
              {currentLabs.map((lab) => {
                const isActive = lab.id === activeLabId;
                return (
                  <button
                    type="button"
                    key={lab.id}
                    onClick={() => setActiveLabId(lab.id)}
                    className="flex-1 group py-2.5 sm:py-3 text-left focus:outline-none cursor-pointer min-h-[44px] touch-manipulation"
                    aria-label={`Vælg ${lab.name}`}
                  >
                    {/* The Line Indicator */}
                    <span
                      className="block h-1.5 w-full rounded-full transition-all duration-300 pointer-events-none"
                      style={{
                        backgroundColor: isActive ? lab.accentColor : "rgba(255, 255, 255, 0.2)",
                        boxShadow: isActive ? `0 2px 8px ${lab.accentColor}66` : "none",
                      }}
                    />
                    {/* Lab Title below line */}
                    <span
                      className={`block text-[11px] sm:text-sm font-notch uppercase tracking-wider mt-2 transition-colors truncate ${isActive
                          ? "text-white font-bold"
                          : "text-zinc-400 group-hover:text-zinc-200"
                        }`}
                    >
                      {lab.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Synchronized Spotlight Card with Lab CMYK Color */}
      <section className="w-full pt-6 sm:pt-8 px-4 sm:px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeLab.id}
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            style={{ backgroundColor: activeLab.accentColor }}
            className={`w-full ${isLightAccent ? "text-zinc-950 border-black/10" : "text-white border-white/15"
              } p-5 sm:p-10 md:p-12 rounded-none border space-y-3 sm:space-y-4 shadow-none min-h-[200px] sm:min-h-[220px] flex flex-col justify-center transition-colors duration-300`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
              <h3 className="font-notch text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                {activeLab.name}
              </h3>
              <span
                className={`self-start sm:self-auto text-[11px] sm:text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full ${isLightAccent
                    ? "bg-black/10 text-zinc-900 border border-black/15"
                    : "bg-black/20 text-white/90 border border-white/20"
                  } backdrop-blur-xs`}
              >
                {campus} • {activeCmyk.name}
              </span>
            </div>
            <p
              className={`font-sans text-xs sm:text-base md:text-lg font-light ${isLightAccent ? "text-zinc-900" : "text-white/95"
                } leading-relaxed max-w-3xl`}
            >
              {activeLab.spotlightText}
            </p>
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
