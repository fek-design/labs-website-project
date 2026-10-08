import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { MedialabView, LabMachineItem } from "@/components/medialab/MedialabView";

export const metadata: Metadata = {
  title: "Medialab Køge — AV Udlån & Medieproduktion | Zealand Labs",
  description: "Digitalt medieudlån og AV-laboratorium med 4K cinema-kameraer, podcastsæt, studiebelysning og storformat print på Zealand Erhvervsakademi i Køge.",
};

const DEFAULT_MEDIALAB_MACHINES: LabMachineItem[] = [
  {
    name: "Blackmagic Cinema Camera 6K Pro",
    model: "BMPCC 6K Pro Kit",
    location: "Køge Medialab • Skab 1",
    status: "AVAILABLE",
    type: "Kamera & Video",
  },
  {
    name: "RØDECaster Pro II Podcast Station",
    model: "RØDE Studio Set",
    location: "Køge Medialab • Skranke",
    status: "AVAILABLE",
    type: "Lyd & Podcast",
  },
  {
    name: "Epson SureColor SC-P9000 Storformat",
    model: "44-tommer Pigment",
    location: "Køge Medialab • Printzone",
    status: "AVAILABLE",
    type: "Plakatprint",
  },
  {
    name: "Aputure 300d II LED Lyskit",
    model: "Bowens Mount 5500K",
    location: "Køge Medialab • Skab 3",
    status: "AVAILABLE",
    type: "Studiebelysning",
  },
];

export default async function MedialabPage() {
  let machines = DEFAULT_MEDIALAB_MACHINES;

  try {
    const dbItems = await prisma.inventory.findMany({
      where: {
        lab: { slug: "medialab" },
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
        model: item.hardwareType || "AV Udstyr",
        location: item.location || "Køge Medialab",
        status: item.operationalStatus,
        type: item.hardwareType || "Medieudstyr",
      }));
    }
  } catch (err) {
    console.warn("Could not query Medialab machines from database, using static list:", err);
  }

  return <MedialabView machines={machines} />;
}
