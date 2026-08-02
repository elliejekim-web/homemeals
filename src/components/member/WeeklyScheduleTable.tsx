"use client";

type MealOption = "EARLY" | "NORMAL" | "LATE" | "NONE";

type DaySchedule = {
  date: string;       // "2026-07-27"
  dayName: string;    // "MONDAY"
  feast?: string;
  familyEvent?: {
    title: string;
    category?: string;
    note?: string;
  } | null;
  vacation?: boolean;
  mass: boolean;
  breakfast: MealOption;
  lunch: MealOption;
  dinner: MealOption;
};

type Props = {
  schedules: DaySchedule[];
  onChange: (
    date: string,
    field: "mass" | "breakfast" | "lunch" | "dinner",
    value: any
  ) => void;
};

const options: MealOption[] = ["NONE", "EARLY", "NORMAL", "LATE"];

function label(v: MealOption) {
  switch (v) {
    case "NONE": return "No meal";
    case "EARLY": return "Early";
    case "NORMAL": return "Normal";
    case "LATE": return "Late";
  }
}

// "2026-07-27" -> "7/27" 로 변환하는 안전한 헬퍼
function formatMMDD(dateStr: string) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  return `${parseInt(parts[1], 10)}/${parseInt(parts[2], 10)}`;
}

export default function WeeklyScheduleTable({ schedules, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
      
      {/* 1. Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/80 text-xs font-bold text-gray-500 uppercase border-b border-gray-200/80">
            <tr>
              <th className="p-4 w-52">Date</th>
              <th className="p-4 text-center">Mass</th>
              <th className="p-4 text-center">Breakfast</th>
              <th className="p-4 text-center">Lunch</th>
              <th className="p-4 text-center">Dinner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedules.map((item) => (
              <tr key={item.date} className="hover:bg-gray-50/50 transition-colors">
                {/* Date & Event Metadata */}
                <td className="p-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-gray-900">
                      {item.dayName.charAt(0) + item.dayName.slice(1).toLowerCase()}
                    </span>
                    <span className="text-xs font-medium text-gray-400">
                      {formatMMDD(item.date)}
                    </span>
                    {item.vacation && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200/60">
                        🌴 Vacation
                      </span>
                    )}
                  </div>

                  {/* Feast & Family Event Indicators */}
                  <div className="mt-1 space-y-0.5">
                    {item.feast && (
                      <p
                        className="text-[11px] text-purple-600 font-medium truncate max-w-[180px] flex items-center gap-1"
                        title={item.feast}
                      >
                        <span>✨</span>
                        <span className="truncate">{item.feast}</span>
                      </p>
                    )}

                    {item.familyEvent && (
                      <p
                        className="text-[11px] text-rose-600 font-semibold truncate max-w-[180px] flex items-center gap-1"
                        title={`${item.familyEvent.title}${item.familyEvent.note ? ` (${item.familyEvent.note})` : ''}`}
                      >
                        <span>🎉</span>
                        <span className="truncate">{item.familyEvent.title}</span>
                      </p>
                    )}
                  </div>
                </td>

                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={item.mass}
                    onChange={(e) => onChange(item.date, "mass", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  />
                </td>

                {(["breakfast", "lunch", "dinner"] as const).map((field) => (
                  <td key={field} className="p-4 text-center">
                    <select
                      value={item[field]}
                      onChange={(e) => onChange(item.date, field, e.target.value)}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs focus:border-blue-500 focus:outline-none"
                    >
                      {options.map((o) => (
                        <option key={o} value={o}>
                          {label(o)}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. Mobile View */}
      <div className="block md:hidden divide-y divide-gray-100">
        {schedules.map((item) => (
          <div key={item.date} className="p-4 space-y-3">
            <div className="flex items-start justify-between pb-2 border-b border-gray-100">
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-base text-gray-900">
                    {item.dayName.charAt(0) + item.dayName.slice(1).toLowerCase()}
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    {formatMMDD(item.date)}
                  </span>
                  {item.vacation && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200/60">
                      🌴 Vacation
                    </span>
                  )}
                </div>

                {/* Mobile Events */}
                {item.feast && (
                  <p className="text-[11px] text-purple-600 font-medium truncate max-w-[200px] flex items-center gap-1">
                    <span>✨</span>
                    <span>{item.feast}</span>
                  </p>
                )}

                {item.familyEvent && (
                  <p className="text-[11px] text-rose-600 font-semibold truncate max-w-[200px] flex items-center gap-1">
                    <span>🎉</span>
                    <span>{item.familyEvent.title}</span>
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200/60 shrink-0">
                <span>Mass</span>
                <input
                  type="checkbox"
                  checked={item.mass}
                  onChange={(e) => onChange(item.date, "mass", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20"
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(["breakfast", "lunch", "dinner"] as const).map((field) => (
                <div key={field} className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block tracking-wider">
                    {field}
                  </span>
                  <select
                    value={item[field]}
                    onChange={(e) => onChange(item.date, field, e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-2 py-2 text-sm font-medium text-gray-800 shadow-2xs focus:border-blue-500 focus:outline-none"
                  >
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {label(o)}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}