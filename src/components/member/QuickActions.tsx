import Link from "next/link";

type ActionItem = {
  title: string;
  icon: string;
  href: string;
};

const actions: ActionItem[] = [
  {
    title: "Edit Schedule",
    icon: "📅",
    href: "/member/schedule",
  },
  {
    title: "Weekly Defaults",
    icon: "⚙️",
    href: "/member/defaults",
  },
  {
    title: "Vacation / Away",
    icon: "✈️",
    href: "/member/vacation",
  },
  {
    title: "Messages",
    icon: "✉️",
    href: "/member/messages",
  },
];

export default function QuickActions() {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
        >
          <span className="text-sm">{action.icon}</span>
          <span>{action.title}</span>
        </Link>
      ))}
    </div>
  );
}