import React from "react";
import { getPosStats } from "@/app/actions/pos";
import { AdminConsoleClient } from "./AdminConsoleClient";

export const metadata = {
  title: "Admin Operational Console | Zealand Labs",
  description: "Point of Sale checkout scanner, return engine, equipment loan calendar, and machine catalog for Zealand Labs.",
};

export default async function AdminPOSPage() {
  const initialStats = await getPosStats("medialab");

  return <AdminConsoleClient initialStats={initialStats} />;
}
