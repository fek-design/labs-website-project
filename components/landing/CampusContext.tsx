"use client";

import React, { createContext, useContext, useState } from "react";

export type CampusKey = "køge" | "roskilde" | "næstved" | "holbæk";

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
  næstved: {
    name: "Næstved",
    labs: [
      {
        id: "makerspace",
        name: "Makerspace",
        bullets: [
          "3D print og lasergravering",
          "Prototyper til undervisning og projekter",
          "Faglig vejledning og materialer",
        ],
        spotlightText:
          "I Næstved Makerspace understøtter vi kreative produktioner med 3D printere, folieskæring og materialeværksted. Kom forbi og gør din idé håndgribelig.",
        accentColor: "#009FE3",
      },
      {
        id: "medialab",
        name: "Medialab",
        bullets: [
          "Podcast-studie og lydoptagelser",
          "Kamera- og videoudstyr",
          "Plakatprint og grafisk rådgivning",
        ],
        spotlightText:
          "I Næstved Medialab kan du producere podcasts, optage video i studiomiljøer og udskrive store grafiske formater til præsentationer.",
        accentColor: "#E6007E",
      },
    ],
  },
  holbæk: {
    name: "Holbæk",
    labs: [
      {
        id: "makerspace",
        name: "Makerspace",
        bullets: [
          "Prototyping og hurtig visualisering",
          "3D print og vinylskæring",
          "Åbent værksted for studerende",
        ],
        spotlightText:
          "I Holbæk Makerspace stiller vi faciliteter til hurtig fremstilling af fysiske prototyper, lasercut og mockups til rådighed for studerende.",
        accentColor: "#009FE3",
      },
      {
        id: "medialab",
        name: "Medialab",
        bullets: [
          "Videokit og mobil optagelse",
          "Mikrofoner og lysopsætning",
          "Designfeedback og posterprint",
        ],
        spotlightText:
          "I Holbæk Medialab finder du optageudstyr, mikrofoner og redigeringsfaciliteter til dine studieprojekter og præsentationer.",
        accentColor: "#E6007E",
      },
    ],
  },
};

export const STORAGE_KEY_CAMPUS = "zealand_labs_campus_selected";

interface CampusContextType {
  campus: CampusKey;
  setCampus: (c: CampusKey, persist?: boolean) => void;
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

    // Restore saved campus from localStorage if present
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CAMPUS);
      if (saved && (saved in CAMPUS_DATA)) {
        setCampusState(saved as CampusKey);
      }
    } catch {
      // localStorage may fail in private window or strict iframe sandbox
    }

    return () => window.removeEventListener("touchstart", onTouchStart);
  }, []);

  const setCampus = (newCampus: CampusKey, persist = true) => {
    setCampusState(newCampus);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY_CAMPUS, newCampus);
      } catch {
        // ignore
      }
    }
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
