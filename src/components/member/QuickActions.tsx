import Link from "next/link";

type ActionItem = {
  title: string;
  description: string;
  icon: string;
  href: string;
  badge?: string;
};

const actions: ActionItem[] = [
  {
    title: "Edit Schedule",
    description: "Modify this week's meals",
    icon: "📅",
    href: "/member/schedule",
  },
  {
    title: "Weekly Defaults",
    description: "Set your normal routine",
    icon: "⚙️",
    href: "/member/defaults",
  },
  {
    title: "Vacation / Away",
    description: "Manage away dates",
    icon: "✈️",
    href: "/member/vacation",
  },
  {
    title: "Messages",
    description: "Contact admin directly",
    icon: "✉️",
    href: "/member/messages",
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-2.5">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="group flex items-center justify-between rounded-xl border border-gray-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-xs active:scale-[0.99]"
        >
          {/* Left: Icon & Text */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-xl ring-1 ring-inset ring-gray-900/5 transition-colors group-hover:bg-white group-hover:shadow-2xs">
              {action.icon}
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {action.title}
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                {action.description}
              </p>
            </div>
          </div>

          {/* Right: Chevron Arrow */}
          <div className="text-gray-400 group-hover:text-blue-600 transition-all group-hover:translate-x-0.5">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}