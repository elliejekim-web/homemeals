type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function MassCheckbox({
  value,
  onChange,
}: Props) {
  return (
    <label className="flex items-center gap-2 mb-8">

      <input
        type="checkbox"
        checked={value}
        onChange={(e) =>
          onChange(e.target.checked)
        }
      />

      Attend Mass

    </label>
  );
}