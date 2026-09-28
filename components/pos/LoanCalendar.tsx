"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getCalendarLoans } from "@/app/actions/pos";
import { CalendarDayCell } from "./CalendarDayCell";

interface LoanCalendarProps {
  labSlug?: string;
  syncTrigger?: number;
  onSync?: () => void;
  onSelectLoan?: (loan: any) => void;
}

type CalendarFilterTab = "ALL" | "ACTIVE" | "RETURNERINGER" | "RETURNED";

export function LoanCalendar({ labSlug = "medialab", syncTrigger = 0, onSync, onSelectLoan }: LoanCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeFilter, setActiveFilter] = useState<CalendarFilterTab>("ALL");
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const curYear = currentDate.getFullYear();
  const curMonth = currentDate.getMonth();

  // Calculate calendar matrix
  const daysMatrix = useMemo(() => {
    const firstDayOfMonth = new Date(curYear, curMonth, 1);
    const lastDayOfMonth = new Date(curYear, curMonth + 1, 0);

    // Monday-first offset (0=Sunday, 1=Monday ... 6=Saturday)
    const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // Leading days from previous month
    for (let i = startDayIndex; i > 0; i--) {
      days.push({
        date: new Date(curYear, curMonth, 1 - i),
        isCurrentMonth: false,
      });
    }

    // Days of current month
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      days.push({
        date: new Date(curYear, curMonth, d),
        isCurrentMonth: true,
      });
    }

    // Trailing days from next month to fill grid of 35
    const totalSlots = days.length > 35 ? 42 : 35;
    const remainingSlots = totalSlots - days.length;
    for (let n = 1; n <= remainingSlots; n++) {
      days.push({
        date: new Date(curYear, curMonth + 1, n),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [curYear, curMonth]);

  const fetchMonthLoans = useCallback(async () => {
    if (daysMatrix.length === 0) return;
    try {
      setIsLoading(true);
      const startDate = daysMatrix[0].date;
      const endDate = daysMatrix[daysMatrix.length - 1].date;
      endDate.setHours(23, 59, 59, 999);

      const res = await getCalendarLoans({
        startDate,
        endDate,
        labSlug,
      });
      setLoans(res);
    } catch (err) {
      console.error("Failed to load calendar loans", err);
    } finally {
      setIsLoading(false);
    }
  }, [daysMatrix, labSlug]);

  useEffect(() => {
    fetchMonthLoans();
  }, [fetchMonthLoans, syncTrigger]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(curYear, curMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(curYear, curMonth + 1, 1));
  };

  const toLocalDateKey = (d: Date | string) => {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getEventsForDay = (date: Date) => {
    const dStr = toLocalDateKey(date);

    return loans.filter((loan) => {
      const checkoutStr = toLocalDateKey(loan.checkoutDate);
      const expectedStr = toLocalDateKey(loan.expectedReturn);

      const isOverdue =
        loan.isOverdue || (loan.status === "ACTIVE" && new Date(loan.expectedReturn) < new Date());

      if (activeFilter === "ACTIVE" && loan.status !== "ACTIVE") return false;
      if (activeFilter === "RETURNED" && loan.status !== "RETURNED") return false;
      if (activeFilter === "RETURNERINGER" && !isOverdue && loan.status !== "ACTIVE") return false;

      return checkoutStr === dStr || expectedStr === dStr;
    });
  };

  const selectedDayEvents = getEventsForDay(selectedDate);

  const monthNamesDanishShort = [
    "JAN", "FEB", "MAR", "APR", "MAJ", "JUN",
    "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"
  ];
  const weekDayLabels = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

  const selectedDayFormatted = selectedDate.toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* LEFT: Kalender Matrix (Figma 79:855) */}
      <div className="xl:col-span-7 bg-[#151517] border border-[#333333] rounded-lg p-5 flex flex-col justify-between">
        {/* Top Header Row with Title, Month Switcher, and Category Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold font-headline text-white tracking-wide">
              Kalender
            </h2>

            {/* < MÅNED ÅR > Pill */}
            <div className="flex items-center bg-white text-black rounded px-2.5 py-0.5 text-xs font-mono font-medium shadow-sm">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Forrige måned"
                className="hover:font-bold pr-1.5 transition-colors cursor-pointer"
              >
                &lt;
              </button>
              <span className="tracking-wider uppercase text-[11px] font-bold">
                {monthNamesDanishShort[curMonth]} {curYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Næste måned"
                className="hover:font-bold pl-1.5 transition-colors cursor-pointer"
              >
                &gt;
              </button>
            </div>

            {isLoading && (
              <span className="text-[10px] text-zinc-500 animate-pulse font-mono">
                Syncing...
              </span>
            )}
          </div>

          {/* Category Filter Pills (ALLE, UDLÅNT, RETURNERINGER, AFLEVERET) */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
            {(
              [
                { id: "ALL" as const, label: "ALLE" },
                { id: "ACTIVE" as const, label: "UDLÅNT" },
                { id: "RETURNERINGER" as const, label: "RETURNERINGER" },
                { id: "RETURNED" as const, label: "AFLEVERET" },
              ] as const
            ).map((tab) => {
              const isSelected = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-white text-black font-bold"
                      : "text-[#888888] hover:text-white bg-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 7-Column Days of Week Header */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-white font-headline text-xs py-1">
          {weekDayLabels.map((day) => (
            <div key={day} className="py-0.5">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Matrix Grid */}
        <div className="grid grid-cols-7 gap-1.5 mt-1">
          {daysMatrix.map(({ date, isCurrentMonth }, idx) => {
            const events = getEventsForDay(date);
            const isToday =
              date.getDate() === new Date().getDate() &&
              date.getMonth() === new Date().getMonth() &&
              date.getFullYear() === new Date().getFullYear();
            const isSelected =
              date.getDate() === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getFullYear() === selectedDate.getFullYear();

            return (
              <CalendarDayCell
                key={idx}
                date={date}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday}
                isSelected={isSelected}
                events={events}
                onSelectDate={(d) => setSelectedDate(d)}
                onSelectLoan={(loan) => onSelectLoan?.(loan)}
              />
            );
          })}
        </div>
      </div>

      {/* RIGHT: Aktivitet Contextual Date Feed (Figma 79:1388) */}
      <div className="xl:col-span-5 bg-[#151517] border border-[#333333] rounded-lg p-5 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#2e2e2e]">
            <h3 className="text-base font-bold font-headline text-white leading-tight">
              Aktivitet <span className="text-[#FFED00]">{selectedDayFormatted}</span>
            </h3>
            <span className="text-xs font-mono text-zinc-400">
              {selectedDayEvents.length} registrering(er)
            </span>
          </div>

          {/* Loan List on Selected Date */}
          <div className="mt-3 space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
            {selectedDayEvents.length === 0 ? (
              <div className="p-6 rounded-lg border border-dashed border-[#333333] bg-[#202021]/30 text-center text-xs text-zinc-500 font-mono">
                Ingen planlagte udlån eller returneringer på denne dato.
              </div>
            ) : (
              selectedDayEvents.map((loan) => {
                const isOverdue =
                  loan.isOverdue ||
                  (loan.status === "ACTIVE" && new Date(loan.expectedReturn) < new Date());

                const checkoutFormatted = new Date(loan.checkoutDate).toLocaleDateString("da-DK", {
                  day: "numeric",
                  month: "short",
                });
                const returnFormatted = new Date(loan.expectedReturn).toLocaleDateString("da-DK", {
                  day: "numeric",
                  month: "short",
                });

                return (
                  <div
                    key={loan.id}
                    onClick={() => onSelectLoan?.(loan)}
                    className="bg-[#202021] border border-[#444444] hover:border-[#009FE3] hover:bg-[#252528] rounded-lg p-3 text-xs font-mono transition-all cursor-pointer group"
                    title="Klik for at åbne i aktiv session"
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Left: Gear Title, Asset Tag, Checkout Date */}
                      <div className="min-w-0 flex-1">
                        <div className="font-bold font-notch text-white text-sm truncate group-hover:text-[#009FE3] transition-colors">
                          {loan.inventory?.name || "Equipment Item"}
                        </div>
                        <div className="text-zinc-300 font-bold mt-0.5 text-xs">
                          Tag: <span className="text-[#009FE3]">[{loan.inventory?.assetTag}]</span>
                        </div>
                        <div className="text-zinc-400 text-[11px] mt-0.5">
                          Udlånt: {checkoutFormatted}
                        </div>
                      </div>

                      {/* Right: Status Pill, Patron Tag, Return Date */}
                      <div className="text-right shrink-0">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                            isOverdue
                              ? "bg-[#E6007E] text-white"
                              : loan.status === "RETURNED"
                              ? "bg-zinc-700 text-zinc-300"
                              : "bg-white text-black"
                          }`}
                        >
                          {isOverdue ? "OVERSKREDET" : loan.status === "RETURNED" ? "AFLEVERET" : "UDLÅNT"}
                        </span>
                        <div className="text-zinc-400 font-bold text-xs mt-1">
                          [{loan.patron?.studentId || "student"}]
                        </div>
                        <div className="text-zinc-400 text-[11px] mt-0.5">
                          Retur: {returnFormatted}
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#444444] my-2 group-hover:border-zinc-700 transition-colors" />

                    {/* Action Row */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500 group-hover:text-zinc-400 font-mono transition-colors">
                        Indsæt i aktiv session
                      </span>
                      <span className="text-zinc-400 group-hover:text-[#009FE3] font-headline font-bold transition-colors flex items-center gap-1">
                        <span>Åbn i session →</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
