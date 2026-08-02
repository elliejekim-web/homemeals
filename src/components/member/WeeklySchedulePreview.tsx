import Link from 'next/link';

export type MealOption = 'EARLY' | 'NORMAL' | 'LATE' | 'NONE';

export type DaySchedule = {
  date: string;
  dayName: string;
  feast?: string | null;
  familyEvent?: {
    title: string;
    category?: string;
    note?: string;
  } | null;
  mass: boolean;
  breakfast: MealOption;
  lunch: MealOption;
  dinner: MealOption;
  isToday?: boolean;
};

type Props = {
  schedules: DaySchedule[];
};

// 밝고 상큼한 파스텔 톤 배지 (Bright & Fresh Theme)
function MealBadge({ value }: { value: MealOption }) {
  switch (value) {
    case 'EARLY':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded-md bg-amber-50 text-amber-600 ring-1 ring-amber-200/60">
          Early
        </span>
      );
    case 'LATE':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-bold rounded-md bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200/60">
          Late
        </span>
      );
    case 'NORMAL':
      return (
        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/60">
          Normal
        </span>
      );
    case 'NONE':
    default:
      return <span className="text-xs font-normal text-slate-300">Skip</span>;
  }
}

export default function WeeklySchedulePreview({ schedules }: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 font-semibold text-xs">
            <th scope="col" className="pb-2.5 px-2">Day</th>
            <th scope="col" className="pb-2.5 px-1 text-center">Mass</th>
            <th scope="col" className="pb-2.5 px-1 text-center">Breakfast</th>
            <th scope="col" className="pb-2.5 px-1 text-center">Lunch</th>
            <th scope="col" className="pb-2.5 px-1 text-center">Dinner</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100/70">
          {schedules.map((item) => {
            const [, month, day] = item.date.split('-');

            return (
              <tr
                key={item.date}
                className={`transition-colors ${
                  item.isToday ? 'bg-sky-50/60' : 'hover:bg-slate-50/50'
                }`}
              >
                {/* 요일 / 날짜 / 이벤트 */}
                <td className="py-3 px-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-bold ${item.isToday ? 'text-sky-600' : 'text-slate-800'}`}>
                      {item.dayName.slice(0, 3)}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {month}.{day}
                    </span>

                    {item.isToday && (
                      <span className="text-[10px] font-bold text-sky-600 bg-sky-100/80 px-1.5 py-0.2 rounded">
                        Today
                      </span>
                    )}
                  </div>

                  {/* 이벤트 (밝고 또렷한 핑크/보라 톤) */}
                  {(item.feast || item.familyEvent) && (
                    <div className="mt-0.5 text-[11px] font-semibold text-violet-500 truncate max-w-[140px]">
                      {item.feast || item.familyEvent?.title}
                    </div>
                  )}
                </td>

                {/* 미사 여부 (화사한 민트 그린) */}
                <td className="py-3 px-1 text-center">
                  {item.mass ? (
                    <span className="text-sm font-bold text-teal-500">✓</span>
                  ) : (
                    <span className="text-sm text-slate-300">—</span>
                  )}
                </td>

                {/* 식사 현황 */}
                <td className="py-3 px-1 text-center">
                  <MealBadge value={item.breakfast} />
                </td>
                <td className="py-3 px-1 text-center">
                  <MealBadge value={item.lunch} />
                </td>
                <td className="py-3 px-1 text-center">
                  <MealBadge value={item.dinner} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}