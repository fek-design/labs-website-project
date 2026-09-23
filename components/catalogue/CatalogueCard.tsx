"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CraftItemData } from "@/lib/craft-data";
import { ArrowRight } from "@phosphor-icons/react";

interface CatalogueCardProps {
  item: CraftItemData;
}

export function CatalogueCard({ item }: CatalogueCardProps) {
  const primaryLab = item.labs[0] || "makerspace";
  const displayImage = item.thumbnailImage || item.heroImage;

  return (
    <Link
      href={`/craft/${item.slug}`}
      className="group block flex flex-col w-full text-left transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3]"
    >
      {/* Image canvas box - Figma node 144:368 geometry */}
      <div className="relative w-full aspect-[3/4] bg-[#E9E9E9] border border-[#E7E7E7] overflow-hidden rounded-none flex items-center justify-center transition-colors duration-200 group-hover:border-[#009FE3]">
        {/* Lab indicator badge top-right */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-black/85 text-white/90 border border-white/10 backdrop-blur-xs">
            {primaryLab}
          </span>
        </div>

        {/* Thumbnail image */}
        <div className="relative w-full h-full p-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <Image
            src={displayImage}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2"
          />
        </div>
      </div>

      {/* Card Footer - Figma node 144:370 */}
      <div className="mt-3 flex items-center justify-between gap-2 px-1">
        <div className="min-w-0 flex-1">
          <h3 className="font-headline font-semibold text-base sm:text-lg text-white truncate tracking-tight group-hover:text-[#009FE3] transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-zinc-400 font-sans truncate mt-0.5">
            {item.category}
          </p>
        </div>

        {/* Arrow affordance */}
        <div className="shrink-0 w-7 h-7 flex items-center justify-center rounded-none border border-white/20 text-zinc-300 group-hover:border-[#009FE3] group-hover:text-[#009FE3] group-hover:bg-[#009FE3]/10 transition-colors">
          <ArrowRight
            size={14}
            weight="bold"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}
