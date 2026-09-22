"use client";

import React from "react";
import { motion, type Variants } from "motion/react";

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.15,
    },
  },
};

const letterVariants: Variants = {
  hidden: {
    y: "140%",
    opacity: 0,
    scaleY: 0.6,
  },
  visible: {
    y: "0%",
    opacity: 1,
    scaleY: 1,
    transition: {
      type: "spring",
      damping: 11,
      stiffness: 220,
      mass: 0.65,
    },
  },
};

export function HeroSection() {
  const line1Words = ["Zealands", "Kreative"];
  const line2Words = ["hjørne"];

  return (
    <section className="relative w-full h-[92dvh] min-h-[520px] sm:min-h-[600px] flex items-end justify-center overflow-hidden pb-14 sm:pb-20 px-4 sm:px-6">
      {/* Background Video - Ambient, looping, muted, playsInline for mobile compatibility */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      >
        <source src="/images/landing/bg.mp4" type="video/mp4" />
      </video>

      {/* Subtle Vignette for Text Legibility without Dull Video */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto space-y-6">
        {/* Bouncing Headline Animated Letter by Letter with Motion.js */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          aria-label="Zealands Kreative hjørne"
          className="font-notch text-3xl sm:text-5xl md:text-7xl font-light text-white tracking-tight leading-[1.1] drop-shadow-md select-none"
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

        {/* Action Button - Enters smoothly following the letter bounce */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.55, type: "spring", stiffness: 220, damping: 20 }}
        >
          <motion.a
            href="#prototypes"
            whileHover={{ scale: 1.025, backgroundColor: "#f4f4f5" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center min-h-[48px] px-10 sm:px-12 py-3.5 bg-white text-black font-sans text-sm md:text-base font-semibold tracking-wider uppercase hover:bg-zinc-200 active:scale-95 transition-all shadow-none touch-manipulation border border-zinc-200 rounded-none cursor-pointer"
          >
            UDFORSK
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
