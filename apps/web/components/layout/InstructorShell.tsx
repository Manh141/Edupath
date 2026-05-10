"use client";

import type { PropsWithChildren } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  LogOut,
  MessagesSquare,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  Settings,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser } from "@/lib/auth-session";
import { cn } from "@/lib/utils";

type SidebarItem = {
  href: string;
  label: string;
  Icon: typeof LayoutDashboard;
  exact?: boolean;
};

const PRIMARY_NAV: SidebarItem[] = [
  {
    href: "/instructor",
    label: "Overview",
    Icon: LayoutDashboard,
    exact: true,
  },
  { href: "/instructor/courses", label: "Courses", Icon: BookOpen },
  {
    href: "/instructor/communication",
    label: "Communication",
    Icon: MessagesSquare,
  },
  { href: "/instructor/performance", label: "Performance", Icon: LineChart },
];

function isActive(pathname: string | null, item: SidebarItem): boolean {
  if (!pathname) return false;
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function buildTitle(pathname: string | null): string {
  if (!pathname) return "Instructor Studio";
  if (pathname === "/instructor") return "Overview";
  for (const item of PRIMARY_NAV) {
    if (isActive(pathname, item)) return item.label;
  }
  if (pathname.startsWith("/instructor/courses/new")) return "New course";
  if (pathname.startsWith("/instructor/courses/")) return "Course editor";
  return "Instructor Studio";
}

const SIDEBAR_STORAGE_KEY = "edupath:instructor:sidebar-collapsed";

export default function InstructorShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, signOut, setActiveRole } = useAuth();

  const title = useMemo(() => buildTitle(pathname), [pathname]);
  const isAdmin = isAdminUser(currentUser);

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;

    try {
      const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return stored === "1";
    } catch {
      return false;
    }
  });
  const compact = collapsed;

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const switchToStudent = () => {
    setActiveRole("student");
    router.replace("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <TooltipProvider delayDuration={120}>
          <aside
            className={cn(
              "relative hidden shrink-0 flex-col border-r border-white/10 bg-[#17191d] text-white shadow-[18px_0_48px_-34px_rgba(15,23,42,0.9)] transition-[width] duration-300 ease-out md:flex",
              compact ? "w-[88px]" : "w-[280px]",
            )}
          >
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="absolute right-0 top-6 z-10 flex h-8 w-8 translate-x-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-all duration-200 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {collapsed ? (
                <PanelLeftOpen className="h-3.5 w-3.5" />
              ) : (
                <PanelLeftClose className="h-3.5 w-3.5" />
              )}
            </button>

            <Link
              href="/instructor"
              className={cn(
                "flex h-20 items-center overflow-hidden border-b border-white/10 transition-[padding] duration-300",
                compact ? "justify-center px-0" : "gap-3 px-5",
              )}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] ring-1 ring-white/10">
                <BookOpen className="h-5 w-5" />
              </div>
              <div
                className={cn(
                  "min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-200",
                  compact
                    ? "max-w-0 -translate-x-2 opacity-0"
                    : "max-w-[180px] translate-x-0 opacity-100",
                )}
              >
                <span className="block truncate font-display text-lg font-semibold tracking-tight">
                  EduPath
                </span>
                <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
                  Instructor
                </span>
              </div>
            </Link>

            <nav
              className={cn(
                "flex-1 overflow-y-auto py-5 transition-[padding] duration-300",
                compact ? "px-3" : "px-4",
              )}
            >
              <ul className="space-y-1">
                {PRIMARY_NAV.map((item) => {
                  const active = isActive(pathname, item);
                  const { Icon } = item;
                  return (
                    <li key={item.href}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            aria-label={item.label}
                            className={cn(
                              "group flex h-11 items-center overflow-hidden rounded-lg text-sm font-semibold transition-all duration-200",
                              compact ? "justify-center px-0" : "gap-3 px-3",
                              active
                                ? "bg-white/[0.13] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                                : "text-white/66 hover:bg-white/[0.07] hover:text-white",
                            )}
                          >
                            <Icon className="h-[18px] w-[18px] shrink-0" />
                            <span
                              aria-hidden={compact}
                              className={cn(
                                "min-w-0 truncate transition-[max-width,opacity,transform] duration-200",
                                compact
                                  ? "max-w-0 -translate-x-2 opacity-0"
                                  : "max-w-[190px] translate-x-0 opacity-100",
                              )}
                            >
                              {item.label}
                            </span>
                          </Link>
                        </TooltipTrigger>
                        {compact ? (
                          <TooltipContent side="right" className="font-medium">
                            {item.label}
                          </TooltipContent>
                        ) : null}
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>

              <div className="my-5 h-px bg-white/10" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/instructor/courses/new"
                    aria-label="New course"
                    className={cn(
                      "flex h-11 items-center overflow-hidden rounded-lg bg-white text-sm font-semibold text-[#17191d] shadow-sm transition-all duration-200 hover:bg-white/90",
                      compact ? "justify-center px-0" : "gap-3 px-3",
                    )}
                  >
                    <PlusCircle className="h-[18px] w-[18px] shrink-0" />
                    <span
                      aria-hidden={compact}
                      className={cn(
                        "min-w-0 truncate transition-[max-width,opacity,transform] duration-200",
                        compact
                          ? "max-w-0 -translate-x-2 opacity-0"
                          : "max-w-[190px] translate-x-0 opacity-100",
                      )}
                    >
                      New course
                    </span>
                  </Link>
                </TooltipTrigger>
                {compact ? (
                  <TooltipContent side="right" className="font-medium">
                    New course
                  </TooltipContent>
                ) : null}
              </Tooltip>
            </nav>

            <div className="border-t border-white/10 p-3">
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className={cn(
                  "flex h-10 w-full items-center overflow-hidden rounded-lg text-xs font-semibold text-white/58 transition-all duration-200 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                  compact ? "justify-center px-0" : "gap-2 px-3",
                )}
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-4 w-4 shrink-0" />
                ) : (
                  <PanelLeftClose className="h-4 w-4 shrink-0" />
                )}
                <span
                  aria-hidden={compact}
                  className={cn(
                    "min-w-0 truncate transition-[max-width,opacity,transform] duration-200",
                    compact
                      ? "max-w-0 -translate-x-2 opacity-0"
                      : "max-w-[150px] translate-x-0 opacity-100",
                  )}
                >
                  Collapse
                </span>
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-[max-height,opacity,transform] duration-200",
                  compact
                    ? "max-h-0 -translate-y-1 opacity-0"
                    : "max-h-24 translate-y-0 opacity-100",
                )}
              >
                <p className="mt-3 px-1 text-[11px] leading-relaxed text-white/48">
                  Instructor Studio is a separate workspace. Switch to{" "}
                  <button
                    type="button"
                    onClick={switchToStudent}
                    className="underline underline-offset-2 hover:text-white"
                  >
                    Student
                  </button>{" "}
                  to browse or learn.
                </p>
              </div>
            </div>
          </aside>
        </TooltipProvider>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile brand */}
            <Link
              href="/instructor"
              className="flex items-center gap-2 md:hidden"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1c1d1f]">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-semibold">EduPath</span>
            </Link>
            <h1 className="hidden truncate font-display text-lg font-semibold text-foreground md:block">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={switchToStudent}
            >
              <GraduationCap className="h-4 w-4" />
              Student
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 gap-2 px-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                    {(currentUser?.email ?? "U").slice(0, 1).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-xs text-muted-foreground">Signed in as</p>
                  <p className="truncate text-sm font-medium text-brand">
                    {currentUser?.email}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Instructor view
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/instructor/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Instructor profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/instructor/settings"
                      className="cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={switchToStudent}
                  className="cursor-pointer"
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Switch to student
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin console
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => void signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile nav strip */}
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-2 py-2 md:hidden">
          {PRIMARY_NAV.map((item) => {
            const active = isActive(pathname, item);
            const { Icon } = item;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
