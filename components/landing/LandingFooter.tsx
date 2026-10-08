import React from "react";
import Link from "next/link";

interface LandingFooterProps {
  className?: string;
}

export function LandingFooter({ className = "mt-8 sm:mt-12" }: LandingFooterProps) {
  return (
    <footer className={`w-full bg-brand-cyan text-white py-12 sm:py-16 px-4 sm:px-6 ${className}`}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8 sm:gap-12">
        {/* Left Brand info */}
        <div className="space-y-2 sm:space-y-3 max-w-sm">
          <span className="font-notch text-3xl sm:text-5xl font-extrabold tracking-tighter block">
            LABS
          </span>
          <p className="font-sans text-xs sm:text-sm font-extralight text-white/90 leading-snug">
            Initializing workspaces.
            <br />
            Isolating variables.
          </p>
        </div>

        {/* Right Index Navigation */}
        <div className="space-y-3 w-full md:w-auto">
          <span className="font-notch text-xs font-bold uppercase tracking-widest text-white/80 block">
            SITEMAP & OVERSIGT
          </span>
          <nav className="flex flex-col gap-1.5 font-notch text-xs sm:text-sm font-light tracking-wider text-white">
            <Link href="/katalog" className="py-1 hover:text-black transition-colors flex items-center font-bold">
              UDSTYRSKATALOG & UDLÅN ↗
            </Link>
            <a href="#support-pillars" className="py-1 hover:text-black transition-colors flex items-center">
              MAKERSPACE & FABRICATION
            </a>
            <a href="#machines" className="py-1 hover:text-black transition-colors flex items-center">
              MEDIALAB & MASKINSTATUS
            </a>
            <Link href="/admin" className="py-1 hover:text-black transition-colors text-white font-bold pt-1 text-xs flex items-center">
              ADMIN CONSOLE (UNDERVISER) ↗
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto pt-8 sm:pt-10 mt-8 sm:mt-10 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-white/80 gap-2 font-mono">
        <span>Zealand Labs • Køge Campus</span>
        <span>Offline Local Infrastructure</span>
      </div>
    </footer>
  );
}
