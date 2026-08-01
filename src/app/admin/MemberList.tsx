import MemberCard from './MemberCard';

interface User {
  id: string;
  display_name?: string | null;
  full_name?: string | null;
}

export interface ScheduleItem {
  id: string;
  presence?: boolean;
  mass?: boolean;
  breakfast?: boolean;
  lunch?: boolean;
  dinner?: boolean;
  users?: User | User[];
}

type Props = {
  schedules: ScheduleItem[];
};

export default function MemberList({ schedules }: Props) {
  // 스케줄 데이터가 없는 경우
  if (!schedules || schedules.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl mb-2">
          📋
        </div>
        <p className="text-sm font-semibold text-gray-700">No schedules recorded</p>
        <p className="text-xs text-gray-400 mt-1">
          There are no member schedules or attendance logs for this date.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {schedules.map((item) => (
        <MemberCard key={item.id} member={item} />
      ))}
    </div>
  );
}