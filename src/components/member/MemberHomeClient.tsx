"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import WeeklyScheduleTable from "@/components/member/WeeklyScheduleTable";
import WeekNavigator from "@/components/member/WeeklyNavigator";
import { saveDailySchedule } from "@/actions/saveDailySchedule";

type MealOption = "EARLY" | "NORMAL" | "LATE" | "NONE";

type DaySchedule = {
  date: string;
  dayName: string;
  feast?: string;
  vacation?: boolean;
  mass: boolean;
  breakfast: MealOption;
  lunch: MealOption;
  dinner: MealOption;
};

type Props = {
  initialSchedules: DaySchedule[];
};

export default function MemberHomeClient({ initialSchedules }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [schedules, setSchedules] = useState<DaySchedule[]>(initialSchedules);
  const [changed, setChanged] = useState(false);
  const [changedDates, setChangedDates] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 서버 데이터(initialSchedules) 변경 시 클라이언트 상태 동기화 및 초기화
  useEffect(() => {
    setSchedules(initialSchedules);
    setChanged(false);
    setChangedDates([]);
  }, [initialSchedules]);

  // 주간 범위 계산
  const startDate = schedules[0]?.date;
  const endDate = schedules[schedules.length - 1]?.date;

  // 안전한 주 이동 처리 (UTC 파싱 적용)
  function changeWeek(offset: number) {
    if (!startDate) return;

    const [year, month, day] = startDate.split("-").map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day));
    
    // offset * 7일 이동
    utcDate.setUTCDate(utcDate.getUTCDate() + offset * 7);

    const week = utcDate.toISOString().split("T")[0];

    startTransition(() => {
      router.push(`/member/schedule?week=${week}`);
      router.refresh();
    });
  }

  function goToday() {
    startTransition(() => {
      router.push("/member/schedule");
      router.refresh();
    });
  }

  // 스케줄 값 변경 핸들러
  function handleChange(
    date: string,
    field: "mass" | "breakfast" | "lunch" | "dinner",
    value: any
  ) {
    setSchedules((previous) =>
      previous.map((item) => {
        if (item.date !== date) return item;
        return { ...item, [field]: value };
      })
    );

    setSaveSuccess(false);
    setChanged(true);
    setChangedDates((previous) =>
      previous.includes(date) ? previous : [...previous, date]
    );
  }

  // 저장 로직
  function handleSave() {
    startTransition(async () => {
      try {
        const changedSchedules = schedules.filter((item) =>
          changedDates.includes(item.date)
        );

        await saveDailySchedule(changedSchedules);

        setChanged(false);
        setChangedDates([]);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);

        router.refresh();
      } catch (error) {
        console.error("Failed to save daily schedule:", error);
        alert("Failed to save schedule. Please try again.");
      }
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 md:pb-12">
      {/* Upper Navigation & Title */}
      <div className="space-y-2">
        <Link
          href="/member"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>←</span> Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              My Weekly Schedule
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Customize your attendance for Mass and daily meals for this week.
            </p>
          </div>

          {/* 저장 완료 피드백 & 저장 버튼 (Desktop View) */}
          <div className="hidden sm:flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
                <span>✅</span> Changes saved!
              </span>
            )}

            {changed && (
              <button
                onClick={handleSave}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Week Navigator */}
      <WeekNavigator
        startDate={startDate}
        endDate={endDate}
        onPrevious={() => changeWeek(-1)}
        onNext={() => changeWeek(1)}
        onToday={goToday}
      />

      {/* Schedule Table Component */}
      <WeeklyScheduleTable schedules={schedules} onChange={handleChange} />

      {/* 모바일 전용 Sticky Floating Save Bar (변경사항이 생기면 화면 하단에 고정) */}
      {changed && (
        <div className="sm:hidden fixed bottom-16 left-4 right-4 z-40 p-3 rounded-2xl border border-blue-100 bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-between">
          <div className="text-xs font-medium text-gray-700">
            Unsaved changes (<span className="font-bold text-blue-600">{changedDates.length}</span>)
          </div>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}