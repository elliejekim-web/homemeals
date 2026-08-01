import { createClient } from '@/lib/supabase/server';

import WeeklyDefaultForm from '@/components/member/WeeklyDefaultForm';

export default async function MemberSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: defaults } = await supabase
    .from('weekly_defaults')
    .select('*')
    .eq('user_id', user.id);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Weekly Meal Defaults
      </h1>

      <WeeklyDefaultForm
        defaults={defaults ?? []}
      />
    </div>
  );
}