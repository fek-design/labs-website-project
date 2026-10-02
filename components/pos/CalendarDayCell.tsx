"use client";

import React from "react";

interface CalendarDayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: any[];
  onSelectDate: (date: Date) => void;
  onSelectLoan?: (loan: any) => void;
}

export function CalendarDayCell({
  date,
  isCurrentMonth,
  isToday,
  isSelected,
  events,
  onSelectDate,
}: CalendarDayCellProps) {
  const dayNum = date.getDate();

  const hasOverdue = events.some(
    (loan) =>
      loan.isOverdue ||
      (loan.status === "ACTIVE" && new Date(loan.expectedReturn) < new Date())
  );
  const hasActive = events.some((loan) => loan.status === "ACTIVE");
  const hasReturned = events.some((loan) => loan.status === "RETURNED");

  return (
    <button
      type="button"
      onClick={() => onSelectDate(date)}
      className={`h-[42px] px-2 py-1.5 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer ${
        isSelected
          ? "border-[#FFED00] bg-[#222126] shadow-sm"
          : isToday
          ? "border-[#009FE3] bg-[#101720]"
          : isCurrentMonth
          ? "border-[#2e2e2e] bg-[#141414] hover:border-zinc-500 hover:bg-[#1a1a1c]"
          : "border-[#1e1e1e] bg-[#0c0c0e] opacity-40 hover:opacity-70 hover:border-zinc-700"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <span
          className={`text-xs font-mono font-medium leading-none ${
            isSelected
              ? "text-[#FFED00] font-bold"
              : isToday
              ? "text-[#009FE3] font-bold"
              : isCurrentMonth
              ? "text-zinc-200"
              : "text-zinc-600"
          }`}
        >
          {dayNum}
        </span>

        {events.length > 0 && (
          <span className="text-[10px] font-mono text-zinc-400">
            {events.length}
          </span>
        )}
      </div>

      {/* Subtle indicator dots */}
      <div className="flex items-center gap-1 overflow-hidden h-1.5">
        {hasOverdue && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#E6007E] shrink-0 animate-pulse" />
        )}
        {hasActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#009FE3] shrink-0" />
        )}
        {hasReturned && !hasActive && !hasOverdue && (
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
        )}
      </div>
    </button>
  );
}
