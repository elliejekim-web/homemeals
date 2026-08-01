import Card from "@/components/ui/Card";

type Props = {
  title: string;
  count: number;
  icon: string;
};

export default function MealSummaryCard({
  title,
  count,
  icon,
}: Props) {
  return (
    <Card>

      <div className="flex items-center gap-4">

        <div className="text-4xl">
          {icon}
        </div>


        <div>

          <p className="text-gray-500">
            {title}
          </p>


          <p className="text-4xl font-bold">
            {count}
          </p>

        </div>

      </div>

    </Card>
  );
}