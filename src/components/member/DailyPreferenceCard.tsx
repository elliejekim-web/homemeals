"use client";

import { useState } from "react";
import MealOptionSelector from "./MealOptionSelector";

type MealOption =
  | "EARLY"
  | "NORMAL"
  | "LATE";


type Props = {
  icon: string;
  title: string;

  value: MealOption;

  onChange: (
    value: MealOption
  ) => void;

  locked?: boolean;

  lockMessage?: string;
};


export default function DailyPreferenceCard({
  icon,
  title,
  value,
  onChange,
  locked = false,
  lockMessage,
}: Props) {

  const [open, setOpen] = useState(false);


  return (

    <div
      className="
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <span className="text-2xl">
            {icon}
          </span>

          <div>

            <h3 className="font-bold">
              {title}
            </h3>

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              {value}
            </p>

          </div>

        </div>


        <button
          disabled={locked}
          onClick={() =>
            setOpen(!open)
          }
          className="
            rounded-xl
            border
            px-4
            py-2
            text-sm
            disabled:opacity-50
          "
        >
          {locked
            ? "Locked"
            : open
              ? "Close"
              : "Change"
          }

        </button>


      </div>


      {
        locked && lockMessage && (

          <p
            className="
              mt-3
              text-sm
              text-gray-500
            "
          >
            🔒 {lockMessage}
          </p>

        )
      }


      {
        open && !locked && (

          <div className="mt-5">

            <MealOptionSelector
              value={value}
              onChange={(newValue)=>{

                onChange(newValue);

                setOpen(false);

              }}
            />

          </div>

        )
      }


    </div>

  );
}