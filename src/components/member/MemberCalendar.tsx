"use client";

import { useState } from "react";

type Props = {
  selectedDate: string;
  onChange: (date: string) => void;
};

export default function MemberCalendar({
  selectedDate,
  onChange,
}: Props) {

  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate)
  );


  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();


  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();


  const days = Array.from(
    { length: daysInMonth },
    (_, i) => i + 1
  );


  const formatDate = (day:number) => {

    const monthString = String(month + 1)
      .padStart(2, "0");

    const dayString = String(day)
      .padStart(2, "0");

    return `${year}-${monthString}-${dayString}`;
  };


  const today =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:"Asia/Seoul",
      }
    ).format(new Date());


  return (
    <div className="
      rounded-2xl
      border
      bg-white
      p-5
      shadow-sm
    ">

      <div className="
        flex
        justify-between
        items-center
        mb-4
      ">

        <button
          onClick={() =>
            setCurrentMonth(
              new Date(year, month - 1, 1)
            )
          }
          className="
            rounded-lg
            border
            px-3
            py-1
          "
        >
          ←
        </button>


        <h2 className="font-bold">
          {year} / {month + 1}
        </h2>


        <button
          onClick={() =>
            setCurrentMonth(
              new Date(year, month + 1, 1)
            )
          }
          className="
            rounded-lg
            border
            px-3
            py-1
          "
        >
          →
        </button>

      </div>


      <div className="space-y-2">

        {days.map((day)=>{

          const date = formatDate(day);

          const isSelected =
            date === selectedDate;

          const isToday =
            date === today;


          return (

            <button
              key={date}
              onClick={()=>onChange(date)}
              className={`
                w-full
                rounded-xl
                px-4
                py-3
                text-left
                border
                ${
                  isSelected
                  ? "bg-blue-600 text-white"
                  : ""
                }
                ${
                  isToday && !isSelected
                  ? "border-blue-500"
                  : ""
                }
              `}
            >

              <div className="flex justify-between">

                <span>
                  {day}
                </span>


                {isToday && (
                  <span className="text-xs">
                    Today
                  </span>
                )}

              </div>


            </button>

          );

        })}

      </div>


    </div>
  );
}