import Card from "@/components/ui/Card";


type Member = {
  id: string;

  breakfast: string;
  lunch: string;
  dinner: string;

  users: {
    display_name: string;
  } | null;
};


type Props = {
  member: Member;
};


export default function CookMemberCard({
  member,
}: Props) {

  return (

    <Card>

      <h3 className="font-semibold text-lg">
        👤 {member.users?.display_name}
      </h3>


      <div className="
        mt-4
        grid
        grid-cols-3
        gap-4
        text-center
      ">


        <div>
          🍳
          <br />
          {member.breakfast}
        </div>


        <div>
          🥪
          <br />
          {member.lunch}
        </div>


        <div>
          🍛
          <br />
          {member.dinner}
        </div>


      </div>

    </Card>

  );
}