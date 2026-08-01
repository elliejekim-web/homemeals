import Card from '@/components/ui/Card';
import MealOptionGroup from './MealOptionGroup';

type MealOption = 'EARLY' | 'NORMAL' | 'LATE';

export type DayDefault = {
  day_of_week: string;
  mass: boolean;
  breakfast: MealOption;
  lunch: MealOption;
  dinner: MealOption;
};

type Props = {
  value: DayDefault;
  onChange: (value: DayDefault) => void;
};

export default function DayDefaultCard({ value, onChange }: Props) {
  function updateField<K extends keyof DayDefault>(
    key: K,
    fieldValue: DayDefault[K]
  ) {
    onChange({
      ...value,
      [key]: fieldValue,
    });
  }

  return (
    <Card className="mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {value.day_of_week}
      </h2>

      <label className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          checked={value.mass}
          onChange={(e) => updateField('mass', e.target.checked)}
        />
        Attend Mass
      </label>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">🍳 Breakfast</h3>
          <MealOptionGroup
            value={value.breakfast}
            onChange={(v) => updateField('breakfast', v)}
          />
        </div>

        <div>
          <h3 className="font-medium mb-2">🥪 Lunch</h3>
          <MealOptionGroup
            value={value.lunch}
            onChange={(v) => updateField('lunch', v)}
          />
        </div>

        <div>
          <h3 className="font-medium mb-2">🍛 Dinner</h3>
          <MealOptionGroup
            value={value.dinner}
            onChange={(v) => updateField('dinner', v)}
          />
        </div>
      </div>
    </Card>
  );
}