import { createClient } from "@/lib/supabase/server";
import MemberDashboard from "@/components/member/MemberDashboard";

export const dynamic = "force-dynamic";

// 서울 기준 날짜 포맷터 헬퍼
function getSeoulDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(date);
}

export default async function MemberPage() {
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
            Please log in to access your personal meal schedule and community roster.
          </p>
        </div>
      </div>
    );
  }

  // 2. 서울 기준 오늘 날짜 계산
  const today = getSeoulDateString();

  // 3. 이번 주 월요일 ~ 일요일 날짜 배열 생성 (서울 시간 기준 안전한 연산)
  const [year, month, dayStr] = today.split("-").map(Number);
  const currentDate = new Date(Date.UTC(year, month - 1, dayStr));
  
  // getUTCDay: 0(일), 1(월), ..., 6(토)
  const dayOfWeek = currentDate.getUTCDay(); 
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(currentDate);
    d.setUTCDate(currentDate.getUTCDate() + diffToMonday + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  // 4. DB 쿼리 병렬 처리 (Promise.all)
  const [defaultsRes, dailyRes, feastsRes] = await Promise.all([
    supabase
      .from("weekly_defaults")
      .select("*")
      .eq("user_id", user.id),
    supabase
      .from("daily_schedule")
      .select("*")
      .eq("user_id", user.id)
      .in("date", dates),
    supabase
      .from("liturgical_calendar")
      .select("date, title")
      .in("date", dates),
  ]);

  const defaults = defaultsRes.data ?? [];
  const daily = dailyRes.data ?? [];
  const feasts = feastsRes.data ?? [];

  // 5. O(1) Lookups을 위한 Lookup Maps 생성
  const defaultMap = new Map(defaults.map((item) => [item.day_of_week?.toUpperCase(), item]));
  const dailyMap = new Map(daily.map((item) => [item.date, item]));
  const feastMap = new Map(feasts.map((item) => [item.date, item]));

  // 6. 스케줄 통합 데이터 가공
  const schedules = dates.map((date) => {
    const dailyItem = dailyMap.get(date);
    const feastItem = feastMap.get(date);

    // 날짜의 요일명 (예: "MONDAY")
    const [y, m, d] = date.split("-").map(Number);
    const utcDate = new Date(Date.UTC(y, m - 1, d));
    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      timeZone: "UTC",
    })
      .format(utcDate)
      .toUpperCase();

    const defaultItem = defaultMap.get(weekday);

    return {
      date,
      dayName: weekday,
      feast: feastItem?.title,
      mass: dailyItem?.mass ?? defaultItem?.mass ?? true,
      breakfast: dailyItem?.breakfast ?? defaultItem?.breakfast ?? "NORMAL",
      lunch: dailyItem?.lunch ?? defaultItem?.lunch ?? "NORMAL",
      dinner: dailyItem?.dinner ?? defaultItem?.dinner ?? "NORMAL",
    };
  });

  return <MemberDashboard today={today} schedules={schedules} />;
}