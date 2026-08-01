import Navbar, { NavItem } from "@/components/navigation/Navbar";
import { createClient } from "@/lib/supabase/server";
import { getUserRoles } from "@/lib/auth/getUserRoles";

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Members", href: "/admin/members" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Settings", href: "/admin/settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isMember = false;
  if (user) {
    const roles = await getUserRoles(user.id);
    isMember = roles.includes("MEMBER");
  }

  const { data: setting } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "community_name")
    .single();

  const communityName = setting?.value ?? "Saint Home Meals";

  return (
    <div className="min-h-screen bg-gray-50/60 text-gray-900 antialiased">
      <Navbar
        brandName={communityName}
        brandHref="/admin"
        badgeText="Admin"
        items={ADMIN_NAV_ITEMS}
        actionButton={
          isMember
            ? {
                label: "Member View",
                href: "/member",
                icon: "👤",
                variant: "emerald",
              }
            : undefined
        }
      />
      <main className="pb-16">{children}</main>
    </div>
  );
}