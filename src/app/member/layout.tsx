import Navbar, { NavItem } from "@/components/navigation/Navbar";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/auth/getUserRoles";

const MEMBER_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/member", icon: "🏠" },
  { label: "Schedule", href: "/member/schedule", icon: "📅" },
  { label: "Vacation", href: "/member/vacation", icon: "✈️" },
];

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const roles = await getUserRoles(user.id);
    isAdmin = roles.includes("ADMIN");
  }

  return (
    <div className="min-h-screen bg-gray-50/60 text-gray-900 antialiased">
      <Navbar
        brandName="Saint Home Meals"
        brandHref="/member"
        items={MEMBER_NAV_ITEMS}
        actionButton={
          isAdmin
            ? {
                label: "Admin Dashboard",
                href: "/admin",
                icon: "⚙️",
                variant: "blue",
              }
            : undefined
        }
      />
      <main className="pb-16">{children}</main>
    </div>
  );
}