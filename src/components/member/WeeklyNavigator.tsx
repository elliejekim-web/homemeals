"use client";

type Props = {
  startDate: string;
  endDate: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

// 타임존 오차 없는 날짜 포맷 헬퍼 (YYYY-MM-DD -> M/D)
function formatDateRange(startDateStr: string, endDateStr: string) {
  if (!startDateStr || !endDateStr) return "";

  const parseMD = (str: string) => {
    const parts = str.split("-");
    if (parts.length !== 3) return str;
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    return `${month}/${day}`;
  };

  return `${parseMD(startDateStr)} - ${parseMD(endDateStr)}`;
}

export default function WeekNavigator({
  startDate,
  endDate,
  onPrevious,
  onNext,
  onToday,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-2 p-2 sm:p-3 rounded-2xl border border-gray-200/80 bg-white shadow-2xs">
      {/* 이전 주 버튼 */}
      <button
        onClick={onPrevious}
        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
        title="Previous Week"
      >
        <span>←</span>
        <span className="hidden sm:inline">Previous Week</span>
      </button>

      {/* 날짜 표시 및 Today 버튼 */}
      <div className="text-center">
        <div className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
          {formatDateRange(startDate, endDate)}
        </div>
        <button
          onClick={onToday}
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors mt-0.5"
        >
          Today
        </button>
      </div>

      {/* 다음 주 버튼 */}
      <button
        onClick={onNext}
        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
        title="Next Week"
      >
        <span className="hidden sm:inline">Next Week</span>
        <span>→</span>
      </button>
    </div>
  );
}