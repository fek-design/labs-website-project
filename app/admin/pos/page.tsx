import React from "react";
import { getPosStats } from "@/app/actions/pos";
import { AdminConsoleClient } from "./AdminConsoleClient";

export const metadata = {
  title: "Admin Operational Console | Zealand Labs",
  description: "Point of Sale checkout scanner, return engine, equipment loan calendar, and machine catalog for Zealand Labs.",
};

export default async function AdminPOSPage() {
  let initialStats = {
    activeLoansCount: 0,
    overdueLoansCount: 0,
    availableGearCount: 0,
    totalGearCount: 0,
  };

  try {
    initialStats = await getPosStats("medialab");
  } catch (error) {
    console.warn("Could not load initial POS stats:", error);
  }

  return <AdminConsoleClient initialStats={initialStats} />;
}
