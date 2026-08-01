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

  schedule: DaySchedule;

};





function mealLabel(
  value: MealOption
){

  switch(value){

    case "EARLY":
      return "Early";

    case "NORMAL":
      return "Normal";

    case "LATE":
      return "Late";

    case "NONE":
      return "No meal";

  }

}





function mealStyle(
  value: MealOption
){

  switch(value){

    case "EARLY":
      return "bg-blue-100 text-blue-700";

    case "NORMAL":
      return "bg-green-100 text-green-700";

    case "LATE":
      return "bg-orange-100 text-orange-700";

    case "NONE":
      return "bg-gray-100 text-gray-500";

  }

}





function MealRow({

  icon,

  title,

  value,

}:{

  icon:string;

  title:string;

  value:MealOption;

}){


  return (

    <div
      className="
        flex
        items-center
        justify-between
        rounded-xl
        bg-gray-50
        px-4
        py-3
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <span className="text-xl">
          {icon}
        </span>

        <span
          className="
            font-medium
          "
        >
          {title}
        </span>

      </div>



      <span
        className={`
          rounded-full
          px-3
          py-1
          text-xs
          font-semibold
          ${mealStyle(value)}
        `}
      >

        {mealLabel(value)}

      </span>


    </div>

  );

}





export default function TodaySummaryCard({

  schedule,

}:Props){


  return (

    <div

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
          mb-4
        "

      >

        Today

      </h2>




      <div
        className="
          mb-5
        "
      >

        <p
          className="
            text-sm
            text-gray-500
          "
        >

          {schedule.date}

        </p>


        {
          schedule.feast && (

            <p
              className="
                mt-2
                text-sm
                text-purple-600
                font-medium
              "
            >

              📅 {schedule.feast}

            </p>

          )
        }

      </div>





      <div

        className="
          flex
          items-center
          justify-between
          rounded-xl
          bg-gray-50
          px-4
          py-3
          mb-4
        "

      >

        <div
          className="
            flex
            gap-3
            items-center
          "
        >

          <span className="text-xl">
            🙏
          </span>

          <span className="font-medium">
            Mass
          </span>

        </div>



        <span

          className={`
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold

            ${
              schedule.mass
              ?
              "bg-green-100 text-green-700"
              :
              "bg-gray-100 text-gray-500"
            }
          `}

        >

          {
            schedule.mass
            ?
            "Yes"
            :
            "No"
          }

        </span>


      </div>






      <div className="space-y-3">


        <MealRow

          icon="🍳"

          title="Breakfast"

          value={
            schedule.breakfast
          }

        />


        <MealRow

          icon="🥪"

          title="Lunch"

          value={
            schedule.lunch
          }

        />


        <MealRow

          icon="🍛"

          title="Dinner"

          value={
            schedule.dinner
          }

        />


      </div>


    </div>

  );

}