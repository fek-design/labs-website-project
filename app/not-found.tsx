import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-brand-pink/30">
      {/* Top Simple Brand Bar */}
      <header className="w-full border-b border-[#262626] bg-[#09090b]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-notch text-lg font-bold tracking-tight text-white group-hover:text-[#FFED00] transition-colors">
            LABS
          </span>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Zealand
          </span>
        </Link>
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
          Fejlkode: 404
        </span>
      </header>

      {/* Main 404 Asymmetrical Canvas */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-xl w-full text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FFED00] block mb-3">
            Siden blev ikke fundet
          </span>

          <h1 className="font-notch text-5xl sm:text-7xl font-normal tracking-tight text-white uppercase mb-4">
            404
          </h1>

          <div className="h-[2px] w-16 bg-[#FFED00] mx-auto mb-6" />

          <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-prose mx-auto leading-relaxed mb-8">
            Den efterspurgte ressource eller adresse findes ikke på Zealand Labs platformen. Det kan skyldes et forældet link eller en flyttet ressource.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/katalog"
              className="w-full sm:w-auto py-3 px-6 rounded-full bg-[#FFED00] text-black font-headline font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#ffe100] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFED00]"
            >
              Udforsk Kataloget
            </Link>
            <Link
              href="/admin/pos"
              className="w-full sm:w-auto py-3 px-6 rounded-full bg-[#151517] border border-[#333333] text-white font-headline font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-[#202021] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009FE3]"
            >
              Gå til POS-Udlån
            </Link>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="w-full border-t border-[#262626] py-4 px-6 text-center text-xs text-zinc-600 font-mono">
        Zealand Labs Infrastructure • Køge Campus
      </footer>
    </div>
  );
}
