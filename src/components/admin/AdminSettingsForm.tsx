
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';

type Props = {
  settings: Record<string, string>;
};

export default function AdminSettingsForm({
  settings,
}: Props) {
  const supabase = createClient();

  const [communityName, setCommunityName] =
    useState(settings.community_name ?? '');

  const [timezone, setTimezone] =
    useState(settings.timezone ?? 'Asia/Seoul');

  const [breakfastClose, setBreakfastClose] =
    useState(settings.breakfast_close ?? '19:00');

  const [lunchClose, setLunchClose] =
    useState(settings.lunch_close ?? '09:00');

  const [dinnerClose, setDinnerClose] =
    useState(settings.dinner_close ?? '15:00');

  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);

    const payload = [
      { key: 'community_name', value: communityName },
      { key: 'timezone', value: timezone },
      { key: 'breakfast_close', value: breakfastClose },
      { key: 'lunch_close', value: lunchClose },
      { key: 'dinner_close', value: dinnerClose },
    ];

    const { error } = await supabase
      .from('app_settings')
      .upsert(payload, {
        onConflict: 'key',
      });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert('Settings saved!');
  }

  return (
    <div className="space-y-6">
      <Card>
        <label className="block text-sm font-medium mb-2">
          Community Name
        </label>

        <input
          value={communityName}
          onChange={(e) => setCommunityName(e.target.value)}
          className="w-full rounded-xl border p-3"
        />
      </Card>

      <Card>
        <label className="block text-sm font-medium mb-2">
          Time Zone
        </label>

        <input
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full rounded-xl border p-3"
        />
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4">
          Meal Closing Times
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Breakfast
            </label>

            <input
              type="time"
              value={breakfastClose}
              onChange={(e) => setBreakfastClose(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Lunch
            </label>

            <input
              type="time"
              value={lunchClose}
              onChange={(e) => setLunchClose(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Dinner
            </label>

            <input
              type="time"
              value={dinnerClose}
              onChange={(e) => setDinnerClose(e.target.value)}
              className="w-full rounded-xl border p-3"
            />
          </div>
        </div>
      </Card>

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
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}

