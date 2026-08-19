"use client";

import React from "react";

interface CalendarDayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: any[];
  onSelectDate: (date: Date) => void;
  onSelectLoan: (loan: any) => void;
}

export function CalendarDayCell({
  date,
  isCurrentMonth,
  isToday,
  isSelected,
  events,
  onSelectDate,
  onSelectLoan,
}: CalendarDayCellProps) {
  const dayNum = date.getDate();
  const maxPillsToShow = 2;
  const overflowCount = events.length - maxPillsToShow;

  const getPillStyle = (loan: any) => {
    const isOverdue =
      loan.isOverdue || (loan.status === "ACTIVE" && new Date(loan.expectedReturn) < new Date());

    if (loan.status === "RETURNED") {
      return "bg-[#1f1f1f] text-zinc-400 border-[#333333]";
    }
    if (loan.status === "DAMAGED" || isOverdue) {
      return "bg-[#E6007E]/20 text-[#E6007E] border-[#E6007E]/50 font-bold";
    }
    // Check if due on this specific date
    const expected = new Date(loan.expectedReturn);
    if (
      expected.getFullYear() === date.getFullYear() &&
      expected.getMonth() === date.getMonth() &&
      expected.getDate() === date.getDate()
    ) {
      return "bg-[#FFED00]/20 text-[#FFED00] border-[#FFED00]/50 font-semibold";
    }

    return "bg-[#009FE3]/20 text-[#009FE3] border-[#009FE3]/50";
  };

  return (
    <div
      onClick={() => onSelectDate(date)}
      className={`min-h-[100px] p-2 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
        isSelected
          ? "border-[#FFED00] bg-[#1a1a1a] shadow-lg shadow-[#FFED00]/5"
          : isToday
          ? "border-[#009FE3]/60 bg-[#121820]/40"
          : isCurrentMonth
          ? "border-[#262626] bg-[#0D0D0D] hover:border-zinc-500"
          : "border-[#1c1c1c] bg-black/40 text-zinc-600 hover:border-zinc-700 opacity-60"
      }`}
    >
      {/* Date Header */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${
            isToday
              ? "bg-[#009FE3] text-black"
              : isSelected
              ? "bg-[#FFED00] text-black"
              : isCurrentMonth
              ? "text-zinc-300"
              : "text-zinc-600"
          }`}
        >
          {dayNum}
        </span>

        {events.length > 0 && (
          <span className="text-[10px] font-mono text-zinc-500">
            {events.length} {events.length === 1 ? "loan" : "loans"}
          </span>
        )}
      </div>

      {/* Events List */}
      <div className="mt-1.5 space-y-1 overflow-hidden">
        {events.slice(0, maxPillsToShow).map((loan) => (
          <button
            key={loan.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectLoan(loan);
            }}
            className={`w-full text-left truncate text-[10px] font-mono px-2 py-0.5 rounded-md border transition-transform hover:scale-[1.02] ${getPillStyle(
              loan
            )}`}
            title={`${loan.inventory?.name} (${loan.inventory?.assetTag}) - ${loan.patron?.studentId}`}
          >
            <span className="font-semibold">{loan.inventory?.assetTag}:</span>{" "}
            {loan.inventory?.name?.slice(0, 14)}
          </button>
        ))}

        {overflowCount > 0 && (
          <div className="text-[9px] font-mono text-zinc-400 pl-1">
            +{overflowCount} more...
          </div>
        )}
      </div>
    </div>
  );
}
