import React from "react";

export function SupportPillars() {
  const pillars = [
    "Udforsk vores udvalg",
    "Se hvad andre har bygget",
    "Se hvordan du kan bruge det til din opgave",
  ];

  return (
    <section className="w-full py-12 px-6 max-w-7xl mx-auto space-y-8">
      <div className="space-y-6 max-w-2xl">
        <h2 className="font-notch text-3xl sm:text-5xl font-light text-white tracking-tight leading-none">
          Prototyping &
          <br />
          Understøttelse
        </h2>

        <ul className="space-y-3 font-sans text-sm sm:text-base text-zinc-300 font-light">
          {pillars.map((pillar, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <span>{pillar}</span>
            </li>
          ))}
        </ul>

        {/* Step Progress Indicator Bars */}
        <div className="flex items-center gap-2 pt-4">
          <div className="h-1 flex-1 bg-brand-cyan rounded-full" />
          <div className="h-1 flex-1 bg-white/30 rounded-full" />
          <div className="h-1 flex-1 bg-white/30 rounded-full" />
        </div>
      </div>
    </section>
  );
}
