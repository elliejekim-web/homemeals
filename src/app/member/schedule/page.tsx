import { createClient } from "@/lib/supabase/server";
import MemberHomeClient from "@/components/member/MemberHomeClient";

export const dynamic = "force-dynamic";

// 서울 기준 날짜 포맷 헬퍼 (YYYY-MM-DD)
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(date);
}

// 안전하게 해당 날짜의 월요일 구하기
function getMonday(baseDateStr: string): Date {
  const [year, month, day] = baseDateStr.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  
  const dayOfWeek = utcDate.getUTCDay(); // 0(일) ~ 6(토)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  utcDate.setUTCDate(utcDate.getUTCDate() + diffToMonday);
  return utcDate;
}

// 월요일부터 7일간의 날짜 배열 생성
function generateWeekDates(mondayUtc: Date): string[] {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(mondayUtc);
    d.setUTCDate(mondayUtc.getUTCDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

export default async function MemberSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. 미인증 사용자 처리
  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xs max-w-sm w-full space-y-4">
          <span className="text-4xl">🔒</span>
          <h2 className="text-lg font-bold text-gray-900">Authentication Required</h2>
          <p className="text-xs text-gray-500">
            Please log in to manage your schedule and preferences.
          </p>
        </div>
      </div>
    );
  }

  const params = await searchParams;

  // 2. 기준 날짜 및 주간 날짜 범위 계산
  const todaySeoul = formatDate(new Date());
  const baseDateStr = params.week ?? todaySeoul;

  const monday = getMonday(baseDateStr);
  const weekDates = generateWeekDates(monday);

  // 3. Supabase DB 쿼리 병렬 처리 (Promise.all)
  const [defaultsRes, dailyRes, feastsRes, vacationsRes] = await Promise.all([
    supabase
      .from("weekly_defaults")
      .select("*")
      .eq("user_id", user.id),
    supabase
      .from("daily_schedule")
      .select("*")
      .eq("user_id", user.id)
      .in("date", weekDates),
    supabase
      .from("liturgical_calendar")
      .select("date, title")
      .in("date", weekDates),
    supabase
      .from("vacations")
      .select("*")
      .eq("user_id", user.id),
  ]);

  const weeklyDefaults = defaultsRes.data ?? [];
  const dailySchedules = dailyRes.data ?? [];
  const feasts = feastsRes.data ?? [];
  const vacations = vacationsRes.data ?? [];

  // 4. O(1) 조회를 위한 Lookup Map 구성
  const defaultMap = new Map(
    weeklyDefaults.map((item) => [item.day_of_week?.toUpperCase(), item])
  );
  const dailyMap = new Map(dailySchedules.map((item) => [item.date, item]));
  const feastMap = new Map(feasts.map((item) => [item.date, item]));

  // 휴가 여부 체크 헬퍼
  const isVacationDay = (date: string) => {
    return vacations.some(
      (v) => date >= v.start_date && date <= v.end_date
    );
  };

  // 5. 스케줄 통합 데이터 가공
  const schedules = weekDates.map((date) => {
    const daily = dailyMap.get(date);
    const feast = feastMap.get(date);

    // 요일 이름 구하기 (예: "MONDAY")
    const [y, m, d] = date.split("-").map(Number);
    const utcDate = new Date(Date.UTC(y, m - 1, d));
    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      timeZone: "UTC",
    })
      .format(utcDate)
      .toUpperCase();

    const defaultValue = defaultMap.get(weekday);
    const away = isVacationDay(date);

    return {
      date,
      dayName: weekday,
      feast: feast?.title,
      vacation: away,
      mass: away
        ? false
        : daily?.mass ?? defaultValue?.mass ?? true,
      breakfast: away
        ? "NONE"
        : daily?.breakfast ?? defaultValue?.breakfast ?? "NORMAL",
      lunch: away
        ? "NONE"
        : daily?.lunch ?? defaultValue?.lunch ?? "NORMAL",
      dinner: away
        ? "NONE"
        : daily?.dinner ?? defaultValue?.dinner ?? "NORMAL",
    };
  });

  return <MemberHomeClient initialSchedules={schedules} />;
}