"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface HotspotProps {
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  category?: string;
  linkHref?: string;
  defaultActive?: boolean;
}

function HotspotBeacon({ x, y, title, category, linkHref, defaultActive = false }: HotspotProps) {
  const [active, setActive] = useState(defaultActive);

  // Prevent tooltips near screen edges from clipping on narrow mobile screens
  const tooltipAlignClass =
    x > 65
      ? "right-0 translate-x-3"
      : x < 35
        ? "left-0 -translate-x-3"
        : "left-1/2 -translate-x-1/2";

  return (
    <div
      className="absolute z-20"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      {/* Beacon Trigger with 44px Touch Target */}
      <button
        type="button"
        onClick={() => setActive(!active)}
        onMouseEnter={() => setActive(true)}
        className="relative group flex items-center justify-center w-11 h-11 -m-1.5 rounded-full focus:outline-none cursor-pointer touch-manipulation"
        aria-label={`Inspect ${title}`}
      >
        <span className="absolute w-7 h-7 rounded-full border-2 border-white bg-black/40 backdrop-blur-xs transition-transform group-hover:scale-110 group-active:scale-95" />
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping opacity-75 pointer-events-none" />
        <span className="absolute w-2 h-2 rounded-full bg-white pointer-events-none" />
      </button>

      {/* Spacious Clickable Popover Card with Tactile Spring Physics */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8, transition: { duration: 0.15 } }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 18,
              mass: 0.7,
            }}
            className={`absolute ${tooltipAlignClass} bottom-full mb-3 z-30 pointer-events-auto w-60 sm:w-64 max-w-[calc(100vw-48px)]`}
          >
            <a
              href={linkHref || "#support-pillars"}
              className="block bg-white text-black p-4 sm:p-5 shadow-2xl border border-[#DFDFDF] rounded-none group/card hover:border-black/40 transition-all active:scale-[0.98] cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-500">
                    {category || "PROJEKT"}
                  </span>
                </div>
                <h4 className="font-notch text-sm sm:text-base font-bold text-zinc-950 tracking-tight leading-snug">
                  {title}
                </h4>
                <div className="font-sans text-xs text-zinc-600 font-light flex items-center justify-between pt-2 border-t border-zinc-100">
                  <span>Udforsk faciliteter</span>
                  <span className="font-bold text-black transition-transform group-hover/card:translate-x-1">→</span>
                </div>
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HotspotShowcase() {
  return (
    <section id="showcase" className="w-full bg-white text-zinc-950 pt-10 sm:pt-16 md:pt-20 pb-16 sm:pb-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-6">
        {/* Row 1 (1x1): Primary Feature Card: Textile Print */}
        <div className="relative w-full h-[360px] sm:h-[500px] md:h-[580px] rounded-none group border border-[#DFDFDF] shadow-none">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Image
              src="/images/landing/showcase-textile.jpg"
              alt="Student model showcasing custom textile printing"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              quality={85}
              className="object-cover object-center filter contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
          </div>

          {/* Category Label */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10 text-white font-sans pointer-events-none">
            <span className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
              Makerspace
            </span>
            <span className="text-base sm:text-lg font-bold tracking-tight">
              Print på tekstil
            </span>
          </div>

          {/* Hotspots */}
          <HotspotBeacon x={58} y={15} title="Print på Kasket" category="Makerspace" linkHref="#support-pillars" />
          <HotspotBeacon x={54} y={54} title="Print på T-Shirt" category="Makerspace" linkHref="#support-pillars" defaultActive={true} />
        </div>

        {/* Row 2 (1x2): Two Column Grid: Medialab Posters & Cameras */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {/* Poster Print */}
          <div className="relative h-[220px] sm:h-[340px] md:h-[380px] rounded-none group border border-[#DFDFDF] shadow-none">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/landing/showcase-poster.jpg"
                alt="Medialab wide format poster printing gallery"
                fill
                sizes="(max-width: 768px) 50vw, 600px"
                quality={85}
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
            </div>
            <div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-10 text-white font-sans pointer-events-none">
              <span className="block text-[10px] sm:text-xs font-semibold text-white/70 uppercase tracking-wider">
                Medialab
              </span>
              <span className="text-xs sm:text-base font-bold tracking-tight">
                Poster Print
              </span>
            </div>
            <HotspotBeacon x={26} y={64} title="Poster Print" category="Medialab" linkHref="#support-pillars" />
          </div>

          {/* Camera Gear Rental */}
          <div className="relative h-[220px] sm:h-[340px] md:h-[380px] rounded-none group border border-[#DFDFDF] shadow-none">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <Image
                src="/images/landing/showcase-camera.jpg"
                alt="Medialab pro photography and video equipment"
                fill
                sizes="(max-width: 768px) 50vw, 600px"
                quality={85}
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
            </div>
            <div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-10 text-white font-sans pointer-events-none">
              <span className="block text-[10px] sm:text-xs font-semibold text-white/70 uppercase tracking-wider">
                Medialab
              </span>
              <span className="text-xs sm:text-base font-bold tracking-tight">
                Kamera udlejning
              </span>
            </div>
            <HotspotBeacon x={81} y={62} title="Kamera Udlejning" category="Medialab" linkHref="#support-pillars" />
          </div>
        </div>

        {/* Row 3 (1x1): 3D Print Card matching Row 1 scale */}
        <div className="relative w-full h-[360px] sm:h-[500px] md:h-[580px] rounded-none group border border-[#DFDFDF] shadow-none">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Image
              src="/images/landing/showcase-3dprint.jpg"
              alt="Makerspace 3D printing rapid prototype game pieces"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              quality={85}
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
          </div>
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10 text-white font-sans pointer-events-none">
            <span className="block text-xs font-semibold text-white/70 uppercase tracking-wider">
              Makerspace
            </span>
            <span className="text-base sm:text-lg font-bold tracking-tight">
              3D Print
            </span>
          </div>
          <HotspotBeacon x={52} y={70} title="3D Printet Brik" category="Makerspace" linkHref="#support-pillars" />
        </div>
      </div>
    </section>
  );
}
