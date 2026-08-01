import Link from "next/link";


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





function mealLabel(
  value: MealOption
) {

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

      return `
        bg-blue-100
        text-blue-700
      `;


    case "NORMAL":

      return `
        bg-green-100
        text-green-700
      `;


    case "LATE":

      return `
        bg-orange-100
        text-orange-700
      `;


    case "NONE":

      return `
        bg-gray-100
        text-gray-500
      `;


  }

}






function MealBadge({

  value

}:{

  value:MealOption

}){


  return (

    <span

      className={`
        rounded-full
        px-2
        py-1
        text-xs
        font-medium
        ${mealStyle(value)}
      `}

    >

      {mealLabel(value)}

    </span>

  );

}








export default function WeeklySchedulePreview({

  schedules

}:Props){


  return (

    <div

      className="
        rounded-2xl
        border
        bg-white
        shadow-sm
        overflow-hidden
      "

    >



      <div

        className="
          flex
          justify-between
          items-center
          p-5
          border-b
        "

      >

        <h2
          className="
            text-xl
            font-bold
          "
        >

          This Week

        </h2>


        <Link

          href="/member/schedule"

          className="
            text-sm
            text-blue-600
            hover:underline
          "

        >

          Edit

        </Link>


      </div>








      <div
        className="
          overflow-x-auto
        "
      >

        <table
          className="
            w-full
            text-sm
          "
        >

          <thead>

            <tr
              className="
                bg-gray-50
                text-gray-600
              "
            >

              <th
                className="
                  p-3
                  text-left
                "
              >
                Day
              </th>


              <th>
                Mass
              </th>


              <th>
                Breakfast
              </th>


              <th>
                Lunch
              </th>


              <th>
                Dinner
              </th>


            </tr>


          </thead>





          <tbody>


          {
            schedules.map(

              item => (

                <tr

                  key={
                    item.date
                  }

                  className="
                    border-t
                  "

                >


                  <td
                    className="
                      p-3
                    "
                  >

                    <div
                      className="
                        font-semibold
                      "
                    >

                      {item.dayName.slice(0,3)}

                    </div>


                    <div
                      className="
                        text-gray-500
                      "
                    >

                      {
                        item.date.slice(5)
                      }

                    </div>


                    {
                      item.feast && (

                        <div

                          className="
                            mt-1
                            text-xs
                            text-purple-600
                            font-medium
                          "

                        >

                          📅 {item.feast}

                        </div>

                      )
                    }


                  </td>





                  <td
                    className="
                      text-center
                    "
                  >

                    {
                      item.mass

                      ?

                      <span
                        className="
                          rounded-full
                          bg-green-100
                          px-2
                          py-1
                          text-xs
                          text-green-700
                        "
                      >

                        Yes

                      </span>

                      :

                      <span
                        className="
                          rounded-full
                          bg-gray-100
                          px-2
                          py-1
                          text-xs
                          text-gray-500
                        "
                      >

                        No

                      </span>
                    }


                  </td>





                  <td
                    className="
                      text-center
                    "
                  >

                    <MealBadge
                      value={
                        item.breakfast
                      }
                    />

                  </td>





                  <td
                    className="
                      text-center
                    "
                  >

                    <MealBadge
                      value={
                        item.lunch
                      }
                    />

                  </td>





                  <td
                    className="
                      text-center
                    "
                  >

                    <MealBadge
                      value={
                        item.dinner
                      }
                    />

                  </td>



                </tr>

              )

            )
          }


          </tbody>


        </table>


      </div>


    </div>

  );

}