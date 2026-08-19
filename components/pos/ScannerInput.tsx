"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ScannerInputProps {
  onScanMatch: (result: {
    type: "PATRON" | "ASSET";
    data: any;
    query: string;
  }) => void;
  onSearchChange?: (query: string) => void;
  isSearching?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export function ScannerInput({
  onScanMatch,
  onSearchChange,
  isSearching = false,
  placeholder = "Scan Barcode (ML-CAM-001) or Student ID (20240199)...",
  autoFocus = true,
}: ScannerInputProps) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"AUTO" | "ASSET" | "PATRON">("AUTO");
  const [scanFeedback, setScanFeedback] = useState<"IDLE" | "SUCCESS" | "WARN">("IDLE");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      const val = query.trim();

      // Detection heuristic for barcode scanners vs manual input
      const isLikelyAsset = val.startsWith("ML-") || val.startsWith("MS-") || mode === "ASSET";
      const type = isLikelyAsset ? "ASSET" : "PATRON";

      setScanFeedback("SUCCESS");
      setTimeout(() => setScanFeedback("IDLE"), 1200);

      onScanMatch({
        type,
        data: null,
        query: val,
      });

      // Clear input after scanner carriage return
      setQuery("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  return (
    <div className="relative w-full">
      <div
        className={`relative flex items-center gap-3 bg-[#141414] border transition-all duration-300 rounded-full px-5 py-3.5 shadow-2xl ${
          scanFeedback === "SUCCESS"
            ? "border-[#009FE3] shadow-[#009FE3]/20"
            : scanFeedback === "WARN"
            ? "border-[#E6007E] shadow-[#E6007E]/20"
            : "border-[#262626] focus-within:border-[#FFED00] focus-within:shadow-[#FFED00]/10"
        }`}
      >
        {/* Scanner Laser Icon */}
        <div className="relative flex items-center justify-center text-[#FFED00] shrink-0">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <line x1="7" y1="12" x2="17" y2="12" />
          </svg>
          {scanFeedback === "SUCCESS" && (
            <motion.span
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              className="absolute inset-0 rounded-full bg-[#009FE3]/40"
            />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-white font-mono text-sm sm:text-base outline-none placeholder:text-zinc-500 tracking-wide"
        />

        {/* Mode Selector Pill */}
        <div className="flex items-center gap-1 bg-[#0D0D0D] p-1 rounded-full border border-[#262626] text-xs">
          {(["AUTO", "ASSET", "PATRON"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-2.5 py-1 rounded-full transition-colors font-medium text-[11px] ${
                mode === m
                  ? m === "AUTO"
                    ? "bg-[#FFED00] text-black font-semibold"
                    : m === "ASSET"
                    ? "bg-[#009FE3] text-black font-semibold"
                    : "bg-[#E6007E] text-white font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center pl-2">
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-[#FFED00] border-t-transparent rounded-full animate-spin" />
          ) : (
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                scanFeedback === "SUCCESS"
                  ? "bg-[#009FE3] animate-ping"
                  : "bg-emerald-500"
              }`}
              title="Scanner Active (Listening)"
            />
          )}
        </div>
      </div>

      <AnimatePresence>
        {scanFeedback === "SUCCESS" && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute -bottom-6 left-6 text-[11px] font-mono text-[#009FE3] flex items-center gap-1.5"
          >
            <span>✓ Scanned barcode captured</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
