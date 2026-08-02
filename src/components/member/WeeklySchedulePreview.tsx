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

function getMealConfig(value: MealOption) {
  switch (value) {
    case 'EARLY':
      return { label: 'Early', style: 'bg-amber-50 text-amber-700 border-amber-200/60' };
    case 'LATE':
      return { label: 'Late', style: 'bg-indigo-50 text-indigo-700 border-indigo-200/60' };
    case 'NORMAL':
      return { label: 'Normal', style: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' };
    case 'NONE':
    default:
      return { label: 'Skip', style: 'bg-gray-100 text-gray-400 border-transparent' };
  }
}

function MealBadge({ value }: { value: MealOption }) {
  const { label, style } = getMealConfig(value);

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[62px] px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${style}`}
    >
      {label}
    </span>
  );
}

export default function WeeklySchedulePreview({ schedules }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <h2 className="text-base font-bold text-gray-900">This Week's Schedule</h2>
        </div>

        <Link
          href="/member/schedule"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-3 py-1.5 rounded-lg transition-colors"
        >
          <span>Edit</span>
          <span>&rarr;</span>
        </Link>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600 border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 uppercase tracking-wider font-semibold text-[11px]">
              <th scope="col" className="py-3 px-4 w-44">Day</th>
              <th scope="col" className="py-3 px-2 text-center w-16">Mass</th>
              <th scope="col" className="py-3 px-2 text-center">🍳 Breakfast</th>
              <th scope="col" className="py-3 px-2 text-center">🥪 Lunch</th>
              <th scope="col" className="py-3 px-2 text-center">🍛 Dinner</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {schedules.map((item) => {
              const [, month, day] = item.date.split('-');
              const formattedDate = `${month}.${day}`;

              return (
                <tr
                  key={item.date}
                  className={`transition-colors hover:bg-gray-50/50 ${
                    item.isToday ? 'bg-blue-50/30' : ''
                  }`}
                >
                  {/* Date, Day & Events */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className={`font-bold text-sm ${item.isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                        {item.dayName.slice(0, 3)}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {formattedDate}
                      </span>
                      {item.isToday && (
                        <span className="ml-1 text-[10px] font-bold text-blue-600 bg-blue-100/80 px-1.5 py-0.5 rounded">
                          Today
                        </span>
                      )}
                    </div>

                    {/* Events Container */}
                    <div className="mt-1 space-y-0.5">
                      {/* 전례력 (Feast) */}
                      {item.feast && (
                        <p
                          className="text-[11px] text-purple-600 font-medium truncate max-w-[150px] flex items-center gap-1"
                          title={item.feast}
                        >
                          <span>✨</span>
                          <span className="truncate">{item.feast}</span>
                        </p>
                      )}

                      {/* 가족 이벤트 (Family Event) */}
                      {item.familyEvent && (
                        <p
                          className="text-[11px] text-rose-600 font-semibold truncate max-w-[150px] flex items-center gap-1"
                          title={`${item.familyEvent.title}${item.familyEvent.note ? ` (${item.familyEvent.note})` : ''}`}
                        >
                          <span>🎉</span>
                          <span className="truncate">{item.familyEvent.title}</span>
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Mass Status */}
                  <td className="py-3.5 px-2 text-center">
                    {item.mass ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100/60 text-emerald-700 font-bold text-xs">
                        ✓
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-300 font-normal text-xs">
                        -
                      </span>
                    )}
                  </td>

                  {/* Meals */}
                  <td className="py-3.5 px-2 text-center">
                    <MealBadge value={item.breakfast} />
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <MealBadge value={item.lunch} />
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <MealBadge value={item.dinner} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}