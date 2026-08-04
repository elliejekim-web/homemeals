export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

import MemberList from '@/components/admin/MemberList';
import MealMemberList from '@/components/admin/MealMemberList';
import DateNavigator from '@/components/admin/DateNavigator';

function getLiturgicalBadgeStyle(color?: string) {
  const c = color?.toLowerCase() ?? '';
  if (c.includes('red')) return 'bg-red-50 text-red-700 border-red-200';
  if (c.includes('green')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (c.includes('white') || c.includes('gold')) return 'bg-amber-50 text-amber-700 border-amber-200';
  if (c.includes('violet') || c.includes('purple')) return 'bg-purple-50 text-purple-700 border-purple-200';
  return 'bg-gray-50 text-gray-700 border-gray-200';
}

type SearchParams = Promise<{ date?: string }>;

export default async function AdminDashboard(props: { searchParams: SearchParams }) {
  const supabase = await createClient();
  const params = await props.searchParams;

  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
  }).format(new Date());

  const selectedDate = params.date ?? today;

  // 1. 회원 목록 조회
  const { data: users } = await supabase.from('users').select('id, display_name, full_name');

  // 2. 스케줄 조회
  let rawSchedules: any[] | null = null;

  const { data: fetchSchedules, error } = await supabase
    .from('daily_schedule')
    .select(`
      id, presence, mass, breakfast, lunch, dinner,
      users ( id, display_name, full_name )
    `)
    .eq('date', selectedDate);

  rawSchedules = fetchSchedules;

  if (error) console.error('Dashboard error:', error);

  //console.log(rawSchedules);

  // 해당 날짜 스케줄이 없을 경우 자동 생성
  if (!error && (!rawSchedules || rawSchedules.length === 0) && users && users.length > 0) {
    const defaultSchedules = users.map((user) => ({
      user_id: user.id,
      date: selectedDate,
      presence: 'HOME',
      mass: true,
      breakfast: 'NORMAL',
      lunch: 'NORMAL',
      dinner: 'NORMAL'
    }));

    const { data: createdSchedules, error: insertError } = await supabase
      .from('daily_schedule')
      .insert(defaultSchedules)
      .select(`
        id, presence, mass, breakfast, lunch, dinner,
        users ( id, display_name, full_name )
      `);

    if (!insertError && createdSchedules) {
      rawSchedules = createdSchedules;
    }
  }

  const schedules = (rawSchedules ?? []).map((s) => {
    const userObj = Array.isArray(s.users) ? s.users[0] : s.users;
    return { ...s, users: userObj ?? null };
  });

  // 3. 휴가 목록 조회
  const { data: vacations } = await supabase
    .from('vacations')
    .select('user_id, start_date, end_date');

  // 4. 안읽은 메시지
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

  // 계산 로직
  const awayUserIds = new Set(
    (vacations ?? [])
      .filter((v) => selectedDate >= v.start_date && selectedDate <= v.end_date)
      .map((v) => v.user_id)
  );

  const scheduleMap = new Map();
  schedules.forEach((s) => {
    const userId = s.users?.id;
    if (userId && !awayUserIds.has(userId)) {
      scheduleMap.set(userId, s);
    }
  });

  const activeSchedules = schedules.filter((s) => {
    const userId = s.users?.id;
    return userId && !awayUserIds.has(userId);
  });

  const homeMembers = (users ?? []).filter((user) => !awayUserIds.has(user.id));
  const massMembers = homeMembers.filter((user) => {
    const schedule = scheduleMap.get(user.id);
    return schedule?.mass ?? true;
  });

  const awayMembers = (users ?? []).filter((user) => awayUserIds.has(user.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. Compact Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Meal & Attendance Dashboard</h1>
          <p className="text-xs text-gray-500">Sainthill daily schedule management</p>
        </div>
        <DateNavigator selectedDate={selectedDate} today={today} />
      </header>

      {/* 2. Unread Message Alert (중요 알림이 있을때만 노출) */}
      {!!unreadCount && unreadCount > 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span>✉️</span>
            <span className="font-medium text-amber-900">
              You have <strong className="font-bold text-amber-950">{unreadCount} unread message(s)</strong>.
            </span>
          </div>
          <Link href="/admin/messages" className="font-bold text-amber-900 underline hover:text-amber-700">
            View &rarr;
          </Link>
        </div>
      )}

      {/* 3. Compact Info Bar (People at home, Mass, Liturgy, Vacations 축소 배치) */}
      <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs text-gray-600">
        
        {/* 요약 카운터 (Home & Mass) */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">🏠 At Home:</span>
            <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
              {homeMembers.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">⛪ Mass:</span>
            <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
              {massMembers.length}
            </span>
          </div>
        </div>

        {/* 전례력 정보 (축소) */}
        <div className="flex items-center gap-2 max-w-md truncate">
          <span className="text-gray-400 shrink-0">📅 Liturgy:</span>
          {feast ? (
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-gray-800 truncate">{feast.title}</span>
              {feast.color && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium border shrink-0 ${getLiturgicalBadgeStyle(feast.color)}`}>
                  {feast.color}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400 font-normal">No entry</span>
          )}
        </div>

        {/* 휴가자 정보 (축소) */}
        {awayMembers.length > 0 && (
          <div className="flex items-center gap-1.5 text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
            <span className="font-semibold">🌴 Vacation ({awayMembers.length}):</span>
            <span className="truncate max-w-[150px]">
              {awayMembers.map((u) => u.display_name || u.full_name || 'Unknown').join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* 4. MAIN FOCUS: Meal Roster Section */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <span>🍽️</span> Daily Meal Roster
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Meal attendance list for {selectedDate}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              Total Meal Users: {activeSchedules.filter((s) => s.breakfast || s.lunch || s.dinner).length}
            </span>

            <Link
              href="/admin/reports"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
            >
              <span>📊 Reports &rarr;</span>
            </Link>
          </div>
        </div>

        {/* 식사 리스트 카드를 메인으로 강조 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-1">
            <MealMemberList title="Breakfast" icon="🍳" meal="breakfast" schedules={activeSchedules} />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-1">
            <MealMemberList title="Lunch" icon="🥪" meal="lunch" schedules={activeSchedules} />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-1">
            <MealMemberList title="Dinner" icon="🍛" meal="dinner" schedules={activeSchedules} />
          </div>
        </div>
      </section>

    </div>
  );
}