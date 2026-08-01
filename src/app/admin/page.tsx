import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

import DashboardStats from '@/components/admin/DashboardStats';
import MemberList from '@/components/admin/MemberList';
import MealMemberList from '@/components/admin/MealMemberList';

// 전례 색상별 배지 스타일 헬퍼
function getLiturgicalBadgeStyle(color?: string) {
  const c = color?.toLowerCase() ?? '';
  if (c.includes('red')) return 'bg-red-100 text-red-800 border-red-200';
  if (c.includes('green')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (c.includes('white') || c.includes('gold')) return 'bg-amber-100 text-amber-800 border-amber-200';
  if (c.includes('violet') || c.includes('purple')) return 'bg-purple-100 text-purple-800 border-purple-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
}

type SearchParams = Promise<{ date?: string }>;

export default async function AdminDashboard(props: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const params = await props.searchParams;

  // 서울 기준 오늘 날짜
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
  }).format(new Date());

  const selectedDate = params.date ?? today;

  // 1. 회원 목록 조회
  const { data: users } = await supabase
    .from('users')
    .select('id, display_name, full_name');

  // 2. 선택된 날짜의 스케줄 조회
  const { data: rawSchedules, error } = await supabase
    .from('daily_schedule')
    .select(`
      id,
      presence,
      mass,
      breakfast,
      lunch,
      dinner,
      users (
        id,
        display_name,
        full_name
      )
    `)
    .eq('date', selectedDate);

  if (error) console.error('Dashboard error:', error);

  // ----------------------------------------------------
  // schedules 데이터 정규화 (users가 배열/객체 상관없이 단일 객체로 통일)
  // ----------------------------------------------------
  const schedules = (rawSchedules ?? []).map((s) => {
    const userObj = Array.isArray(s.users) ? s.users[0] : s.users;
    return {
      ...s,
      users: userObj ?? null,
    };
  });

  // 3. 휴가 목록 조회
  const { data: vacations } = await supabase
    .from('vacations')
    .select('user_id, start_date, end_date');

  // 4. 읽지 않은 메시지 수 조회
  const { count: unreadCount } = await supabase
    .from('member_messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  // 5. 전례력 조회
  const { data: feast } = await supabase
    .from('liturgical_calendar')
    .select('*')
    .eq('date', selectedDate)
    .single();

  // ----------------------------------------------------
  // 데이터 가공 (Map/Set을 이용한 O(1) 성능 최적화)
  // ----------------------------------------------------

  // (1) 부재중(휴가) 사용자 Set
  const awayUserIds = new Set(
    (vacations ?? [])
      .filter((v) => selectedDate >= v.start_date && selectedDate <= v.end_date)
      .map((v) => v.user_id)
  );

  // (2) 스케줄 Lookup Map (User ID -> Schedule)
  type NormalizedSchedule = (typeof schedules)[number];
  const scheduleMap = new Map<string, NormalizedSchedule>();

  schedules.forEach((s) => {
    if (s.users?.id) {
      scheduleMap.set(s.users.id, s);
    }
  });

  // (3) 재가(Home) 멤버 필터링
  const homeMembers = (users ?? []).filter((user) => !awayUserIds.has(user.id));
  const homeNames = homeMembers.map(
    (u) => u.display_name || u.full_name || 'Unknown'
  );

  // (4) 미사 참석 멤버 필터링 (O(1) Map 검색)
  const massMembers = homeMembers.filter((user) => {
    const schedule = scheduleMap.get(user.id);
    return schedule?.mass ?? true; // 기본값 true
  });
  const massNames = massMembers.map(
    (u) => u.display_name || u.full_name || 'Unknown'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Top Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Community schedule & attendance overview
          </p>
        </div>
      </header>

      {/* 2. 읽지 않은 메시지 Alert 배너 */}
      {!!unreadCount && unreadCount > 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl">✉️</span>
            <p className="text-sm font-medium text-amber-900">
              You have <strong className="font-bold text-amber-950">{unreadCount} unread message(s)</strong> from community members.
            </p>
          </div>
          <Link
            href="/admin/messages"
            className="text-xs font-bold text-amber-900 underline hover:text-amber-700 transition-colors"
          >
            View Messages &rarr;
          </Link>
        </div>
      )}

      {/* 3. Bento Grid: 전례력 + 날짜 컨트롤 */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 전례력 Card */}
        {feast ? (
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  📅 Today's Liturgy
                </span>
                {feast.color && (
                  <span
                    className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${getLiturgicalBadgeStyle(
                      feast.color
                    )}`}
                  >
                    {feast.color}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {feast.title}
              </h2>

              {feast.gospel && (
                <p className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="font-semibold text-gray-900">📖 Gospel:</span> {feast.gospel}
                </p>
              )}

              {feast.note && (
                <p className="mt-2 text-xs text-gray-500 italic pl-1">{feast.note}</p>
              )}
            </div>

            {feast.rank && (
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                Rank: <span className="font-medium text-gray-700">{feast.rank}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-6 flex items-center justify-center text-gray-400 text-sm">
            No liturgical calendar entry for this date.
          </div>
        )}

        {/* Right: 날짜 선택 Control Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Select Date
            </h3>
            <form action="/admin" className="space-y-3">
              <input
                type="date"
                name="date"
                defaultValue={selectedDate}
                className="w-full rounded-xl border-gray-300 bg-gray-50 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                View Schedule
              </button>
            </form>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Selected: <strong className="text-gray-900">{selectedDate}</strong></span>
            {selectedDate === today && (
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                Today
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 4. 핵심 통계 Card */}
      <DashboardStats
        peopleAtHome={homeMembers.length}
        massCount={massMembers.length}
        today={selectedDate}
      />

      {/* 5. 식사 명단 Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Meal Roster</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Daily meal attendance breakdown
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
            Total Meal Registrations: {
              schedules.filter(s => s.breakfast || s.lunch || s.dinner).length
            }
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MealMemberList
            title="Breakfast"
            icon="🍳"
            meal="breakfast"
            schedules={schedules}
          />
          <MealMemberList
            title="Lunch"
            icon="🥪"
            meal="lunch"
            schedules={schedules}
          />
          <MealMemberList
            title="Dinner"
            icon="🍛"
            meal="dinner"
            schedules={schedules}
          />
        </div>
      </section>

      {/* 6. 전체 멤버 스케줄 목록 */}
      <section className="pt-4 space-y-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            All Members for {selectedDate}
          </h2>
        </div>
        <MemberList schedules={schedules} />
      </section>
    </div>
  );
}