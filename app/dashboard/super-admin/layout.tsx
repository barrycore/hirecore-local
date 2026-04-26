import { redirect } from "next/navigation";
import { LayoutDashboard, Users, ClipboardList, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AdminLayoutClient from "../admin/layout-client";

const superAdminNavItems = [
  { href: "/dashboard/super-admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/super-admin/users", label: "All Users", icon: Users },
  { href: "/dashboard/super-admin/admins", label: "Manage Admins", icon: Shield },
  { href: "/dashboard/admin", label: "Admin Panel", icon: ClipboardList },
];

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // ✅ 1. Get user (server-safe)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/super-admin");
  }

  // ✅ 2. Get profile
  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/?error=profile_not_found");
  }

  if (profile.role !== "super_admin") {
    redirect("/?error=unauthorized");
  }

  return (
    <AdminLayoutClient
      navItems={superAdminNavItems}
      profile={profile}
      dashboardType="super-admin"
    >
      {children}
    </AdminLayoutClient>
  );
}