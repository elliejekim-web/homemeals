import { createClient } from "@/lib/supabase/server";
import WeeklyDefaultTable from "@/components/member/WeeklyDefaultTable";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function WeeklyDefaultsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-6">Please log in.</div>;
  }

  const { data: defaults } = await supabase
    .from("weekly_defaults")
    .select("*")
    .eq("user_id", user.id)
    .order("day_of_week");

  return (
    <div className="max-w-5xl mx-auto p-6">
        <Link

            href="/member"

            className="
                inline-flex
                items-center
                gap-2
                mb-4
                text-sm
                font-medium
                text-blue-600
                hover:underline
            "

    >

    ← Dashboard

    </Link>

      <h1 className="text-3xl font-bold mb-6">
        Weekly Defaults
      </h1>

      <p className="text-gray-600 mb-6">
        Set your usual weekly pattern. You only need to edit special dates in
        the Schedule page.
      </p>

      <WeeklyDefaultTable initialDefaults={defaults ?? []} />
    </div>
  );
}