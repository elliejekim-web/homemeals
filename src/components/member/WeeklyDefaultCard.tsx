"use client";

type MealOption =
  | "EARLY"
  | "NORMAL"
  | "LATE";


type WeeklyDefault = {
  day_of_week: string;

  mass: boolean;

  breakfast: MealOption;
  lunch: MealOption;
  dinner: MealOption;
};


type Props = {
  defaults: WeeklyDefault[];
};


export default function WeeklyDefaultCard({
  defaults,
}: Props) {


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

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-xl font-bold">
          🔄 My Weekly Default
        </h2>


        <button
          className="
            rounded-xl
            border
            px-4
            py-2
            text-sm
            hover:bg-gray-50
          "
        >
          Edit
        </button>

      </div>


      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-4
        "
      >

        {
          defaults.map((item)=>(

            <div
              key={item.day_of_week}
              className="
                rounded-xl
                border
                p-4
              "
            >

              <h3
                className="
                  font-bold
                  mb-3
                "
              >
                {item.day_of_week}
              </h3>


              <div className="space-y-2 text-sm">


                <div>
                  🍳 Breakfast:
                  <span className="ml-2 font-medium">
                    {item.breakfast}
                  </span>
                </div>


                <div>
                  🥪 Lunch:
                  <span className="ml-2 font-medium">
                    {item.lunch}
                  </span>
                </div>


                <div>
                  🍛 Dinner:
                  <span className="ml-2 font-medium">
                    {item.dinner}
                  </span>
                </div>


                <div>
                  ⛪ Mass:
                  <span className="ml-2 font-medium">
                    {item.mass
                      ? "Attend"
                      : "No"
                    }
                  </span>
                </div>


              </div>

            </div>

          ))
        }

      </div>


    </div>

  );

}