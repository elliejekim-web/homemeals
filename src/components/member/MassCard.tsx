"use client";

import { useState } from "react";

type Props = {
  value: boolean;

  onChange: (
    value: boolean
  ) => void;

  locked?: boolean;

  lockMessage?: string;
};


export default function MassCard({
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
            ⛪
          </span>


          <div>

            <h3 className="font-bold">
              Mass
            </h3>


            <p
              className="
                text-sm
                text-gray-500
              "
            >
              {
                value
                  ? "Attend"
                  : "Not attending"
              }
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
          {
            locked
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

          <div
            className="
              mt-5
              flex
              gap-3
            "
          >

            <button
              onClick={() => {

                onChange(true);
                setOpen(false);

              }}
              className={`
                rounded-xl
                border
                px-4
                py-2

                ${
                  value
                  ?
                  "bg-blue-600 text-white"
                  :
                  "bg-white"
                }
              `}
            >
              ✓ Attend
            </button>



            <button
              onClick={() => {

                onChange(false);
                setOpen(false);

              }}
              className={`
                rounded-xl
                border
                px-4
                py-2

                ${
                  !value
                  ?
                  "bg-blue-600 text-white"
                  :
                  "bg-white"
                }
              `}
            >
              Not Attend
            </button>


          </div>

        )
      }


    </div>

  );
}