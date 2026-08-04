
"use client";

import {
  useEffect,
  useState,
  useTransition,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import WeeklyScheduleTable from "@/components/member/WeeklyScheduleTable";
import WeekNavigator from "@/components/member/WeeklyNavigator";
import { saveDailySchedule } from "@/actions/saveDailySchedule";

type MealOption =
  | "EARLY"
  | "NORMAL"
  | "LATE"
  | "NONE";

type DaySchedule = {
  date: string;
  dayName: string;

  feast?: string;

  familyEvent?: {
    title: string;
    category?: string;
    note?: string;
  } | null;

  vacation?: boolean;

  mass: boolean;

  breakfast: MealOption;
  lunch: MealOption;
  dinner: MealOption;
};

type Props = {
  initialSchedules: DaySchedule[];
};

export default function MemberHomeClient({
  initialSchedules,
}: Props) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [schedules, setSchedules] =
    useState<DaySchedule[]>(
      initialSchedules
    );

  const [changed, setChanged] =
    useState(false);

  const [changedDates, setChangedDates] =
    useState<Set<string>>(
      new Set()
    );

  const [saveSuccess, setSaveSuccess] =
    useState(false);

  // 서버 데이터 변경 시 상태 동기화
  useEffect(() => {
    setSchedules(initialSchedules);
    setChanged(false);
    setChangedDates(new Set());
  }, [initialSchedules]);

  // 주간 범위
  const startDate = schedules[0]?.date;
  const endDate =
    schedules[schedules.length - 1]?.date;

  // 주 이동
  const changeWeek = useCallback(
    (offset: number) => {
      if (!startDate) return;

      const [year, month, day] =
        startDate.split("-").map(Number);

      const utcDate = new Date(
        Date.UTC(year, month - 1, day)
      );

      utcDate.setUTCDate(
        utcDate.getUTCDate() + offset * 7
      );

      const week =
        utcDate.toISOString().split("T")[0];

      startTransition(() => {
        router.push(
          `/member/schedule?week=${week}`
        );
      });
    },
    [router, startDate]
  );

  // 오늘 이동
  const goToday = useCallback(() => {
    startTransition(() => {
      router.push("/member/schedule");
    });
  }, [router]);

  // 값 변경
  const handleChange = useCallback(
    (
      date: string,
      field:
        | "mass"
        | "breakfast"
        | "lunch"
        | "dinner",
      value: any
    ) => {
      setSchedules((previous) =>
        previous.map((item) =>
          item.date === date
            ? { ...item, [field]: value }
            : item
        )
      );

      setSaveSuccess(false);
      setChanged(true);

      setChangedDates((previous) => {
        const next = new Set(previous);
        next.add(date);
        return next;
      });
    },
    []
  );

  // 저장
  const handleSave = useCallback(() => {
    startTransition(async () => {
      try {
        const changedSchedules =
          schedules.filter((item) =>
            changedDates.has(item.date)
          );

        await saveDailySchedule(
          changedSchedules
        );

        setChanged(false);
        setChangedDates(new Set());

        setSaveSuccess(true);

        setTimeout(
          () => setSaveSuccess(false),
          3000
        );

        // router.refresh() 제거
      } catch (error) {
        console.error(
          "Failed to save daily schedule:",
          error
        );

        alert(
          "Failed to save schedule. Please try again."
        );
      }
    });
  }, [changedDates, schedules]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/member"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>←</span>
          Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              My Weekly Schedule
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Customize your attendance for
              Mass and meals.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                ✅ Changes saved!
              </span>
            )}

            {changed && (
              <button
                onClick={handleSave}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {isPending
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Week navigator */}
      <WeekNavigator
        startDate={startDate}
        endDate={endDate}
        onPrevious={() => changeWeek(-1)}
        onNext={() => changeWeek(1)}
        onToday={goToday}
      />

      {/* Schedule table */}
      <WeeklyScheduleTable
        schedules={schedules}
        onChange={handleChange}
      />

      {/* Mobile save bar */}
      {changed && (
        <div className="sm:hidden fixed bottom-16 left-4 right-4 z-40 p-3 rounded-2xl border border-blue-100 bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-between">
          <div className="text-xs font-medium text-gray-700">
            Unsaved changes (
            <span className="font-bold text-blue-600">
              {changedDates.size}
            </span>
            )
          </div>

          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {isPending
              ? "Saving..."
              : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}

