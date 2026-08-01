type Props = {
  title: string;
  value: string | number;
  children?: React.ReactNode;
};


export default function SummaryCard({
  title,
  value,
  children,
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
          mt-2
          text-3xl
          font-bold
        "
      >
        {value}
      </div>


      {children}

    </div>
  );
}