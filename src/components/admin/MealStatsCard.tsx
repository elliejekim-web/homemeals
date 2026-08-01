
import Card from '@/components/ui/Card';

type Stats = {
  EARLY: number;
  NORMAL: number;
  LATE: number;
};

type Props = {
  title: string;
  icon: string;
  stats: Stats;
};

export default function MealStatsCard({
  title,
  icon,
  stats,
}: Props) {
  const total =
    stats.EARLY +
    stats.NORMAL +
    stats.LATE;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {icon} {title}
        </h2>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          {total} total
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>🌅 Early</span>
          <span className="font-semibold">
            {stats.EARLY}
          </span>
        </div>

        <div className="flex justify-between">
          <span>☀️ Normal</span>
          <span className="font-semibold">
            {stats.NORMAL}
          </span>
        </div>

        <div className="flex justify-between">
          <span>🌙 Late</span>
          <span className="font-semibold">
            {stats.LATE}
          </span>
        </div>
      </div>
    </Card>
  );
}

