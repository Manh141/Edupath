import {
  BookOpen,
  LayoutGrid,
  PieChart,
  ShieldCheck,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Main",
    items: [
      { href: "/admin/overview", label: "Overview", icon: LayoutGrid },
      { href: "/admin/reports", label: "Reports", icon: PieChart },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/courses", label: "Courses", icon: BookOpen },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
    ],
  },
  {
    label: "Commerce",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/rbac", label: "RBAC", icon: ShieldCheck },
    ],
  },
];

export const adminNav: AdminNavItem[] = adminNavGroups.flatMap((group) => group.items);
