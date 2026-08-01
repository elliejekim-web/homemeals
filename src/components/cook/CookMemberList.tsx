import CookMemberCard from "./CookMemberCard";


type Props = {
  schedules: any[];
};


export default function CookMemberList({
  schedules,
}: Props) {


  if (!schedules.length) {

    return (
      <p className="text-gray-500">
        No meals planned today.
      </p>
    );

  }


  return (

    <div className="space-y-4">

      {
        schedules.map(
          (item) => (

            <CookMemberCard
              key={item.id}
              member={item}
            />

          )
        )
      }

    </div>

  );
}