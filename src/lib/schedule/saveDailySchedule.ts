import { createClient } from "@/lib/supabase/client";

export async function saveDailySchedule(
  scheduleId: string,
  values: {
    mass: boolean;
    breakfast: string;
    lunch: string;
    dinner: string;
  }
) {
  const supabase = createClient();

  return await supabase
    .from("daily_schedule")
    .update(values)
    .eq("id", scheduleId);
}