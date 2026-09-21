"use client";

import React, { useState, useRef } from "react";
import { useAnime, drawSvgPath, animateCounter } from "@/lib/motion";

/**
 * NodeTelemetryVisualizer
 *
 * Demonstrates the Anime.js motion toolkit within the Zealand Labs design system:
 * - High-performance SVG stroke line drawing via `drawSvgPath`
 * - Direct DOM numerical counter interpolation via `animateCounter`
 * - Autonomous UX interactivity (button click replay, CMYK hover flips, feedback states)
 *
 * Design matches Figma Frame #87:5314 (Dashboard - Indstillinger).
 */
export function NodeTelemetryVisualizer() {
  const [pulseCount, setPulseCount] = useState(0);

  const opsCountRef = useRef<HTMLSpanElement>(null);
  const latencyRef = useRef<HTMLSpanElement>(null);
  const healthRef = useRef<HTMLSpanElement>(null);

  const containerRef = useAnime<HTMLDivElement>((el) => {
    // 1. Draw SVG Schematic Blueprint Lines
    const paths = el.querySelectorAll<SVGGeometryElement>(".blueprint-trace");
    paths.forEach((path, idx) => {
      drawSvgPath(path, {
        duration: 1800 + idx * 300,
        delay: idx * 200,
        ease: "outCubic",
      });
    });

    // 2. Animate Numeric Counters directly in DOM
    if (opsCountRef.current) {
      animateCounter(opsCountRef.current, 0, 1420, {
        duration: 1600,
        prefix: "",
        suffix: " ops",
        ease: "outExpo",
      });
    }

    if (latencyRef.current) {
      animateCounter(latencyRef.current, 0, 14, {
        duration: 1200,
        prefix: "",
        suffix: " ms",
        ease: "outQuad",
      });
    }

    if (healthRef.current) {
      animateCounter(healthRef.current, 0, 99.9, {
        duration: 1500,
        decimals: 1,
        prefix: "",
        suffix: "%",
        ease: "outExpo",
      });
    }
  }, [pulseCount]);

  return (
    <div
      ref={containerRef}
      className="mt-6 bg-[#0E0D0F] border border-[#262626] rounded-2xl p-5 shadow-xl font-mono text-white relative overflow-hidden"
    >
      {/* Visual Accent Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#009FE3]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#009FE3] animate-ping" />
            <h3 className="text-sm font-bold tracking-tight text-white uppercase">
              Hardware & Node Diagnostics
            </h3>
            <span className="text-[10px] font-bold bg-[#009FE3]/10 text-[#009FE3] border border-[#009FE3]/30 px-2 py-0.5 rounded-full">
              Anime.js v4
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Real-time vector bus telemetry & offline institutional node metrics
          </p>
        </div>

        {/* Autonomous UX Action Button */}
        <button
          type="button"
          onClick={() => setPulseCount((c) => c + 1)}
          className="self-start sm:self-auto px-3.5 py-1.5 bg-[#141416] hover:bg-[#FFED00] text-zinc-300 hover:text-black border border-[#262626] hover:border-[#FFED00] text-xs font-bold rounded-full transition-all duration-200 active:scale-95 shadow-sm"
        >
          ⚡ Re-trace Vectors
        </button>
      </div>

      {/* SVG Blueprint Schematic Path Drawing */}
      <div className="py-4">
        <svg
          viewBox="0 0 600 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-20 overflow-visible"
        >
          {/* Blueprint Grid Lines */}
          <line x1="0" y1="20" x2="600" y2="20" stroke="#262626" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="0" y1="50" x2="600" y2="50" stroke="#262626" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="0" y1="80" x2="600" y2="80" stroke="#262626" strokeDasharray="4 4" strokeWidth="1" />

          {/* Primary Cyan Data Bus Wave */}
          <path
            className="blueprint-trace"
            d="M 10 50 Q 80 10, 150 50 T 290 50 T 430 50 T 590 50"
            stroke="#009FE3"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Secondary Yellow Telemetry Pulses */}
          <path
            className="blueprint-trace"
            d="M 20 80 L 100 80 L 140 20 L 220 20 L 260 80 L 380 80 L 420 20 L 520 20 L 580 80"
            stroke="#FFED00"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Pink Sensor Ping Trace */}
          <path
            className="blueprint-trace"
            d="M 50 30 L 120 30 L 160 70 L 280 70 L 320 30 L 460 30 L 500 70 L 550 70"
            stroke="#E6007E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 2"
          />
        </svg>
      </div>

      {/* Numerical Metrics Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#262626]">
        <div className="bg-[#141416] p-3 rounded-xl border border-[#262626]">
          <span className="text-[10px] text-zinc-400 block uppercase font-bold tracking-wider">
            Audit Operations
          </span>
          <span
            ref={opsCountRef}
            className="text-lg font-extrabold text-[#009FE3] tracking-tight"
          >
            0 ops
          </span>
        </div>

        <div className="bg-[#141416] p-3 rounded-xl border border-[#262626]">
          <span className="text-[10px] text-zinc-400 block uppercase font-bold tracking-wider">
            MySQL Local Latency
          </span>
          <span
            ref={latencyRef}
            className="text-lg font-extrabold text-[#FFED00] tracking-tight"
          >
            0 ms
          </span>
        </div>

        <div className="bg-[#141416] p-3 rounded-xl border border-[#262626]">
          <span className="text-[10px] text-zinc-400 block uppercase font-bold tracking-wider">
            Node Reliability
          </span>
          <span
            ref={healthRef}
            className="text-lg font-extrabold text-emerald-400 tracking-tight"
          >
            0%
          </span>
        </div>
      </div>
    </div>
  );
}
