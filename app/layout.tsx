import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zealand Labs OS | Makerspace & Medialab",
  description: "Point of Sale checkout scanner, loan schedule calendar, and machine catalog for Zealand Labs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased bg-[#000000] ${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col bg-[#000000] text-white font-mono overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
