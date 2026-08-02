import Link from "next/link";
import QuickActions from "@/components/member/QuickActions";
import WeeklySchedulePreview from "@/components/member/WeeklySchedulePreview";

export type MealOption = "EARLY" | "NORMAL" | "LATE" | "NONE";

export type DaySchedule = {
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
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      {/* 1. Header */}
      <header className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
            Member
          </span>
        </div>

        <div className="text-xs font-medium text-slate-500">
          Today: <span className="font-semibold text-slate-800">{today}</span>
        </div>
      </header>

      {/* 2. Quick Actions (단순 가로 정렬) */}
      <section className="flex items-center gap-3 overflow-x-auto pb-1">
        <QuickActions />
      </section>

      {/* 3. Main Content Grid */}
      <main className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        {/* Main Section: Weekly Schedule */}
        <section className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Weekly Schedule</h2>
              <Link
                href="/member/schedule"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Edit →
              </Link>
            </div>

            <WeeklySchedulePreview schedules={schedules} />
          </div>
        </section>

        {/* Sidebar: Tip */}
        <aside className="lg:sticky lg:top-6">
          <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 text-xs text-amber-900 space-y-1.5">
            <div className="font-bold text-amber-950 flex items-center gap-1">
              <span>💡 식사 변경 안내</span>
            </div>
            <p className="leading-relaxed text-amber-800/90">
              당일 식사 변경은 <strong className="font-semibold text-amber-950">오전 8시 전까지</strong> 수정해 주셔야 정상 반영됩니다.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}