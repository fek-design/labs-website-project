import React from "react";

export function LabSpotlightCard() {
  return (
    <section id="makerspace" className="w-full py-6 px-6 max-w-7xl mx-auto">
      <div className="w-full bg-brand-cyan text-white p-8 sm:p-12 rounded-none space-y-4 shadow-xl">
        <h3 className="font-notch text-3xl sm:text-5xl font-bold tracking-tight">
          Makerspace
        </h3>
        <p className="font-sans text-base sm:text-xl font-light text-white/95 leading-relaxed max-w-2xl">
          I makerspace har vi fokus på prototyping og didaktisk udvikling. Her kan du lave alt fra merch i form af t-shirts, 3D-printe figurer eller skære visitkort i træ og meget mere..
        </p>
      </div>
    </section>
  );
}
