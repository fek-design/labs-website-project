"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Zealand Labs Admin / POS Dashboard Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 selection:bg-brand-pink/30">
      <div className="w-full max-w-lg bg-[#151517] border border-[#333333] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Telemetry Strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#009FE3]" />

        {/* Warning Icon & Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#202021] border border-[#444444] flex items-center justify-center text-[#009FE3] shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#009FE3] block">
              POS & Hardware Hub / Fejldiagnostik
            </span>
            <h1 className="font-notch text-xl sm:text-2xl uppercase tracking-tight text-white">
              Lokal systemafbrydelse
            </h1>
          </div>
        </div>

        <p className="text-sm text-zinc-300 font-sans leading-relaxed mb-5">
          Der opstod en afbrydelse under kommunikation med databasen eller betjeningspanelet. Udlånsdata er sikret i den lokale database.
        </p>

        {/* Troubleshooting Checklist */}
        <div className="bg-[#09090b] border border-[#262626] rounded-xl p-4 mb-6">
          <span className="text-[11px] font-headline font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
            Anbefalede fejlfindingstrin for operatør:
          </span>
          <ul className="text-xs text-zinc-400 space-y-1.5 font-sans list-disc list-inside">
            <li>Kontroller at lokal MariaDB database er aktiv</li>
            <li>Kontroller at stregkodescanneren ikke sender ufuldstændige koder</li>
            <li>Genopret forbindelsen ved at klikke på knappen herunder</li>
          </ul>
          {error.digest && (
            <div className="mt-3 pt-3 border-t border-[#262626] text-[10px] font-mono text-zinc-500">
              Reference-ID: <span className="text-zinc-300">{error.digest}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-5 rounded-full bg-[#009FE3] text-black font-headline font-semibold text-sm uppercase tracking-wider hover:bg-[#008cc9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Genopret forbindelse
          </button>
          <Link
            href="/admin/pos"
            className="flex-1 py-3 px-5 rounded-full bg-[#202021] border border-[#444444] text-white font-headline font-medium text-sm uppercase tracking-wider hover:bg-[#2a2a2d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFED00] flex items-center justify-center text-center"
          >
            Nulstil POS-visning
          </Link>
        </div>
      </div>
    </div>
  );
}
