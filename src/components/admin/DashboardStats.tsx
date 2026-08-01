import SummaryCard from "./SummaryCard";

type Props = {
  peopleAtHome: number;
  massCount: number;
  today: string;
};

export default function DashboardStats({
  peopleAtHome,
  massCount,
  today,
}: Props) {

  return (

    <div className="
      grid
      grid-cols-1
      md:grid-cols-3
      gap-6
    ">

      <SummaryCard
        icon="🏠"
        title="People at Home"
        value={peopleAtHome}
      />


      <SummaryCard
        icon="⛪"
        title="Mass Attendance"
        value={massCount}
      />


      <SummaryCard
        icon="📅"
        title="Date"
        value={today}
      />

    </div>

  );
}