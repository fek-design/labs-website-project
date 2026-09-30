"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import JsBarcode from "jsbarcode";
import { Printer, DownloadSimple, Barcode, Check, Copy } from "@phosphor-icons/react";

export type LabelRollSize = "60x30" | "50x25";

interface InventoryBarcodeLabelProps {
  assetTag: string;
  name: string;
  location?: string | null;
  labName?: string | null;
  compact?: boolean;
  className?: string;
}

export function InventoryBarcodeLabel({
  assetTag,
  name,
  location,
  labName = "Makerspace",
  compact = false,
  className = "",
}: InventoryBarcodeLabelProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [rollSize, setRollSize] = useState<LabelRollSize>("60x30");
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Determine campus tag
  const campus = assetTag.startsWith("RO-") ? "ROSKILDE" : "KØGE";
  const displayLab = labName ? labName.toUpperCase() : "LABS";
  const displayLocation = location ? location.trim() : "Standard Lokation";

  // Re-render barcode whenever assetTag changes
  useEffect(() => {
    if (!svgRef.current || !assetTag.trim()) return;

    try {
      JsBarcode(svgRef.current, assetTag.trim(), {
        format: "CODE128",
        width: 1.8,
        height: compact ? 36 : 46,
        displayValue: false,
        margin: 0,
        background: "#ffffff",
        lineColor: "#000000",
      });
    } catch (err) {
      console.error("Barcode generation error:", err);
    }
  }, [assetTag, compact]);

  // Copy asset tag to clipboard
  const handleCopyTag = async () => {
    try {
      await navigator.clipboard.writeText(assetTag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Generate full sticker SVG string
  const generateStickerSvgString = useCallback(() => {
    const is60x30 = rollSize === "60x30";
    const width = is60x30 ? 600 : 500;
    const height = is60x30 ? 300 : 250;

    // Get current barcode SVG inner paths
    const barcodeInner = svgRef.current ? svgRef.current.innerHTML : "";

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="#ffffff" rx="16" />
  
  <!-- Header -->
  <text x="28" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="900" fill="#000000" letter-spacing="2">ZEALAND LABS</text>
  <text x="${width - 28}" y="40" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#444444" letter-spacing="1">${campus} • ${displayLab}</text>
  
  <line x1="28" y1="52" x2="${width - 28}" y2="52" stroke="#000000" stroke-width="1.5" />
  
  <!-- Barcode Container -->
  <g transform="translate(28, 64)">
    ${barcodeInner}
  </g>
  
  <!-- Human Readable Tag -->
  <text x="${width / 2}" y="${height - 62}" text-anchor="middle" font-family="ui-monospace, monospace" font-size="30" font-weight="800" fill="#000000" letter-spacing="3">${assetTag}</text>
  
  <!-- Equipment Name & Placement -->
  <text x="${width / 2}" y="${height - 34}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="700" fill="#111111">${name.length > 36 ? name.slice(0, 36) + "…" : name}</text>
  <text x="${width / 2}" y="${height - 15}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="500" fill="#555555">${displayLocation}</text>
</svg>`;
  }, [rollSize, campus, displayLab, assetTag, name, displayLocation]);

  // Direct Vector SVG Download
  const handleDownloadSvg = () => {
    try {
      const svgData = generateStickerSvgString();
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `label-${assetTag}-${rollSize}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download SVG:", err);
    }
  };

  // Direct High-Resolution PNG Download (300 DPI)
  const handleDownloadPng = () => {
    try {
      setIsExporting(true);
      const is60x30 = rollSize === "60x30";
      // 300 DPI resolution scaling (approx 1200x600 for 60x30mm)
      const canvasWidth = is60x30 ? 1200 : 1000;
      const canvasHeight = is60x30 ? 600 : 500;

      const svgData = generateStickerSvgString();
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

          canvas.toBlob((blob) => {
            if (blob) {
              const pngUrl = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = pngUrl;
              link.download = `label-${assetTag}-${rollSize}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(pngUrl);
            }
            setIsExporting(false);
          }, "image/png");
        } else {
          setIsExporting(false);
        }
        URL.revokeObjectURL(url);
      };

      img.onerror = () => {
        setIsExporting(false);
        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (err) {
      console.error("Failed to download PNG:", err);
      setIsExporting(false);
    }
  };

  // Direct Thermal Label Print via isolated iframe
  const handlePrintLabel = () => {
    try {
      const is60x30 = rollSize === "60x30";
      const rollDimensions = is60x30 ? "60mm 30mm" : "50mm 25mm";
      const svgData = generateStickerSvgString();

      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) return;

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Label - ${assetTag}</title>
            <style>
              @page {
                size: ${rollDimensions};
                margin: 0;
              }
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              body {
                width: 100vw;
                height: 100vh;
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #ffffff;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              svg {
                width: 100%;
                height: 100%;
                max-width: 100%;
                max-height: 100%;
                display: block;
              }
            </style>
          </head>
          <body>
            ${svgData}
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 300);
    } catch (err) {
      console.error("Failed to trigger print:", err);
    }
  };

  return (
    <div
      className={`flex flex-col gap-3 p-4 bg-[#151517] border border-[#333333] rounded-xl text-white ${className}`}
    >
      {/* Top Bar: Title & Size Selector */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Barcode size={18} className="text-[#1da9e4]" weight="bold" />
          <span className="text-xs font-bold uppercase tracking-wider font-['Stack_Sans_Headline',sans-serif] text-zinc-300">
            Code 128 Label & Barcode
          </span>
        </div>

        {/* Roll Size Pills */}
        <div className="flex items-center gap-1 bg-[#202021] border border-[#444444] rounded-lg p-0.5 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setRollSize("60x30")}
            className={`px-2 py-0.5 rounded transition-all ${
              rollSize === "60x30"
                ? "bg-[#1da9e4] text-white font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
            title="60mm × 30mm standard label roll"
          >
            60×30 mm
          </button>
          <button
            type="button"
            onClick={() => setRollSize("50x25")}
            className={`px-2 py-0.5 rounded transition-all ${
              rollSize === "50x25"
                ? "bg-[#1da9e4] text-white font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
            title="50mm × 25mm compact label roll"
          >
            50×25 mm
          </button>
        </div>
      </div>

      {/* Simulated Thermal Sticker Preview (White Adhesive Label) */}
      <div className="relative mx-auto w-full max-w-[420px] bg-white rounded-lg p-3 sm:p-3.5 shadow-md border border-zinc-200 text-black select-none flex flex-col justify-between overflow-hidden">
        {/* Label Header */}
        <div className="flex items-center justify-between border-b border-black pb-1 mb-1.5">
          <span className="text-[11px] sm:text-xs font-black tracking-widest font-['Stack_Sans_Notch',sans-serif]">
            ZEALAND LABS
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-zinc-700">
            {campus} • {displayLab}
          </span>
        </div>

        {/* Barcode Vector Area */}
        <div className="flex items-center justify-center my-0.5 overflow-hidden">
          <svg
            ref={svgRef}
            className="w-full max-h-[48px] sm:max-h-[54px] object-contain"
          />
        </div>

        {/* Human Readable Asset Tag */}
        <div className="text-center mt-1">
          <span className="font-mono font-black text-sm sm:text-base tracking-widest block text-black">
            {assetTag || "KG-MK-GEN-0001"}
          </span>
        </div>

        {/* Equipment & Placement Zone Footer */}
        <div className="mt-1 pt-1 border-t border-zinc-300 text-center leading-tight">
          <p className="text-[11px] font-bold text-zinc-900 truncate">
            {name || "Udstyrsnavn"}
          </p>
          <p className="text-[9.5px] font-medium text-zinc-600 truncate">
            {displayLocation}
          </p>
        </div>
      </div>

      {/* Action Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#262626]">
        {/* Quick Tag Copy */}
        <button
          type="button"
          onClick={handleCopyTag}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#202021] hover:bg-[#252528] border border-[#444444] text-[11px] font-medium text-zinc-300 hover:text-white transition-colors"
          title="Kopier asset tag tekst"
        >
          {copied ? (
            <>
              <Check size={13} className="text-[#FFED00]" weight="bold" />
              <span className="text-[#FFED00] font-bold">Kopieret</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Kopiér ID</span>
            </>
          )}
        </button>

        {/* Export & Print Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* SVG Vector Download */}
          <button
            type="button"
            onClick={handleDownloadSvg}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#202021] hover:bg-[#252528] border border-[#444444] text-[11px] font-bold text-zinc-300 hover:text-white transition-colors"
            title="Download som vektor SVG til etiketprogram"
          >
            <DownloadSimple size={13} weight="bold" />
            <span>Hent SVG</span>
          </button>

          {/* PNG Image Download */}
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#202021] hover:bg-[#252528] border border-[#444444] text-[11px] font-bold text-zinc-300 hover:text-white transition-colors disabled:opacity-50"
            title="Download som højopløselig PNG (300 DPI)"
          >
            <DownloadSimple size={13} weight="bold" />
            <span>Hent PNG</span>
          </button>

          {/* Direct Thermal Print Action */}
          <button
            type="button"
            onClick={handlePrintLabel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1da9e4] hover:bg-[#1895ca] text-white text-[11px] font-bold transition-colors shadow-sm"
            title="Udskriv direkte til termoprinter (50x25mm / 60x30mm)"
          >
            <Printer size={14} weight="bold" />
            <span>Udskriv label</span>
          </button>
        </div>
      </div>
    </div>
  );
}
