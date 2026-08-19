import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zealand Labs OS | Makerspace & Medialab",
  description: "Point of Sale checkout scanner, loan schedule calendar, and machine catalog for Zealand Labs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased bg-[#000000]">
      <body className="min-h-full flex flex-col bg-[#000000] text-white font-mono">
        {children}
      </body>
    </html>
  );
}
