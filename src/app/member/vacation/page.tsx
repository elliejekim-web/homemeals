import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VacationClient from "@/components/member/VacationClient";

export type Vacation = {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  reason?: string;
  created_at?: string;
};

export default async function VacationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 미인증 유저는 로그인 페이지로 리다이렉트
  if (!user) {
    redirect("/login");
  }

  const { data: vacations, error } = await supabase
    .from("vacations")
    .select("*")
    .eq("user_id", user.id)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Failed to fetch vacations:", error.message);
  }

  return <VacationClient vacations={(vacations as Vacation[]) ?? []} />;
}