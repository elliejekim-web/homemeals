import MemberCard from "./MemberCard";


type Props = {
  schedules: any[];
};


export default function MemberList({
  schedules,
}: Props) {


  if (!schedules.length) {

    return (
      <p className="text-gray-500">
        No schedules for today.
      </p>
    );

  }


  return (

    <div className="
      grid
      gap-4
    ">


      {schedules.map(
        (item) => (

          <MemberCard
            key={item.id}
            member={item}
          />

        )
      )}


    </div>

  );
}