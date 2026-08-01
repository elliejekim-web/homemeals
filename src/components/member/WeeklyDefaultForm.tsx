'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

import DayDefaultCard, {
  DayDefault,
} from './DayDefaultCard';
type Props = {
  defaults: DayDefault[];
};

const days = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

export default function WeeklyDefaultForm({
  defaults,
}: Props) {
  const supabase = createClient();

  const router = useRouter();

  const [saved, setSaved] = useState(false);

  const initialData: DayDefault[] = days.map((day) => {
    const existing = defaults.find(
      (d) => d.day_of_week === day
    );

    return (
      existing ?? {
        day_of_week: day,
        mass: true,
        breakfast: 'NORMAL',
        lunch: 'NORMAL',
        dinner: 'NORMAL',
      }
    );
  });

  const [data, setData] =
    useState<DayDefault[]>(initialData);

  const [saving, setSaving] =
    useState(false);

  function updateDay(
    day: string,
    value: DayDefault
  ) {
    setData((prev) =>
      prev.map((item) =>
        item.day_of_week === day
          ? value
          : item
      )
    );
  }

  async function save() {
    setSaving(true);

    const {
      data: authData,
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      alert('Please log in again.');
      setSaving(false);
      return;
    }

    const userId = authData.user.id;

    const payload = data.map((item) => ({
      user_id: userId,
      day_of_week: item.day_of_week,
      mass: item.mass,
      breakfast: item.breakfast,
      lunch: item.lunch,
      dinner: item.dinner,
    }));

    const { error } = await supabase
      .from('weekly_defaults')
      .upsert(payload, {
        onConflict: 'user_id,day_of_week',
      });

    setSaving(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setSaved(true);

    //alert('Defaults saved!');
    // 1초 후 member 화면으로 이동
    setTimeout(() => {
      router.push('/member');
    }, 1000);

    


  }

  return (
    <div>
      {data.map((day) => (
        <DayDefaultCard
          key={day.day_of_week}
          value={day}
          onChange={(v) =>
            updateDay(day.day_of_week, v)
          }
        />
      ))}

      <button
  onClick={save}
  disabled={saving}
  className="
    w-full
    rounded-xl
    bg-blue-600
    py-4
    text-white
    font-semibold
    hover:bg-blue-700
    disabled:bg-gray-400
  "
>
  {saving ? 'Saving...' : 'Save Defaults'}
</button>

{saved && (
  <div className="
    fixed
    bottom-6
    left-1/2
    -translate-x-1/2
    rounded-xl
    bg-green-600
    px-4
    py-3
    text-white
    shadow-lg
  ">
    ✓ Defaults saved
  </div>
)}
    </div>
  );
}