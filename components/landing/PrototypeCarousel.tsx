import React from "react";
import Image from "next/image";

interface PrototypeItem {
  id: string;
  name: string;
  image: string;
}

const prototypeItems: PrototypeItem[] = [
  { id: "tshirt-1", name: "T-Shirt", image: "/images/landing/carousel-tshirt.png" },
  { id: "kop-1", name: "Kop", image: "/images/landing/carousel-kop.png" },
  { id: "mulepose-1", name: "Mulepose", image: "/images/landing/carousel-mulepose.png" },
  { id: "tshirt-2", name: "T-Shirt", image: "/images/landing/carousel-tshirt.png" },
  { id: "kop-2", name: "Kop", image: "/images/landing/carousel-kop.png" },
  { id: "mulepose-2", name: "Mulepose", image: "/images/landing/carousel-mulepose.png" },
];

export function PrototypeCarousel() {
  return (
    <section id="prototypes" className="w-full bg-white text-zinc-950 pt-12 sm:pt-16 pb-6 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        <div className="max-w-xl">
          <h2 className="font-notch text-2xl sm:text-4xl md:text-5xl font-medium text-zinc-950 tracking-tight leading-tight">
            Din næste prototype
            <br />
            starter her
          </h2>
        </div>

        {/* Horizontal Scroll Carousel with Edge Bleed on Mobile */}
        <div className="-mx-4 px-4 sm:-mx-6 sm:px-6 flex gap-3.5 sm:gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar snap-x scroll-smooth touch-pan-x">
          {prototypeItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="relative flex-shrink-0 w-48 sm:w-60 h-48 sm:h-60 bg-[#F8F8F9] border border-[#DFDFDF] rounded-none overflow-hidden flex flex-col justify-end p-2.5 sm:p-3 snap-start hover:border-zinc-400 transition-all group cursor-pointer"
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
              <button
                type="button"
                className="relative z-10 w-full py-2 px-3 bg-white/95 backdrop-blur-xs text-zinc-950 font-sans text-xs sm:text-sm font-semibold border border-black/10 rounded-none shadow-xs flex items-center justify-between group-hover:bg-white transition-colors touch-manipulation cursor-pointer"
              >
                <span className="truncate">{item.name}</span>
                <span className="text-zinc-500 font-mono text-xs group-hover:text-black transition-colors ml-1">
                  →
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
