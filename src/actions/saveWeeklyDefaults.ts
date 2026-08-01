"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveWeeklyDefaults(rows: any[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const payload = rows.map((r) => ({
    user_id: user.id,
    day_of_week: r.day_of_week,
    mass: r.mass,
    breakfast: r.breakfast,
    lunch: r.lunch,
    dinner: r.dinner,
  }));

  const { error } = await supabase
    .from("weekly_defaults")
    .upsert(payload, {
      onConflict: "user_id,day_of_week",
    });

  if (error) throw error;

  return { success: true };
}