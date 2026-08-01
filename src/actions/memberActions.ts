"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateMember(
  userId: string,
  data: {
    full_name: string;
    display_name: string;
    roles: string[];
  }
) {

const supabase = await createClient();


// 1. users update
const { error: userError } =
await supabase
.from("users")
.update({
  full_name: data.full_name,
  display_name: data.display_name,
})
.eq("id", userId);


if(userError){
  throw userError;
}



// 2. 현재 role 조회
const {
data: currentRoles,
error: roleFetchError
}
=
await supabase
.from("user_roles")
.select("role")
.eq("user_id", userId);


if(roleFetchError){
  throw roleFetchError;
}



const existingRoles =
(currentRoles ?? [])
.map(
(r)=>r.role
);



// 3. 추가할 role

const rolesToAdd =
data.roles.filter(
(role)=>
!existingRoles.includes(role)
);



// 4. 삭제할 role

const rolesToRemove =
existingRoles.filter(
(role)=>
!data.roles.includes(role)
);



// 5. INSERT

if(rolesToAdd.length > 0){

const rows =
rolesToAdd.map(
(role)=>({
 user_id:userId,
 role
})
);


const {
error
}
=
await supabase
.from("user_roles")
.insert(rows);


if(error){
 throw error;
}

}



// 6. DELETE

for(const role of rolesToRemove){

const {
error
}
=
await supabase
.from("user_roles")
.delete()
.eq("user_id", userId)
.eq("role", role);


if(error){
 throw error;
}

}


return {
success:true
};

}

// ===============================
// 새 사용자 생성
// ===============================

export async function createMember(data: {
  email: string;
  password: string;
  full_name: string;
  display_name: string;
  roles: string[];
}) {
  const supabase = await createClient();

  // 1. Auth user 생성
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });

  if (authError) throw authError;

  const userId = authData.user.id;

  // 2. users 업데이트
  const { error: userError } = await supabase
    .from("users")
    .update({
      full_name: data.full_name,
      display_name: data.display_name,
    })
    .eq("id", userId);

  if (userError) throw userError;

  // 3. role 추가
  if (data.roles.length > 0) {
    const roleRows = data.roles.map((role) => ({
      user_id: userId,
      role,
    }));

    const { error: roleError } = await supabase
      .from("user_roles")
      .insert(roleRows);

    if (roleError) throw roleError;
  }

  // 4. MEMBER이면 weekly_defaults 생성
  if (data.roles.includes("MEMBER")) {
    const days = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];

    const weeklyRows = days.map((day) => ({
      user_id: userId,
      day_of_week: day,
      mass: true,
      breakfast: "NORMAL",
      lunch: "NORMAL",
      dinner: "NORMAL",
    }));

    const { error: weeklyError } = await supabase
      .from("weekly_defaults")
      .insert(weeklyRows);

    if (weeklyError) throw weeklyError;
  }

  return { success: true };
}
