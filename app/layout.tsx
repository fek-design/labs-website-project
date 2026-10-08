import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { generateOrganizationSchema } from "@/lib/schema";

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
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="da" className={`h-full antialiased bg-[#000000] ${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#000000] text-white font-mono overflow-x-hidden">
        {/* WCAG AA Keyboard Skip to Main Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-[#009FE3] focus:text-black focus:font-headline focus:font-extrabold focus:text-sm focus:rounded-full focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white"
        >
          Spring til hovedindhold
        </a>
        {children}
      </body>
    </html>
  );
}
