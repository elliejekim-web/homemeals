"use client";

type MealOption = "EARLY" | "NORMAL" | "LATE" | "NONE";

type DaySchedule = {
  date: string;       // "2026-07-27"
  dayName: string;    // "MONDAY"
  feast?: string;
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
      
      {/* 1. Desktop View: hidden md:block (모바일에서는 숨김 처리) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/80 text-xs font-bold text-gray-500 uppercase border-b border-gray-200/80">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4 text-center">Mass</th>
              <th className="p-4 text-center">Breakfast</th>
              <th className="p-4 text-center">Lunch</th>
              <th className="p-4 text-center">Dinner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedules.map((item) => (
              <tr key={item.date} className="hover:bg-gray-50/50 transition-colors">
                {/* 날짜/요일 - 여기서 깔끔하게 1번만 조합하여 출력 */}
                <td className="p-4">
                  <div className="font-bold text-gray-900">
                    {item.dayName.charAt(0) + item.dayName.slice(1).toLowerCase()}
                  </div>
                  <div className="text-xs font-medium text-gray-400">
                    {formatMMDD(item.date)}
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

      {/* 2. Mobile View: block md:hidden (데스크탑에서는 숨김 처리) */}
      <div className="block md:hidden divide-y divide-gray-100">
        {schedules.map((item) => (
          <div key={item.date} className="p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              {/* 요일과 날짜를 1개의 flex 라인으로 단 1번만 깔끔하게 구성 */}
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-base text-gray-900">
                  {item.dayName.charAt(0) + item.dayName.slice(1).toLowerCase()}
                </span>
                <span className="text-xs font-medium text-gray-400">
                  {formatMMDD(item.date)}
                </span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200/60">
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