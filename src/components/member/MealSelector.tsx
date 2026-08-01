type Props = {
  title: string;
  value: string;
  disabled: boolean;
  setValue: (value: string) => void;
};

const mealOptions = [
  "EARLY",
  "NORMAL",
  "LATE",
];

export default function MealSelector({
  title,
  value,
  disabled,
  setValue,
}: Props) {
  return (
    <div className="mb-8">

      <h2 className="mb-2 font-semibold">
        {title}

        {disabled && (
          <span className="ml-2 text-red-600 text-sm">
            🔒 Closed
          </span>
        )}
      </h2>

      {mealOptions.map((option) => (
        <label
          key={option}
          className={`block ${
            disabled ? "text-gray-400" : ""
          }`}
        >
          <input
            type="radio"
            checked={value === option}
            disabled={disabled}
            onChange={() => setValue(option)}
          />

          {" "}
          {option}
        </label>
      ))}

    </div>
  );
}