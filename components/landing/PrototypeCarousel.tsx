"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PrototypeItem {
  id: string;
  name: string;
  image: string;
  href: string;
}

const prototypeItems: PrototypeItem[] = [
  { id: "tshirt", name: "T-Shirt", image: "/images/landing/carousel-tshirt.png", href: "/craft/t-shirt" },
  { id: "kop", name: "Kop", image: "/images/landing/carousel-kop.png", href: "/craft/kop" },
  { id: "mulepose", name: "Mulepose", image: "/images/landing/carousel-mulepose.png", href: "/craft/mulepose" },
  { id: "3dprint", name: "3D Print", image: "/images/landing/showcase-3dprint.jpg", href: "/craft/kop" },
  { id: "plakat", name: "Plakat", image: "/images/landing/showcase-poster.jpg", href: "/craft/t-shirt" },
];

export function PrototypeCarousel() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Header reveal
      gsap.from(".gsap-carousel-header", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 24,
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
      });

      // Cards staggered cascade with fromTo and clearProps to eliminate invisible stuck states
      gsap.fromTo(
        ".gsap-carousel-card",
        { opacity: 0, y: 24 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.07,
          ease: "power2.out",
          clearProps: "opacity,transform",
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="prototypes"
      className="w-full bg-white text-zinc-950 pt-12 sm:pt-16 pb-6 transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        <div className="gsap-carousel-header max-w-xl">
          <h2 className="font-notch text-2xl sm:text-4xl md:text-5xl font-medium text-zinc-950 tracking-tight leading-tight">
            Din næste prototype
            <br />
            starter her
          </h2>
        </div>

        {/* Horizontal Scroll Carousel with Edge Bleed on Mobile */}
        <div className="gsap-carousel-track -mx-4 px-4 sm:-mx-6 sm:px-6 flex gap-3.5 sm:gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar snap-x scroll-smooth touch-pan-x">
          {prototypeItems.map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              href={item.href}
              className="gsap-carousel-card relative flex-shrink-0 w-48 sm:w-60 h-48 sm:h-60 bg-[#F8F8F9] border border-[#DFDFDF] rounded-none overflow-hidden flex flex-col justify-end p-2.5 sm:p-3 snap-start hover:border-zinc-400 transition-all group cursor-pointer block"
            >
              {/* Full Bleed Image Background Filling the Square */}
              <div className="absolute inset-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 192px, 240px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Gradient Overlay for Bottom Area Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

              {/* Button with Text Inside */}
              <div
                className="relative z-10 w-full py-2 px-3 bg-white/95 backdrop-blur-xs text-zinc-950 font-sans text-xs sm:text-sm font-semibold border border-black/10 rounded-none shadow-xs flex items-center justify-between group-hover:bg-white transition-colors touch-manipulation"
              >
                <span className="truncate">{item.name}</span>
                <span className="text-zinc-500 font-mono text-xs group-hover:text-black transition-colors ml-1">
                  →
                </span>
              </div>
            </Link>
          ))}

          {/* 6th Card: Terminal Catalogue Navigation Card */}
          <Link
            href="/katalog"
            className="gsap-carousel-card relative flex-shrink-0 w-48 sm:w-60 h-48 sm:h-60 bg-[#09090b] text-white border border-[#262626] rounded-none p-4 sm:p-5 flex flex-col justify-between snap-start hover:border-white/50 hover:bg-[#141416] transition-all group cursor-pointer block select-none"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-zinc-400 font-bold">
                KATALOG
              </span>
              <span className="text-[10px] font-mono text-zinc-500">SE ALLE</span>
            </div>

            <div className="space-y-1 my-auto">
              <h3 className="font-notch text-base sm:text-xl font-bold tracking-tight text-white leading-tight">
                Udforsk hele
                <br />
                kataloget
              </h3>
              <p className="font-sans text-[11px] sm:text-xs text-zinc-400 line-clamp-2">
                Se alle prototyper, maskiner og udstyr
              </p>
            </div>

            <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-white">
              <span className="tracking-wider uppercase text-[11px]">Gå til oversigt</span>
              <span className="font-bold text-white transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
