"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Zealand Labs Root Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 selection:bg-brand-pink/30">
      <div className="w-full max-w-md bg-[#151517] border border-[#262626] rounded-2xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFED00] via-[#E6007E] to-[#009FE3]" />

        {/* Warning Icon & Badge */}
        <div className="mx-auto w-12 h-12 rounded-xl bg-[#202021] border border-[#333333] flex items-center justify-center text-[#FFED00] mb-4">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <span className="text-[11px] font-mono uppercase tracking-widest text-[#FFED00]">
          Zealand Labs / Systemafbrydelse
        </span>

        <h1 className="font-notch text-2xl sm:text-3xl uppercase tracking-tight text-white mt-2 mb-3">
          Der opstod en fejl
        </h1>

        <p className="text-sm text-zinc-400 font-sans leading-relaxed mb-6">
          Der opstod en uventet fejl under indlæsningen af siden. Det kan skyldes en midlertidig netværksafbrydelse eller lokal systemopdatering.
        </p>

        {error.digest && (
          <div className="mb-6 p-2.5 bg-[#09090b] border border-[#262626] rounded-lg text-left">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase">Diagnostisk ID:</span>
            <span className="text-xs font-mono text-zinc-300 select-all break-all">{error.digest}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-5 rounded-full bg-[#FFED00] text-black font-headline font-semibold text-sm uppercase tracking-wider hover:bg-[#ffe100] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFED00] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Prøv igen
          </button>
          <Link
            href="/"
            className="flex-1 py-3 px-5 rounded-full bg-[#202021] border border-[#333333] text-white font-headline font-medium text-sm uppercase tracking-wider hover:bg-[#2a2a2d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3] flex items-center justify-center"
          >
            Forside
          </Link>
        </div>
      </div>
    </div>
  );
}
