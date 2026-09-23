"use client";

import React from "react";
import Link from "next/link";
import {
  SignOut,
  ArrowLeft,
  SidebarSimple,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { ADMIN_NAV_ITEMS, AdminNavTabId } from "@/lib/admin-nav";

interface AdminSidebarNavProps {
  activeTab: AdminNavTabId;
  onSelectTab: (tabId: AdminNavTabId) => void;
  onLogout: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeLab?: string;
  onSelectLab?: (lab: "medialab" | "makerspace" | "dimselab") => void;
}

const LAB_OPTIONS = [
  { slug: "medialab" as const, name: "Medialab", color: "#009FE3" },
  { slug: "makerspace" as const, name: "Makerspace", color: "#FFED00" },
  { slug: "dimselab" as const, name: "Dimselab", color: "#E6007E" },
];

export function AdminSidebarNav({
  activeTab,
  onSelectTab,
  onLogout,
  isExpanded,
  onToggleExpand,
  activeLab = "medialab",
  onSelectLab,
}: AdminSidebarNavProps) {
  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-50 bg-[#121214] border-r border-[#262626] flex flex-col justify-between select-none font-mono transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64 px-4 py-5" : "w-20 py-6 items-center"
      }`}
      aria-label="Admin Navigation Sidebar"
    >
      {/* Top Header Block: Brand & Controls */}
      <div className="flex flex-col gap-4 w-full">
        <div
          className={`flex items-center ${
            isExpanded ? "justify-between" : "justify-center"
          }`}
        >
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="w-10 h-10 rounded-xl bg-[#FFED00] hover:bg-[#ffe600] flex items-center justify-center text-black font-extrabold text-xs transition-transform hover:scale-105 shadow-md shadow-[#FFED00]/20 shrink-0"
              title="Admin Forside"
            >
              ZL
            </Link>
            {isExpanded && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-white text-xs tracking-tight truncate">
                  ZEALAND LABS
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                  Admin POS OS
                </span>
              </div>
            )}
          </div>

          {/* Expand / Collapse Button */}
          <button
            type="button"
            onClick={onToggleExpand}
            className="w-8 h-8 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title={isExpanded ? "Skjul sidepanel" : "Udvid sidepanel"}
            aria-label={isExpanded ? "Skjul sidepanel" : "Udvid sidepanel"}
          >
            {isExpanded ? (
              <CaretLeft size={16} weight="bold" />
            ) : (
              <CaretRight size={16} weight="bold" />
            )}
          </button>
        </div>

        {/* Clickable Labs Switcher (when expanded) */}
        {isExpanded && onSelectLab && (
          <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">
              Vælg Aktivt Lab
            </span>
            <div className="grid grid-cols-3 gap-1 bg-[#09090b] p-1 rounded-lg border border-zinc-800/80">
              {LAB_OPTIONS.map((lab) => {
                const isSelected = activeLab === lab.slug;
                return (
                  <button
                    key={lab.slug}
                    type="button"
                    onClick={() => onSelectLab(lab.slug)}
                    className={`py-1 text-[10px] font-bold uppercase rounded transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      isSelected
                        ? "bg-zinc-800 text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: lab.color }}
                    />
                    <span className="truncate">{lab.name.slice(0, 3)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation Items */}
      <nav
        className={`flex flex-col gap-2 my-auto w-full ${
          isExpanded ? "items-stretch" : "items-center"
        }`}
      >
        {ADMIN_NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`relative group transition-all cursor-pointer ${
                isExpanded
                  ? `w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-left transition-colors ${
                      isActive
                        ? "bg-zinc-900/90 text-white font-bold"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                    }`
                  : `w-11 h-11 flex items-center justify-center rounded-none bg-transparent border-0 transition-transform ${
                      isActive ? "scale-110" : "text-zinc-500 hover:text-zinc-200 hover:scale-105"
                    }`
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Clean Icon Highlighting (Zero square border box, zero left accent strip) */}
              <div className="shrink-0 flex items-center justify-center">
                <IconComponent
                  size={24}
                  weight={isActive ? "fill" : "regular"}
                  style={{
                    color: isActive ? item.accentColor : undefined,
                    filter: isActive
                      ? `drop-shadow(0 0 10px ${item.accentColor}80)`
                      : undefined,
                  }}
                  className="transition-all"
                />
              </div>

              {/* Detailed View Text (Shown when expanded) */}
              {isExpanded && (
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs uppercase font-bold tracking-tight truncate ${
                        isActive ? "text-white" : "text-zinc-300"
                      }`}
                    >
                      {item.shortTitle}
                    </span>
                    {isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: item.accentColor }}
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-sans truncate">
                    {item.description}
                  </span>
                </div>
              )}

              {/* Floating Tooltip in compact mode */}
              {!isExpanded && (
                <div className="absolute left-16 px-3 py-1.5 bg-[#09090b] border border-[#262626] rounded-md text-white text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50 flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.accentColor }}
                  />
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-white uppercase text-[10px] tracking-wider">
                      {item.shortTitle}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-sans">
                      {item.label}
                    </span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Block: Status, Portal Jump, Logout */}
      <div className="flex flex-col gap-2.5 w-full pt-4 border-t border-zinc-800/80">
        {/* Clickable Labs Indicator in compact mode */}
        {!isExpanded && onSelectLab && (
          <button
            type="button"
            onClick={() => {
              const nextIdx = (LAB_OPTIONS.findIndex((l) => l.slug === activeLab) + 1) % LAB_OPTIONS.length;
              onSelectLab(LAB_OPTIONS[nextIdx].slug);
            }}
            className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-white cursor-pointer hover:bg-zinc-800 transition-colors mx-auto"
            title={`Aktivt Lab: ${activeLab} (Klik for at skifte)`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  LAB_OPTIONS.find((l) => l.slug === activeLab)?.color || "#009FE3",
              }}
            />
          </button>
        )}

        {/* Return to Public Portal */}
        <Link
          href="/"
          className={`rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors flex items-center ${
            isExpanded
              ? "px-3 py-2 gap-2 text-xs"
              : "w-8 h-8 justify-center mx-auto"
          }`}
          title="Tilbage til Portalen"
        >
          <ArrowLeft size={16} weight="bold" />
          {isExpanded && <span className="text-xs">Offentlig Portal</span>}
        </Link>

        {/* Local Node Active Indicator */}
        <div
          className={`flex items-center text-zinc-400 cursor-default ${
            isExpanded
              ? "px-3 py-1.5 gap-2 text-[10px]"
              : "justify-center"
          }`}
          title="Lokal Node Status: Aktiv"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          {isExpanded && <span>Lokal Node Aktiv</span>}
        </div>

        {/* Logout Action */}
        <button
          type="button"
          onClick={onLogout}
          className={`rounded-lg bg-zinc-900 hover:bg-rose-950/60 border border-zinc-800 hover:border-rose-700/80 text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer flex items-center ${
            isExpanded
              ? "px-3 py-2 gap-2 text-xs font-bold"
              : "w-8 h-8 justify-center mx-auto"
          }`}
          title="Log ud af Admin"
        >
          <SignOut size={16} weight="bold" />
          {isExpanded && <span>Log ud</span>}
        </button>
      </div>
    </aside>
  );
}
