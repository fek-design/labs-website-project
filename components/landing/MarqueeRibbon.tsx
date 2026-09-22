import React from "react";

const LAB_ITEMS = [
  "DIMSELAB",
  "MAKERSPACE",
  "MEDIALAB",
  "DIMSELAB",
  "MAKERSPACE",
  "MEDIALAB",
  "DIMSELAB",
  "MAKERSPACE",
  "MEDIALAB",
];

export function MarqueeRibbon() {
  return (
    <div className="w-full bg-black border-y border-white/10 py-3.5 overflow-hidden select-none relative flex">
      {/* Dual Track A & B for seamless infinite looping without gaps */}
      <div className="animate-marquee-track flex items-center gap-8 whitespace-nowrap text-white font-notch text-xs sm:text-sm tracking-widest font-semibold uppercase pr-8" aria-hidden="false">
        {LAB_ITEMS.map((item, index) => (
          <span key={`a-${index}`} className="flex items-center gap-8">
            <span>{item}</span>
            <span className="text-white/30 text-xs">•</span>
          </span>
        ))}
      </div>

      <div className="animate-marquee-track flex items-center gap-8 whitespace-nowrap text-white font-notch text-xs sm:text-sm tracking-widest font-semibold uppercase pr-8" aria-hidden="true">
        {LAB_ITEMS.map((item, index) => (
          <span key={`b-${index}`} className="flex items-center gap-8">
            <span>{item}</span>
            <span className="text-white/30 text-xs">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
