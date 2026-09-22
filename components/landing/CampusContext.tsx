"use client";

import React, { createContext, useContext, useState } from "react";

export type CampusKey = "køge" | "roskilde";

export interface LabInfo {
  id: string;
  name: string;
  bullets: string[];
  spotlightText: string;
  accentColor: string;
}

export const LAB_CMYK_TOKENS: Record<
  string,
  {
    name: string;
    hex: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    badgeClass: string;
  }
> = {
  makerspace: {
    name: "Cyan",
    hex: "#009FE3",
    bgClass: "bg-[#009FE3]",
    textClass: "text-[#009FE3]",
    borderClass: "border-[#009FE3]",
    badgeClass: "bg-[#009FE3]/15 text-[#0080BA] border-[#009FE3]/40",
  },
  medialab: {
    name: "Magenta",
    hex: "#E6007E",
    bgClass: "bg-[#E6007E]",
    textClass: "text-[#E6007E]",
    borderClass: "border-[#E6007E]",
    badgeClass: "bg-[#E6007E]/15 text-[#C4006B] border-[#E6007E]/40",
  },
  dimselab: {
    name: "Yellow",
    hex: "#FFED00",
    bgClass: "bg-[#FFED00]",
    textClass: "text-amber-700",
    borderClass: "border-[#FFED00]",
    badgeClass: "bg-[#FFED00]/25 text-zinc-950 border-[#FFED00]/60",
  },
};

export const CAMPUS_DATA: Record<CampusKey, { name: string; labs: LabInfo[] }> = {
  køge: {
    name: "Køge",
    labs: [
      {
        id: "makerspace",
        name: "Makerspace",
        bullets: [
          "Udforsk vores udvalg (3D print, laserskæring, tekstil)",
          "Se hvad andre har bygget af merch og prototyper",
          "Se hvordan du kan bruge maskinerne til din opgave",
        ],
        spotlightText:
          "I makerspace har vi fokus på prototyping og didaktisk udvikling. Her kan du lave alt fra merch i form af t-shirts, 3D printe figurer eller skære visit kort i træ og meget mere..",
        accentColor: "#009FE3",
      },
      {
        id: "medialab",
        name: "Medialab",
        bullets: [
          "Udforsk udstyr (kameraer, lys, mikrofoner)",
          "Storformat poster print og plakatopsætning",
          "Teknisk vejledning og hurtigt udlån til projekter",
        ],
        spotlightText:
          "I medialab stiller vi professionelt fotoudstyr, videooptagere, podcast-mikrofoner og storformat print til rådighed for dine produktioner. Book udstyr og print dine eksamensplakater.",
        accentColor: "#E6007E",
      },
    ],
  },
  roskilde: {
    name: "Roskilde",
    labs: [
      {
        id: "makerspace",
        name: "Makerspace",
        bullets: [
          "Udforsk vores udvalg (3D print, laserskæring, tekstil)",
          "Se hvad andre har bygget af merch og prototyper",
          "Se hvordan du kan bruge maskinerne til din opgave",
        ],
        spotlightText:
          "I makerspace har vi fokus på prototyping og didaktisk udvikling. Her kan du lave alt fra merch i form af t-shirts, 3D printe figurer eller skære visit kort i træ og meget mere..",
        accentColor: "#009FE3",
      },
      {
        id: "medialab",
        name: "Medialab",
        bullets: [
          "Udforsk udstyr (kameraer, lys, mikrofoner)",
          "Storformat poster print og plakatopsætning",
          "Teknisk vejledning og hurtigt udlån til projekter",
        ],
        spotlightText:
          "I medialab stiller vi professionelt fotoudstyr, videooptagere, podcast-mikrofoner og storformat print til rådighed for dine produktioner. Book udstyr og print dine eksamensplakater.",
        accentColor: "#E6007E",
      },
      {
        id: "dimselab",
        name: "Dimselab",
        bullets: [
          "Elektronik, sensorer og IoT prototyper",
          "Loddestationer, komponentkasser og mikrokontrollere",
          "Få faglig sparring til fysisk computing i dit pensum",
        ],
        spotlightText:
          "I dimselab udforsker vi microcontroller-programmering, sensorik og interaktive installationer. Her finder du loddeudstyr, komponentbiblioteker og værktøj til at puste digitalt liv i dine fysiske ideer.",
        accentColor: "#FFED00",
      },
    ],
  },
};

interface CampusContextType {
  campus: CampusKey;
  setCampus: (c: CampusKey) => void;
  activeLabId: string;
  setActiveLabId: (id: string) => void;
  currentLabs: LabInfo[];
  activeLab: LabInfo;
}

const CampusContext = createContext<CampusContextType | null>(null);

export function CampusProvider({ children }: { children: React.ReactNode }) {
  const [campus, setCampusState] = useState<CampusKey>("køge");
  const [activeLabId, setActiveLabId] = useState<string>("makerspace");

  React.useEffect(() => {
    // Initialize passive touchstart listener on window to enable immediate :active states on iOS Safari
    const onTouchStart = () => {};
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    return () => window.removeEventListener("touchstart", onTouchStart);
  }, []);

  const setCampus = (newCampus: CampusKey) => {
    setCampusState(newCampus);
    // ensure activeLabId is valid for newly selected campus
    const newLabs = CAMPUS_DATA[newCampus].labs;
    if (!newLabs.some((l) => l.id === activeLabId)) {
      setActiveLabId(newLabs[0].id);
    }
  };

  const currentLabs = CAMPUS_DATA[campus].labs;
  const activeLab = currentLabs.find((l) => l.id === activeLabId) || currentLabs[0];

  return (
    <CampusContext.Provider
      value={{
        campus,
        setCampus,
        activeLabId,
        setActiveLabId,
        currentLabs,
        activeLab,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  const ctx = useContext(CampusContext);
  if (!ctx) {
    throw new Error("useCampus must be used within a CampusProvider");
  }
  return ctx;
}
