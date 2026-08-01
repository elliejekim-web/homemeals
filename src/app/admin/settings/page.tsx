
import { createClient } from '@/lib/supabase/server';
import AdminSettingsForm from '@/components/admin/AdminSettingsForm';

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from('app_settings')
    .select('*');

  const map = Object.fromEntries(
    (settings ?? []).map((s) => [s.key, s.value])
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Admin Settings
      </h1>

      <AdminSettingsForm settings={map} />
    </div>
  );
}

