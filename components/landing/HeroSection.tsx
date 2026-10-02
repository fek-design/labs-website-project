"use client";

import React, { useRef } from "react";
import { motion, type Variants, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const line1Words = ["Zealands", "Kreative"];
  const line2Words = ["hjørne"];

  const containerVariants: Variants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 1 },
    visible: {
      opacity: 1,
      transition: shouldReduceMotion ? undefined : {
        staggerChildren: 0.035,
        delayChildren: 0.15,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: {
      y: shouldReduceMotion ? "0%" : "140%",
      opacity: shouldReduceMotion ? 1 : 0,
      scaleY: shouldReduceMotion ? 1 : 0.6,
    },
    visible: {
      y: "0%",
      opacity: 1,
      scaleY: 1,
      transition: shouldReduceMotion ? { duration: 0.01 } : {
        type: "spring",
        damping: 11,
        stiffness: 220,
        mass: 0.65,
      },
    },
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.from(".gsap-hero-bg", {
        opacity: 0,
        scale: 1.04,
        duration: 1.1,
      })
      .from(
        ".gsap-hero-content",
        {
          opacity: 0,
          y: 20,
          duration: 0.85,
        },
        "-=0.6"
      )
      .from(
        ".gsap-hero-action",
        {
          opacity: 0,
          y: 16,
          duration: 0.65,
        },
        "-=0.3"
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[92dvh] min-h-[520px] sm:min-h-[600px] flex items-end justify-center overflow-hidden pb-14 sm:pb-20 px-4 sm:px-6"
    >
      {/* Background Video - Ambient, looping, muted, playsInline for mobile compatibility */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="gsap-hero-bg absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      >
        <source src="/images/landing/bg.mp4" type="video/mp4" />
      </video>

      {/* Subtle Vignette for Text Legibility without Dull Video */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* Hero Content - Asymmetrical 40/60 Ergonomic Grid */}
      <div className="gsap-hero-content relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 text-center lg:text-left">
        {/* Left Column (40-45%): Tight Reading Measure & Bouncing Headline */}
        <div className="flex flex-col items-center lg:items-start max-w-xl space-y-5">
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            aria-label="Zealands Kreative hjørne"
            className="font-notch text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.08] drop-shadow-md select-none"
          >
            {/* First Line: "Zealands Kreative" */}
            <span className="block" aria-hidden="true">
              {line1Words.map((word, wordIdx) => (
                <span
                  key={word}
                  className={`inline-block whitespace-nowrap overflow-hidden ${
                    wordIdx < line1Words.length - 1 ? "mr-2.5 sm:mr-4" : ""
                  }`}
                >
                  {Array.from(word).map((char, charIdx) => (
                    <motion.span
                      key={`${word}-${charIdx}`}
                      variants={letterVariants}
                      className="inline-block will-change-transform"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </span>

            {/* Second Line: "hjørne" */}
            <span className="block mt-1 sm:mt-2" aria-hidden="true">
              {line2Words.map((word) => (
                <span key={word} className="inline-block whitespace-nowrap overflow-hidden">
                  {Array.from(word).map((char, charIdx) => (
                    <motion.span
                      key={`${word}-${charIdx}`}
                      variants={letterVariants}
                      className="inline-block font-normal will-change-transform"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </span>
          </motion.h1>

          <p className="font-sans text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed max-w-prose">
            Køge Campus Maker & Medie laboratorier. Fri adgang til 3D-print, laserskæring, professionelt AV-udstyr og rapid prototyping.
          </p>

          {/* Action Button */}
          <div className="gsap-hero-action pt-2">
            <motion.a
              href="#prototypes"
              whileHover={{ scale: 1.025, backgroundColor: "#f4f4f5" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center min-h-[48px] px-10 sm:px-12 py-3.5 bg-white text-black font-sans text-sm md:text-base font-semibold tracking-wider uppercase hover:bg-zinc-200 active:scale-95 transition-all shadow-none touch-manipulation border border-zinc-200 rounded-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFED00]"
            >
              UDFORSK
            </motion.a>
          </div>
        </div>

        {/* Right Column (55-60%): High-Impact Visual Status Card */}
        <div className="hidden lg:flex flex-col items-end">
          <div className="bg-black/60 backdrop-blur-md border border-[#333333] rounded-2xl p-5 text-left max-w-sm w-full space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-2">
              <span className="text-[11px] font-mono text-[#009FE3] uppercase tracking-wider font-bold">
                Køge Campus Status
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Åbent for studerende
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-[#151517] p-3 rounded-xl border border-[#262626]">
                <div className="text-[10px] text-zinc-400 font-headline uppercase font-semibold">Makerspace</div>
                <div className="text-xl font-bold font-notch text-white mt-0.5">3D & Laser</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Selvbetjening</div>
              </div>
              <div className="bg-[#151517] p-3 rounded-xl border border-[#262626]">
                <div className="text-[10px] text-zinc-400 font-headline uppercase font-semibold">Medialab</div>
                <div className="text-xl font-bold font-notch text-white mt-0.5">Kamera & Lyd</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Udlån i station</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
