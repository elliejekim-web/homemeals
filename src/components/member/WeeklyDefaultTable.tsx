"use client";

import { useState, useTransition } from "react";
import { saveWeeklyDefaults } from "@/actions/saveWeeklyDefaults";

type MealOption = "EARLY" | "NORMAL" | "LATE" | "NONE";

type Row = {
  day_of_week: string;
  mass: boolean;
  breakfast: MealOption;
  lunch: MealOption;
  dinner: MealOption;
};

const days = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const options: MealOption[] = ["NONE", "EARLY", "NORMAL", "LATE"];

function label(v: MealOption) {
  switch (v) {
    case "NONE":
      return "No meal";
    case "EARLY":
      return "Early";
    case "NORMAL":
      return "Normal";
    case "LATE":
      return "Late";
  }
}

// 요일 이름을 보기 좋게 변환하는 헬퍼 함수
function formatDayName(day: string, short = false) {
  const formatted = day.charAt(0) + day.slice(1).toLowerCase();
  return short ? formatted.slice(0, 3) : formatted;
}

export default function WeeklyDefaultTable({
  initialDefaults,
}: {
  initialDefaults: Row[];
}) {
  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [rows, setRows] = useState<Row[]>(
    days.map((d) => {
      const found = initialDefaults.find((r) => r.day_of_week === d);
      return (
        found ?? {
          day_of_week: d,
          mass: true,
          breakfast: "NORMAL",
          lunch: "NORMAL",
          dinner: "NORMAL",
        }
      );
    })
  );

  function update(index: number, field: keyof Row, value: any) {
    setSaveSuccess(false);
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveWeeklyDefaults(rows);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (error) {
        console.error(error);
        alert("Failed to save defaults. Please try again.");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs overflow-hidden">
      {/* 1. Desktop View: Table Layout (md 이상에서만 표시) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/80 text-xs font-bold text-gray-500 uppercase border-b border-gray-200/80">
            <tr>
              <th className="p-4">Day</th>
              <th className="p-4 text-center">Mass</th>
              <th className="p-4 text-center">Breakfast</th>
              <th className="p-4 text-center">Lunch</th>
              <th className="p-4 text-center">Dinner</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {rows.map((row, index) => (
              <tr key={row.day_of_week} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-gray-900">
                  {formatDayName(row.day_of_week)}
                </td>

                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={row.mass}
                    onChange={(e) => update(index, "mass", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  />
                </td>

                {(["breakfast", "lunch", "dinner"] as const).map((field) => (
                  <td key={field} className="p-4 text-center">
                    <select
                      value={row[field]}
                      onChange={(e) => update(index, field, e.target.value)}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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

      {/* 2. Mobile View: Card List Layout (md 미만 모바일 전용) */}
      <div className="block md:hidden divide-y divide-gray-100">
        {rows.map((row, index) => (
          <div key={row.day_of_week} className="p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-gray-900">
                  {formatDayName(row.day_of_week)}
                </span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200/60">
                <span>Mass</span>
                <input
                  type="checkbox"
                  checked={row.mass}
                  onChange={(e) => update(index, "mass", e.target.checked)}
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
                    value={row[field]}
                    onChange={(e) => update(index, field, e.target.value)}
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

      {/* Footer Action Area */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div className="text-xs">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold animate-fade-in">
              <span>✅</span> Saved successfully!
            </span>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Defaults</span>
          )}
        </button>
      </div>
    </div>
  );
}