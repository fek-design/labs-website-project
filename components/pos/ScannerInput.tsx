"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Barcode, Check } from "@phosphor-icons/react";

export type ScannerMode = "AUTO" | "STUDENT" | "UDSTYR";

interface ScannerInputProps {
  onScanMatch: (result: {
    type: "PATRON" | "ASSET";
    data: any;
    query: string;
    mode?: ScannerMode;
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
  placeholder = "Scan eller søg...",
  autoFocus = true,
}: ScannerInputProps) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<ScannerMode>("AUTO");
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

      // Detection heuristic respecting mode overrides
      let type: "PATRON" | "ASSET";
      if (mode === "STUDENT") {
        type = "PATRON";
      } else if (mode === "UDSTYR") {
        type = "ASSET";
      } else {
        // AUTO mode heuristic
        const isLikelyAsset =
          val.startsWith("ML-") ||
          val.startsWith("MS-") ||
          val.startsWith("DL-") ||
          /^([A-Z]{2,3}-[A-Z0-9]+)/i.test(val);
        type = isLikelyAsset ? "ASSET" : "PATRON";
      }

      setScanFeedback("SUCCESS");
      setTimeout(() => setScanFeedback("IDLE"), 1200);

      onScanMatch({
        type,
        data: null,
        query: val,
        mode,
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
      {/* Figma 79:2117 Search Container */}
      <div
        className={`w-full flex items-center justify-between gap-3 bg-[#151517] border rounded-lg px-4 py-2.5 transition-all shadow-lg ${
          scanFeedback === "SUCCESS"
            ? "border-[#009FE3] shadow-[#009FE3]/20"
            : scanFeedback === "WARN"
            ? "border-[#E6007E] shadow-[#E6007E]/20"
            : "border-[#333333] focus-within:border-[#FFED00]"
        }`}
      >
        {/* Left: Barcode icon + Input */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="text-zinc-400 shrink-0">
            <Barcode size={22} weight="bold" aria-hidden="true" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent text-white font-mono text-xs sm:text-sm outline-none placeholder:text-zinc-500 tracking-wide"
          />
        </div>

        {/* Right: Mode Selector Pills (AUTO, STUDENT, UDSTYR) + Status Dot */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-[#101012] p-0.5 rounded border border-[#2e2e2e] text-[11px] font-mono">
            {(["AUTO", "STUDENT", "UDSTYR"] as const).map((m) => {
              const isActive = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 rounded transition-colors font-bold cursor-pointer text-[10px] tracking-wider ${
                    isActive
                      ? "bg-[#ffd900] text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>

          {/* Active Scanner Status Indicator */}
          <div className="flex items-center pl-1">
            {isSearching ? (
              <div className="w-3.5 h-3.5 border-2 border-[#FFED00] border-t-transparent rounded-full animate-spin" />
            ) : (
              <div
                className={`w-2 h-2 rounded-full ${
                  scanFeedback === "SUCCESS"
                    ? "bg-[#009FE3] animate-ping"
                    : "bg-emerald-500"
                }`}
                title="Stregkodescanner klar"
              />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {scanFeedback === "SUCCESS" && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute -bottom-5 left-4 text-[10px] font-mono text-[#009FE3] flex items-center gap-1.5"
          >
            <Check size={12} weight="bold" aria-hidden="true" />
            <span>Stregkode registreret</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
