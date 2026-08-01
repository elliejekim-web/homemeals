import Link from "next/link";

import WeeklySchedulePreview from "@/components/member/WeeklySchedulePreview";
import TodaySummaryCard from "@/components/member/TodaySummaryCard";
import QuickActions from "@/components/member/QuickActions";
import WeeklySummaryCard from "@/components/member/WeeklySummaryCard";

type MealOption = "EARLY" | "NORMAL" | "LATE" | "NONE";

type DaySchedule = {
  date: string;
  dayName: string;
  feast?: string;
  mass: boolean;
  breakfast: MealOption;
  lunch: MealOption;
  dinner: MealOption;
};

type Props = {
  today: string;
  schedules: DaySchedule[];
};

export default function MemberDashboard({ today, schedules }: Props) {
  const todaySchedule = schedules.find((item) => item.date === today);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              My Dashboard
            </h1>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Member
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your personal schedule, meal plans, and quick actions.
          </p>
        </div>

        {/* Today Badge */}
        <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs">
          <span>📅 Today:</span>
          <span className="text-blue-600 font-bold">{today}</span>
        </div>
      </div>

      {/* 2. Main Grid: Left (Overview & Details) vs Right (Quick Actions & Shortcuts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN (2 Columns Wide on Large Screens) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Weekly Schedule Overview */}
          <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Weekly Overview</h2>
                <p className="text-xs text-gray-500">
                  Your meal & mass presence for the next 7 days
                </p>
              </div>
              <Link
                href="/member/schedule"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
              >
                <span>✏️ Edit Schedule</span>
              </Link>
            </div>

            {/* Weekly Schedule Preview Component */}
            <WeeklySchedulePreview schedules={schedules} />
          </section>

          {/* Today's Detailed Schedule */}
          {/* {todaySchedule && (
            <section>
              <TodaySummaryCard schedule={todaySchedule} />
            </section>
          )} */}

          {/* Weekly Meal Breakdown Summary */}
          {/* <section>
            <WeeklySummaryCard schedules={schedules} />
          </section> */}
        </div>

        {/* RIGHT COLUMN (1 Column Wide) */}
        <div className="space-y-6 lg:sticky lg:top-24">
          
          {/* Quick Actions Panel */}
          <section className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Quick Actions</h2>
              <p className="text-xs text-gray-500">Shortcuts for common tasks</p>
            </div>
            
            <QuickActions />
          </section>

          {/* Helpful Tip Card */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <span>💡 Meal Policy Tip</span>
            </div>
            <p className="leading-relaxed text-amber-800/90">
              식사 일정 변경은 당일 오전 8시 전까지 수정해 주셔야 정상 반영됩니다. 긴급 변경 시 관리자에게 메시지를 남겨주세요.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}