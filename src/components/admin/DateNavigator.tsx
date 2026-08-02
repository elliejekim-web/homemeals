'use client';

import { useRouter } from 'next/navigation';

interface DateNavigatorProps {
  selectedDate: string;
  today: string;
}

export default function DateNavigator({ selectedDate, today }: DateNavigatorProps) {
  const router = useRouter();

  const handleDateChange = (newDate: string) => {
    router.push(`/admin?date=${newDate}`);
    router.refresh(); // 👈 URL 변경 후 서버 컴포넌트 최신 데이터 패칭 강제!
  };

  const shiftDate = (days: number) => {
    // string 'YYYY-MM-DD' 기반 날짜 계산 (타임존 이슈 방지)
    const [year, month, day] = selectedDate.split('-').map(Number);
    const d = new Date(year, month - 1, day + days);
    
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    
    handleDateChange(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
      <button
        type="button"
        onClick={() => shiftDate(-1)}
        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 font-bold text-sm"
        title="어제"
      >
        ◀
      </button>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => handleDateChange(e.target.value)}
        className="rounded-xl border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="button"
        onClick={() => shiftDate(1)}
        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 font-bold text-sm"
        title="내일"
      >
        ▶
      </button>

      {selectedDate !== today && (
        <button
          type="button"
          onClick={() => handleDateChange(today)}
          className="ml-1 text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded-lg transition-colors"
        >
          오늘
        </button>
      )}
    </div>
  );
}