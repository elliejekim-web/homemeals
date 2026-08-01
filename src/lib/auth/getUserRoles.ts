import { createClient } from "@/lib/supabase/server";


export async function getUserRoles(
  userId: string
) {

  const supabase = await createClient();


  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq(
      "user_id",
      userId
    );


  if (error) {
    console.error(error);
    return [];
  }


  return (
    data?.map(
      item => item.role
    ) ?? []
  );

}