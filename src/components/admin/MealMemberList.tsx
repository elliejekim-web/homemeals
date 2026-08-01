
import Card from '@/components/ui/Card';

type Schedule = {
  id: string;
  breakfast: 'EARLY' | 'NORMAL' | 'LATE';
  lunch: 'EARLY' | 'NORMAL' | 'LATE';
  dinner: 'EARLY' | 'NORMAL' | 'LATE';
  users: {
    display_name: string;
  } | null;
};

type Props = {
  title: string;
  icon: string;
  meal: 'breakfast' | 'lunch' | 'dinner';
  schedules: Schedule[];
};

export default function MealMemberList({
  title,
  icon,
  meal,
  schedules,
}: Props) {
  const groups = {
    EARLY: schedules.filter((s) => s[meal] === 'EARLY'),
    NORMAL: schedules.filter((s) => s[meal] === 'NORMAL'),
    LATE: schedules.filter((s) => s[meal] === 'LATE'),
  };

  const total =
    groups.EARLY.length +
    groups.NORMAL.length +
    groups.LATE.length;

  function names(items: Schedule[]) {
    return items.length
      ? items
          .map((i) => i.users?.display_name ?? 'Unknown')
          .join(', ')
      : '—';
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {icon} {title}
        </h2>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          {total}
        </span>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <p className="font-semibold text-gray-700">
            🌅 Early ({groups.EARLY.length})
          </p>

          <p className="text-gray-600 mt-1">
            {names(groups.EARLY)}
          </p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">
            ☀️ Normal ({groups.NORMAL.length})
          </p>

          <p className="text-gray-600 mt-1">
            {names(groups.NORMAL)}
          </p>
        </div>

        <div>
          <p className="font-semibold text-gray-700">
            🌙 Late ({groups.LATE.length})
          </p>

          <p className="text-gray-600 mt-1">
            {names(groups.LATE)}
          </p>
        </div>
      </div>
    </Card>
  );
}

