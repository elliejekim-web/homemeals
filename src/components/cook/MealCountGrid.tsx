import MealSummaryCard from "./MealSummaryCard";


type Props = {
  breakfast: number;
  lunch: number;
  dinner: number;
};


export default function MealCountGrid({
  breakfast,
  lunch,
  dinner,
}: Props) {

  return (

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-6
      "
    >

      <MealSummaryCard
        icon="🍳"
        title="Breakfast"
        count={breakfast}
      />


      <MealSummaryCard
        icon="🥪"
        title="Lunch"
        count={lunch}
      />


      <MealSummaryCard
        icon="🍛"
        title="Dinner"
        count={dinner}
      />

    </div>

  );
}