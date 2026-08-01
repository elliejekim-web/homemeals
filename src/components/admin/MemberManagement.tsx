"use client";

import { useState } from "react";
import { updateMember } from "@/actions/memberActions";


type Member = {
  id: string;
  display_name: string;
  full_name: string;
  active: boolean;
  created_at: string;
  roles: string[];
};


const AVAILABLE_ROLES = [
  "MEMBER",
  "ADMIN",
  "COOK",
];


export default function MemberManagement({
  members,
}: {
  members: Member[];
}) {


const [editing, setEditing] =
useState<Member | null>(null);



return (

<div className="space-y-6">


<h1 className="text-2xl font-bold">
Members
</h1>

<a
href="/admin"
className="
text-sm
text-blue-600
hover:underline
"
>
← Back to Dashboard
</a>


<div
className="
rounded-2xl
border
bg-white
overflow-hidden
"
>


<table
className="
w-full
text-sm
"
>


<thead
className="
bg-gray-50
"
>

<tr>

<th className="p-4 text-left">
Display Name
</th>

<th className="p-4 text-left">
Full Name
</th>

<th className="p-4 text-left">
Roles
</th>

<th className="p-4">
Action
</th>


</tr>


</thead>



<tbody>


{
members.map(member=>(


<tr
key={member.id}
className="
border-t
hover:bg-gray-50
"
>


<td className="p-4 font-medium">
{member.display_name}
</td>



<td className="p-4">
{member.full_name}
</td>



<td className="p-4">

<div className="flex gap-2 flex-wrap">

{
member.roles.map(role=>(

<span
key={role}
className="
rounded-full
bg-blue-100
px-2
py-1
text-xs
text-blue-700
"
>
{role}
</span>

))
}


</div>

</td>



<td className="p-4 text-center">


<button

onClick={()=>
setEditing(member)
}

className="
rounded-lg
border
px-3
py-1
hover:bg-gray-100
"
>

Edit

</button>


</td>


</tr>


))
}



</tbody>


</table>


</div>



{
editing && (

<EditModal

member={editing}

close={()=>
setEditing(null)
}

/>

)
}



</div>

);

}



function EditModal({

member,
close

}:{

member:Member;
close:()=>void;

}){


const [fullName,setFullName]
=
useState(member.full_name);



const [displayName,setDisplayName]
=
useState(member.display_name);



const [roles,setRoles]
=
useState(member.roles);



function toggleRole(role:string){


if(
roles.includes(role)
){

setRoles(
roles.filter(
r=>r!==role
)
);


}else{


setRoles(
[
...roles,
role
]
);


}


}



async function save(){


await updateMember(
member.id,
{
full_name:fullName,
display_name:displayName,
roles
}
);


close();


window.location.reload();


}



return (

<div
className="
fixed
inset-0
bg-black/30
flex
items-center
justify-center
z-50
"
>


<div
className="
bg-white
rounded-2xl
p-6
w-[400px]
shadow-xl
"
>


<h2 className="text-xl font-bold mb-4">
Edit Member
</h2>



<label className="text-sm">
Full Name
</label>

<input

className="
w-full
border
rounded-lg
p-2
mb-4
"

value={fullName}

onChange={
e=>setFullName(e.target.value)
}

/>



<label className="text-sm">
Display Name
</label>


<input

className="
w-full
border
rounded-lg
p-2
mb-4
"

value={displayName}

onChange={
e=>setDisplayName(e.target.value)
}

/>




<label className="text-sm">
Roles
</label>



<div
className="
space-y-2
mt-2
"
>


{
AVAILABLE_ROLES.map(role=>(


<label
key={role}
className="
flex
items-center
gap-2
"
>


<input

type="checkbox"

checked={
roles.includes(role)
}

onChange={()=>
toggleRole(role)
}

/>


{role}


</label>


))
}


</div>




<div
className="
flex
justify-end
gap-2
mt-6
"
>


<button

onClick={close}

className="
border
rounded-lg
px-4
py-2
"

>
Cancel
</button>



<button

onClick={save}

className="
bg-blue-600
text-white
rounded-lg
px-4
py-2
"

>
Save
</button>


</div>


</div>


</div>

);


}