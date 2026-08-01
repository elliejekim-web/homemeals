type MealOption = "EARLY" | "NORMAL" | "LATE";

type Props = {
  value: MealOption;
  disabled?: boolean;
  onChange: (value: MealOption) => void;
};

const options = [
  {
    value: "EARLY" as MealOption,
    label: "🌅 Early",
  },
  {
    value: "NORMAL" as MealOption,
    label: "☀️ Normal",
  },
  {
    value: "LATE" as MealOption,
    label: "🌙 Late",
  },
];

export default function MealOptionGroup({
  value,
  disabled = false,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`
              rounded-xl
              border
              py-4
              px-2
              text-center
              font-medium
              transition

              ${
                selected
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white hover:bg-gray-50"
              }

              ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}