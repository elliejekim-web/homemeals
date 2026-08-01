type Status =
  | "OPEN"
  | "CLOSING"
  | "CLOSED";

type Props = {
  status: Status;
};

export default function StatusBadge({
  status,
}: Props) {
  const styles = {
    OPEN: {
      label: "🟢 Open",
      className:
        "bg-green-100 text-green-700",
    },

    CLOSING: {
      label: "🟡 Closing Soon",
      className:
        "bg-amber-100 text-amber-700",
    },

    CLOSED: {
      label: "🔒 Closed",
      className:
        "bg-gray-200 text-gray-600",
    },
  };

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-1
        text-sm
        font-medium
        ${styles[status].className}
      `}
    >
      {styles[status].label}
    </span>
  );
}