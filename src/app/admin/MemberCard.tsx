import Card from "@/components/ui/Card";

type Schedule = {
  id: string;
  presence?: string | boolean | null;
  mass?: boolean | null;
  breakfast?: string | boolean | null;
  lunch?: string | boolean | null;
  dinner?: string | boolean | null;
  users?: {
    display_name?: string | null;
    full_name?: string | null;
  } | null;
};

type Props = {
  member: Schedule;
};

// 참석 여부에 따른 배지 스타일 헬퍼 함수
function getMealBadge(
  label: string,
  icon: string,
  value: string | boolean | null | undefined,
  activeClass: string
) {
  // boolean 혹은 "Y" / "YES" / "참석" 등의 문자열 체크
  const isPresent =
    value === true ||
    (typeof value === "string" &&
      ["y", "yes", "true", "참석"].includes(value.toLowerCase().trim()));

  if (isPresent) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold shadow-2xs ${activeClass}`}
      >
        <span>{icon}</span>
        <span>{label}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50/80 px-2.5 py-1 text-xs font-medium text-gray-400">
      <span className="opacity-40">{icon}</span>
      <span className="line-through decoration-gray-300">{label}</span>
    </span>
  );
}

export default function MemberCard({ member }: Props) {
  const displayName =
    member.users?.display_name || member.users?.full_name || "Unknown Member";

  return (
    <Card className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-gray-300">
      {/* Header: 유저 이름 & 출석 상태 */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-sm font-bold text-gray-900 truncate">
            {displayName}
          </h3>
        </div>

        {/* 재가 / 부재 상태 뱃지 */}
        {member.presence && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200 shrink-0">
            🏠 {member.presence}
          </span>
        )}
      </div>

      {/* Body: 식사 신청 상태 (3개 아이템 가로/그리드 배치) */}
      <div className="mt-3.5 space-y-1.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Meal Attendance
        </p>

        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {getMealBadge(
            "Breakfast",
            "🍳",
            member.breakfast,
            "bg-amber-50 text-amber-900 border-amber-200"
          )}
          {getMealBadge(
            "Lunch",
            "🥪",
            member.lunch,
            "bg-emerald-50 text-emerald-900 border-emerald-200"
          )}
          {getMealBadge(
            "Dinner",
            "🍛",
            member.dinner,
            "bg-indigo-50 text-indigo-900 border-indigo-200"
          )}
        </div>
      </div>
    </Card>
  );
}