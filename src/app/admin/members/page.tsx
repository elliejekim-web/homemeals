import { createClient } from '@/lib/supabase/server';
import Card from '@/components/ui/Card';
import MemberManagement from "@/components/admin/MemberManagement";


export default async function AdminMembersPage() {

const supabase = await createClient();



const { data: members, error } = await supabase
.from('users')
.select(`
  id,
  display_name,
  full_name,
  active,
  created_at,

  user_roles (
    role
  )
`)
.order('display_name');



if(error){
console.error(error);
}



const formattedMembers =
(members ?? []).map(member => ({

id: member.id,

display_name:
member.display_name,

full_name:
member.full_name,

active:
member.active,

created_at:
member.created_at,


roles:
member.user_roles?.map(
(r:any)=>r.role
) ?? []


}));



return (
  <MemberManagement
    members={formattedMembers}
  />
);
}