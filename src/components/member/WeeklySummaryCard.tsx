type MealOption =
  | "EARLY"
  | "NORMAL"
  | "LATE"
  | "NONE";


type DaySchedule = {

  date: string;

  dayName: string;

  feast?: string;

  mass: boolean;

  breakfast: MealOption;

  lunch: MealOption;

  dinner: MealOption;

};



type Props = {

  schedules: DaySchedule[];

};





function countMeals(

  schedules: DaySchedule[],

  meal:
    | "breakfast"
    | "lunch"
    | "dinner"

){

  return schedules.filter(

    item =>

      item[meal] !== "NONE"

  ).length;

}






export default function WeeklySummaryCard({

  schedules,

}: Props){



  const massCount =

    schedules.filter(

      item => item.mass

    ).length;



  const breakfastCount =

    countMeals(
      schedules,
      "breakfast"
    );


  const lunchCount =

    countMeals(
      schedules,
      "lunch"
    );


  const dinnerCount =

    countMeals(
      schedules,
      "dinner"
    );



  const modifiedDays =

    schedules.filter(

      item =>

        item.feast

    ).length;






  return (

    <section

      className="
        rounded-2xl
        border
        bg-white
        p-6
        shadow-sm
      "

    >


      <h2

        className="
          text-xl
          font-bold
          mb-5
        "

      >

        This Week Summary

      </h2>





      <div

        className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-4
        "

      >


        <SummaryItem

          icon="🙏"

          title="Mass"

          value={`${massCount} / ${schedules.length}`}

        />



        <SummaryItem

          icon="🍳"

          title="Breakfast"

          value={`${breakfastCount}`}

        />



        <SummaryItem

          icon="🥪"

          title="Lunch"

          value={`${lunchCount}`}

        />



        <SummaryItem

          icon="🍛"

          title="Dinner"

          value={`${dinnerCount}`}

        />


      </div>



    </section>

  );

}







function SummaryItem({

  icon,

  title,

  value,

}:{

  icon:string;

  title:string;

  value:string;

}){


  return (

    <div

      className="
        rounded-xl
        bg-gray-50
        p-4
      "

    >

      <div

        className="
          text-2xl
          mb-2
        "

      >

        {icon}

      </div>


      <div

        className="
          text-sm
          text-gray-500
        "

      >

        {title}

      </div>


      <div

        className="
          mt-1
          text-xl
          font-bold
        "

      >

        {value}

      </div>


    </div>

  );

}