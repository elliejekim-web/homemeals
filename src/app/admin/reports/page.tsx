import MealReportButton from "@/components/admin/MealReportButton";

export default function ReportsPage() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Page Header */}
      <header className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Monthly Meal Report
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Export and review monthly meal statistics for Sainthill
        </p>
      </header>

      {/* 2. Download Section Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 text-2xl shrink-0">
            📊
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {currentYear}년 {currentMonth}월 식수 리포트
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              이번 달 전체 인원 및 게스트의 식사 기록을 다운로드하거나 조회합니다.
            </p>
          </div>
        </div>

        {/* 리포트 다운로드/생성 버튼 */}
        <div className="shrink-0 self-end sm:self-center">
          <MealReportButton
            year={currentYear}
            month={currentMonth}
          />
        </div>
      </div>
    </div>
  );
}