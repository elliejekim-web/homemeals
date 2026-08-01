import SummaryCard from "./SummaryCard";

type Props = {
  peopleAtHome: number;
  homeNames: string[];

  massCount: number;
  massNames: string[];

  today: string;
};

export default function DashboardStats({
  peopleAtHome,
  homeNames,
  massCount,
  massNames,
  today,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* 1. People at Home */}
      <SummaryCard title="🏠 People at Home" value={peopleAtHome}>
        <div className="mt-3">
          {homeNames.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No members at home</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {homeNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center rounded-lg bg-gray-50 border border-gray-200/60 px-2.5 py-1 text-xs font-medium text-gray-700"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
      </SummaryCard>

      {/* 2. Mass Attendance */}
      <SummaryCard title="⛪ Mass Attendance" value={massCount}>
        <div className="mt-3">
          {massNames.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No attendees scheduled</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {massNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center rounded-lg bg-blue-50/60 border border-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
      </SummaryCard>

      {/* 3. Today's Date */}
      <SummaryCard title="📅 Date" value={today} />
    </div>
  );
}