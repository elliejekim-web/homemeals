import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import MealOptionGroup from "./MealOptionGroup";

type MealOption = "EARLY" | "NORMAL" | "LATE";

type Status =
  | "OPEN"
  | "CLOSING"
  | "CLOSED";

type Props = {
  icon: string;
  title: string;

  status: Status;

  closeTime: string;

  value: MealOption;

  disabled: boolean;

  onChange: (value: MealOption) => void;
};

export default function MealCard({
  icon,
  title,
  status,
  closeTime,
  value,
  disabled,
  onChange,
}: Props) {
  return (
    <Card className="mb-6">

      <div className="flex items-center justify-between">

        <h2 className="text-xl font-semibold">
          {icon} {title}
        </h2>

        <StatusBadge
          status={status}
        />

      </div>

      <p className="mt-2 text-sm text-gray-500">
        {closeTime}
      </p>

      <div className="mt-5">

        <MealOptionGroup
          value={value}
          disabled={disabled}
          onChange={onChange}
        />

      </div>

    </Card>
  );
}