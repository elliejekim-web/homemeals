import Card from "@/components/ui/Card";

type Props = {
  title: string;
  value: string | number;
  icon?: string;
};

export default function SummaryCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <Card>

      <div className="flex items-center gap-3">

        {icon && (
          <span className="text-3xl">
            {icon}
          </span>
        )}

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="text-4xl font-bold mt-1">
            {value}
          </p>
        </div>

      </div>

    </Card>
  );
}