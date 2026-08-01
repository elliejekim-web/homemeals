"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addVacation, deleteVacation } from "@/actions/vacationActions";

type Vacation = {
  id: string;
  start_date: string;
  end_date: string;
  reason?: string;
};

type Props = {
  vacations: Vacation[];
};

export default function VacationClient({ vacations: initialVacations }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [vacations, setVacations] = useState<Vacation[]>(initialVacations);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 날짜 포맷 헬퍼 (YYYY-MM-DD -> M/D)
  function formatDate(dateStr: string) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    return `${parseInt(parts[1], 10)}/${parseInt(parts[2], 10)}`;
  }

  // 휴가 추가 처리
  function handleAdd() {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    if (startDate > endDate) {
      alert("Start date cannot be later than end date.");
      return;
    }

    startTransition(async () => {
      try {
        const newVacation = await addVacation({
          start_date: startDate,
          end_date: endDate,
        });

        if (newVacation) {
          setVacations((prev) => [...prev, newVacation]);
          setStartDate("");
          setEndDate("");
          router.refresh();
        }
      } catch (error) {
        console.error("Failed to add vacation:", error);
        alert("Failed to add vacation. Please try again.");
      }
    });
  }

  // 휴가 삭제 처리
  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this vacation schedule?")) {
      return;
    }

    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteVacation(id);
        setVacations((prev) => prev.filter((item) => item.id !== id));
        router.refresh();
      } catch (error) {
        console.error("Failed to delete vacation:", error);
        alert("Failed to delete vacation. Please try again.");
      } finally {
        setDeletingId(null);
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Upper Navigation & Title */}
      <div className="space-y-2">
        <Link
          href="/member"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>←</span> Back to Dashboard
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Vacation / Away Schedule
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Register the periods when you will be away to automatically excuse meals and Mass.
          </p>
        </div>
      </div>

      {/* Add Vacation Form */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          Add New Vacation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleAdd}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {isPending && !deletingId ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Adding...</span>
              </>
            ) : (
              <span>Add Vacation Schedule</span>
            )}
          </button>
        </div>
      </div>

      {/* Registered Vacations List */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          Registered Vacations ({vacations.length})
        </h2>

        {vacations.length === 0 ? (
          <div className="py-8 text-center text-xs sm:text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">
            No vacations registered yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {vacations.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-gray-50/80 border border-gray-200/60 p-3.5 sm:p-4 hover:bg-gray-100/50 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span>🌴 {item.start_date} ~ {item.end_date}</span>
                    <span className="text-xs font-medium text-gray-400 hidden sm:inline">
                      ({formatDate(item.start_date)} - {formatDate(item.end_date)})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  {deletingId === item.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}