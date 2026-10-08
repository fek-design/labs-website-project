import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MakerspaceView, LabMachineItem } from "@/components/makerspace/MakerspaceView";

export const metadata: Metadata = {
  title: "Makerspace Køge — Prototyping & Fabrikation | Zealand Labs",
  description: "Fysisk prototyping værksted med 3D-print, laserskæring, tekstilprint og maskiner på Zealand Erhvervsakademi i Køge.",
};

const DEFAULT_MAKERSPACE_MACHINES: LabMachineItem[] = [
  {
    name: "Prusa MK4 FDM 3D-Printer",
    model: "Original Prusa MK4",
    location: "Køge Makerspace • Zone A",
    status: "AVAILABLE",
    type: "3D-Print",
  },
  {
    name: "Roland VersaSTUDIO BN-20 Tekstilprinter",
    model: "Roland BN-20",
    location: "Køge Makerspace • Tekstilzone",
    status: "AVAILABLE",
    type: "Tekstiltryk",
  },
  {
    name: "Epilog Laser Fusion Pro 32",
    model: "CO2 Laser 60W",
    location: "Køge Makerspace • Zone B",
    status: "AVAILABLE",
    type: "Laserskæring",
  },
  {
    name: "Secabo TC7 SMART Varmepresse",
    model: "Secabo 40x50cm",
    location: "Køge Makerspace • Tekstilzone",
    status: "AVAILABLE",
    type: "Varmeoverførsel",
  },
];

export default async function MakerspacePage() {
  let machines = DEFAULT_MAKERSPACE_MACHINES;

  try {
    const dbItems = await prisma.inventory.findMany({
      where: {
        lab: { slug: "makerspace" },
      },
      select: {
        name: true,
        location: true,
        operationalStatus: true,
        hardwareType: true,
      },
      take: 6,
      orderBy: { name: "asc" },
    });

    if (dbItems && dbItems.length > 0) {
      machines = dbItems.map((item) => ({
        name: item.name,
        model: item.hardwareType || "Fabrikationsmaskine",
        location: item.location || "Køge Makerspace",
        status: item.operationalStatus,
        type: item.hardwareType || "Værksted",
      }));
    }
  } catch (err) {
    console.warn("Could not query Makerspace machines from database, using static list:", err);
  }

  return <MakerspaceView machines={machines} />;
}
