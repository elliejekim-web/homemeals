"use client";

type MealOption =
  | "EARLY"
  | "NORMAL"
  | "LATE";


type Props = {
  value: MealOption;
  onChange: (value: MealOption)=>void;
  disabled?: boolean;
};


export default function MealOptionSelector({
  value,
  onChange,
  disabled=false,
}:Props){


const options:MealOption[]=[
  "EARLY",
  "NORMAL",
  "LATE",
];


return (

<div className="flex gap-3">

{
options.map(option=>(

<button
key={option}
disabled={disabled}
onClick={()=>onChange(option)}
className={`
rounded-xl
border
px-4
py-2
text-sm
font-medium

${
value===option
?
"bg-blue-600 text-white"
:
"bg-white"
}

${
disabled
?
"opacity-50 cursor-not-allowed"
:
""
}

`}
>

{option}

</button>

))
}

</div>

);

}