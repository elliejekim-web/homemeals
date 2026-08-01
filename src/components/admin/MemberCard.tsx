import Card from "@/components/ui/Card";


type Schedule = {
  id: string;
  presence: string;
  mass: boolean;
  breakfast: string;
  lunch: string;
  dinner: string;

  users: {
    display_name: string;
  } | null;
};


type Props = {
  member: Schedule;
};


export default function MemberCard({
  member,
}: Props) {

  return (

    <Card>

      <div className="flex justify-between">

        <h3 className="text-lg font-semibold">
          👤 {member.users?.display_name}
        </h3>


        <span className="
          text-sm
          text-gray-500
        ">
          {member.presence}
        </span>

      </div>


      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">


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


      <div className="mt-4 text-sm">

        {member.mass
          ? "⛪ Attending Mass"
          : "❌ No Mass"}

      </div>


    </Card>

  );
}