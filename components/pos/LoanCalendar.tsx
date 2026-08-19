"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getCalendarLoans } from "@/app/actions/pos";
import { CalendarDayCell } from "./CalendarDayCell";
import { LoanDetailModal } from "./LoanDetailModal";
import { motion } from "motion/react";

interface LoanCalendarProps {
  labSlug?: string;
}

export function LoanCalendar({ labSlug = "medialab" }: LoanCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "DUE_TODAY" | "OVERDUE" | "RETURNED">("ALL");
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inspectingLoan, setInspectingLoan] = useState<any | null>(null);

  const curYear = currentDate.getFullYear();
  const curMonth = currentDate.getMonth();

  // Calculate calendar matrix with useMemo to avoid recomputation on render
  const daysMatrix = useMemo(() => {
    // First day of current month
    const firstDayOfMonth = new Date(curYear, curMonth, 1);
    // Last day of current month
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

    // Trailing days from next month to fill grid of 35 or 42
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

  // Load calendar strictly on month/lab changes without continuous interval polling
  useEffect(() => {
    fetchMonthLoans();
  }, [fetchMonthLoans]);

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(curYear, curMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(curYear, curMonth + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Format Date to YYYY-MM-DD in local user timezone to avoid UTC -1 day offset
  const toLocalDateKey = (d: Date | string) => {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Filter events for a given calendar day
  const getEventsForDay = (date: Date) => {
    const dStr = toLocalDateKey(date);

    return loans.filter((loan) => {
      const checkoutStr = toLocalDateKey(loan.checkoutDate);
      const expectedStr = toLocalDateKey(loan.expectedReturn);

      const isOverdue =
        loan.isOverdue || (loan.status === "ACTIVE" && new Date(loan.expectedReturn) < new Date());

      if (statusFilter === "ACTIVE" && loan.status !== "ACTIVE") return false;
      if (statusFilter === "RETURNED" && loan.status !== "RETURNED") return false;
      if (statusFilter === "OVERDUE" && !isOverdue) return false;
      if (statusFilter === "DUE_TODAY") {
        const todayStr = toLocalDateKey(new Date());
        if (expectedStr !== todayStr || loan.status !== "ACTIVE") return false;
      }

      return checkoutStr === dStr || expectedStr === dStr;
    });
  };

  const selectedDayEvents = getEventsForDay(selectedDate);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekDayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-2xl font-mono">
      {/* Top Header / Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-zinc-500">
              Loan Schedule
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0D0D0D] border border-[#262626] text-[11px] text-[#009FE3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#009FE3] animate-pulse" />
              <span>Event Matrix</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-3">
            <span>
              {monthNames[curMonth]} {curYear}
            </span>
            {isLoading && (
              <div className="w-4 h-4 border-2 border-[#009FE3] border-t-transparent rounded-full animate-spin" />
            )}
          </h2>
        </div>

        {/* Controls: Prev/Today/Next & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Navigation Buttons */}
          <div className="flex items-center bg-[#0D0D0D] border border-[#262626] rounded-full p-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-[#262626] rounded-full text-zinc-300 hover:text-white transition-colors"
              title="Previous Month"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-[#262626] rounded-full text-zinc-300 hover:text-white transition-colors"
              title="Next Month"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1 bg-[#0D0D0D] border border-[#262626] rounded-full p-1 text-[11px]">
            {(
              [
                { id: "ALL", label: "All" },
                { id: "ACTIVE", label: "Active" },
                { id: "DUE_TODAY", label: "Due Today" },
                { id: "OVERDUE", label: "Overdue" },
                { id: "RETURNED", label: "Returned" },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setStatusFilter(filter.id)}
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  statusFilter === filter.id
                    ? filter.id === "OVERDUE"
                      ? "bg-[#E6007E] text-white font-bold"
                      : filter.id === "DUE_TODAY"
                      ? "bg-[#FFED00] text-black font-bold"
                      : filter.id === "ACTIVE"
                      ? "bg-[#009FE3] text-black font-bold"
                      : "bg-white text-black font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-[11px] text-zinc-400 border-b border-[#262626]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#009FE3]" />
            <span>Active Loan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFED00]" />
            <span>Due on Date</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E6007E]" />
            <span>Overdue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
            <span>Returned</span>
          </div>
        </div>
        <div>Click any day or event badge to inspect & check in gear</div>
      </div>

      {/* Calendar Grid */}
      <div className="mt-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          {weekDayLabels.map((lbl) => (
            <div key={lbl} className="py-1">
              {lbl}
            </div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 gap-2">
          {daysMatrix.map((item, idx) => {
            const isToday =
              item.date.toDateString() === new Date().toDateString();
            const isSelected =
              item.date.toDateString() === selectedDate.toDateString();
            const dayEvents = getEventsForDay(item.date);

            return (
              <CalendarDayCell
                key={idx}
                date={item.date}
                isCurrentMonth={item.isCurrentMonth}
                isToday={isToday}
                isSelected={isSelected}
                events={dayEvents}
                onSelectDate={(d) => setSelectedDate(d)}
                onSelectLoan={(l) => setInspectingLoan(l)}
              />
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Drawer */}
      <div className="mt-6 pt-5 border-t border-[#262626] bg-[#0D0D0D] border rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">
              Selected Agenda:{" "}
              <span className="text-[#FFED00]">
                {selectedDate.toLocaleDateString("en-DK", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </h4>
            <span className="text-xs text-zinc-500 font-bold">
              ({selectedDayEvents.length} event{selectedDayEvents.length === 1 ? "" : "s"})
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {selectedDayEvents.length === 0 ? (
            <p className="text-xs text-zinc-500 italic py-2">
              No equipment loans or return deadlines recorded for this date.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedDayEvents.map((loan) => (
                <div
                  key={loan.id}
                  onClick={() => setInspectingLoan(loan)}
                  className="bg-[#141414] border border-[#262626] hover:border-[#009FE3] p-3 rounded-xl cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{loan.inventory?.name}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          loan.isOverdue
                            ? "bg-[#E6007E]/20 text-[#E6007E]"
                            : loan.status === "RETURNED"
                            ? "bg-zinc-800 text-zinc-400"
                            : "bg-[#009FE3]/20 text-[#009FE3]"
                        }`}
                      >
                        {loan.isOverdue ? "OVERDUE" : loan.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#009FE3] mt-0.5">{loan.inventory?.assetTag}</div>
                    <div className="text-[10px] text-zinc-400 mt-1">Patron: {loan.patron?.studentId}</div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#262626] flex items-center justify-between text-[10px]">
                    <span className="text-zinc-500">
                      Due: {new Date(loan.expectedReturn).toLocaleTimeString("en-DK", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="text-[#009FE3] hover:underline font-bold">Inspect →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loan Inspection Modal */}
      <LoanDetailModal
        loan={inspectingLoan}
        isOpen={Boolean(inspectingLoan)}
        onClose={() => setInspectingLoan(null)}
        onRefresh={() => {
          fetchMonthLoans();
        }}
      />
    </div>
  );
}
