import type { ReactNode } from "react";
import AdminLayoutClient from "../admin/layout-client";

const superAdminNavItems = [
  {
    href: "/dashboard/super-admin",
    label: "Overview",
    iconName: "layout",
  },
  {
    href: "/dashboard/super-admin/admins",
    label: "Admins",
    iconName: "admin",
  },
  {
    href: "/dashboard/super-admin/tasks",
    label: "Tasks",
    iconName: "tasks",
  },
  {
    href: "/dashboard/super-admin/applications",
    label: "Applications",
    iconName: "applications",
  },
  {
    href: "/dashboard/super-admin/workforce",
    label: "Workforce",
    iconName: "users",
  },
  {
    href: "/dashboard/super-admin/security",
    label: "Security",
    iconName: "shield",
  },
] as const;

const demoProfile = {
  role: "super_admin",
  full_name: "Super Admin",
  email: "superadmin@hirecore.local",
};

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminLayoutClient
      navItems={superAdminNavItems}
      profile={demoProfile}
      dashboardType="super-admin"
    >
      {children}
    </AdminLayoutClient>
  );
}