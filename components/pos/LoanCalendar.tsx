"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getCalendarLoans } from "@/app/actions/pos";
import { CalendarDayCell } from "./CalendarDayCell";
import { LoanDetailModal } from "./LoanDetailModal";
import { motion } from "motion/react";

interface LoanCalendarProps {
  labSlug?: string;
  syncTrigger?: number;
  onSync?: () => void;
}

export function LoanCalendar({ labSlug = "medialab", syncTrigger = 0, onSync }: LoanCalendarProps) {
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

  // Load calendar on month/lab change and on external sync triggers (checkout/returns)
  useEffect(() => {
    fetchMonthLoans();
  }, [fetchMonthLoans, syncTrigger]);

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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-full border border-[#262626] bg-[#0D0D0D] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#FFED00] transition-colors"
          >
            ‹
          </button>
          <h2 className="text-xl font-bold tracking-tight text-white min-w-[180px] text-center">
            {monthNames[curMonth]} {curYear}
          </h2>
          <button
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-full border border-[#262626] bg-[#0D0D0D] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#FFED00] transition-colors"
          >
            ›
          </button>
          <button
            type="button"
            onClick={handleToday}
            className="text-xs font-bold text-zinc-400 hover:text-white bg-[#0D0D0D] border border-[#262626] px-3 py-1 rounded-full transition-colors"
          >
            Today
          </button>
          {isLoading && (
            <span className="text-xs text-zinc-500 animate-pulse">Syncing...</span>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0D0D0D] border border-[#262626] p-1 rounded-full text-xs">
          {(
            [
              { id: "ALL", label: "All Events" },
              { id: "ACTIVE", label: "Checked Out" },
              { id: "DUE_TODAY", label: "Due Today" },
              { id: "OVERDUE", label: "Overdue" },
              { id: "RETURNED", label: "Returned" },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setStatusFilter(filter.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                statusFilter === filter.id
                  ? filter.id === "OVERDUE"
                    ? "bg-[#E6007E] text-white"
                    : filter.id === "DUE_TODAY"
                    ? "bg-[#FFED00] text-black"
                    : filter.id === "ACTIVE"
                    ? "bg-[#009FE3] text-black"
                    : "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Days of the week + Month Matrix */}
      <div className="mt-4 grid grid-cols-7 gap-2">
        {weekDayLabels.map((day) => (
          <div
            key={day}
            className="text-center text-zinc-500 font-bold text-[11px] uppercase tracking-wider py-1"
          >
            {day}
          </div>
        ))}

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
              onSelectLoan={(loan) => setInspectingLoan(loan)}
            />
          );
        })}
      </div>

      {/* Selected Day Agenda Inspection */}
      <div className="mt-6 pt-4 border-t border-[#262626]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase text-zinc-400">
            Agenda for {selectedDate.toLocaleDateString("en-DK", { month: "short", day: "numeric", year: "numeric" })}
          </h3>
          <span className="text-xs text-zinc-500 font-mono">
            {selectedDayEvents.length} event(s) recorded
          </span>
        </div>

        {selectedDayEvents.length === 0 ? (
          <div className="text-zinc-600 text-xs py-4 text-center">
            No checkouts or scheduled returns on this date.
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedDayEvents.map((loan) => {
              const isOverdue =
                loan.isOverdue || (loan.status === "ACTIVE" && new Date(loan.expectedReturn) < new Date());

              return (
                <div
                  key={loan.id}
                  onClick={() => setInspectingLoan(loan)}
                  className={`p-3.5 rounded-2xl border bg-[#0D0D0D] cursor-pointer transition-all hover:scale-[1.01] ${
                    loan.status === "RETURNED"
                      ? "border-[#262626] text-zinc-400"
                      : isOverdue
                      ? "border-[#E6007E]/50 hover:border-[#E6007E]"
                      : "border-[#262626] hover:border-[#009FE3]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {loan.inventory?.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        loan.status === "RETURNED"
                          ? "bg-zinc-800 text-zinc-400 border-zinc-700"
                          : isOverdue
                          ? "bg-[#E6007E]/20 text-[#E6007E] border-[#E6007E]"
                          : "bg-[#009FE3]/20 text-[#009FE3] border-[#009FE3]"
                      }`}
                    >
                      {isOverdue ? "OVERDUE" : loan.status === "ACTIVE" ? "CHECKED OUT" : loan.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between">
                    <span>Tag: <strong className="text-white">[{loan.inventory?.assetTag}]</strong></span>
                    <span>Student: <strong className="text-[#FFED00]">{loan.patron?.studentId}</strong></span>
                  </div>

                  <div className="text-[10px] text-zinc-500 mt-2 flex items-center justify-between">
                    <span>Out: {new Date(loan.checkoutDate).toLocaleDateString("en-DK", { month: "short", day: "numeric" })}</span>
                    <span className={isOverdue ? "text-[#E6007E] font-bold" : "text-zinc-400"}>
                      Due: {new Date(loan.expectedReturn).toLocaleDateString("en-DK", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Loan Inspection & Action Modal */}
      {inspectingLoan && (
        <LoanDetailModal
          loan={inspectingLoan}
          isOpen={!!inspectingLoan}
          onClose={() => setInspectingLoan(null)}
          onRefresh={() => {
            fetchMonthLoans();
            if (onSync) onSync();
          }}
        />
      )}
    </div>
  );
}
