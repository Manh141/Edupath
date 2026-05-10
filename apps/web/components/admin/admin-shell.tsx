"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  User,
} from "lucide-react";
import { adminNavGroups } from "@/components/admin/admin-nav";
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
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const SIDEBAR_STORAGE_KEY = "edupath:admin:sidebar-collapsed";

function SidebarContent({
  compact,
  onNavigate,
}: {
  compact: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-[#0c1526] text-slate-100">
      <Link
        href="/admin/overview"
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-2.5 overflow-hidden border-b border-white/[0.06]",
          compact ? "justify-center px-3 py-4" : "px-4 py-4",
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-gradient ring-1 ring-white/10">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <div
          aria-hidden={compact}
          className={cn(
            "min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-200",
            compact
              ? "max-w-0 -translate-x-2 opacity-0"
              : "max-w-[170px] translate-x-0 opacity-100",
          )}
        >
          <div className="truncate font-display text-sm font-bold leading-tight text-white">
            EduPath Admin
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Console v2.0
          </div>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {adminNavGroups.map((group) => (
          <div key={group.label} className="mb-3">
            <div
              aria-hidden={compact}
              className={cn(
                "overflow-hidden px-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 transition-[max-height,opacity,transform,padding] duration-200",
                compact
                  ? "max-h-0 -translate-y-1 py-0 opacity-0"
                  : "max-h-8 translate-y-0 py-1.5 opacity-100",
              )}
            >
              {group.label}
            </div>
            {group.items.map((item) => {
              const isActive =
                pathname === item.href ||
                (pathname?.startsWith(`${item.href}/`) ?? false);
              const Icon = item.icon;
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-label={item.label}
                      className={cn(
                        "mb-0.5 flex items-center overflow-hidden rounded-md text-[13px] font-medium transition-all duration-200",
                        compact ? "justify-center px-0 py-2.5" : "gap-2.5 px-2.5 py-[9px]",
                        isActive
                          ? "bg-cta/15 text-cta"
                          : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span
                        aria-hidden={compact}
                        className={cn(
                          "truncate transition-[max-width,opacity,transform] duration-200",
                          compact
                            ? "max-w-0 -translate-x-2 opacity-0"
                            : "max-w-[170px] translate-x-0 opacity-100",
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
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );
}

function Topbar({ onMenuOpen }: { onMenuOpen?: () => void }) {
  const router = useRouter();
  const { currentUser, signOut } = useAuth();
  const email = currentUser?.email ?? "admin@edupath";
  const initials = email.slice(0, 2).toUpperCase();
  const roles = currentUser?.roles ?? [];
  const displayRole = currentUser?.role ?? roles[0] ?? "admin";

  const handleSignOut = async () => {
    await signOut();
    router.replace("/auth?tab=login");
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-white/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {onMenuOpen ? (
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={onMenuOpen}
            >
              <Menu className="h-4 w-4" />
            </Button>
          ) : null}

          <div className="relative hidden w-[320px] md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users, courses, orders..."
              className="h-10 rounded-full border-border bg-muted/60 pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-muted-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cta ring-2 ring-white" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-10 gap-2 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                  {initials}
                </div>
                <div className="hidden text-left md:block">
                  <div className="text-sm font-semibold text-brand leading-tight">
                    {email}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {displayRole}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="font-normal">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="truncate text-sm font-medium text-brand">{email}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Admin console
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/rbac" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Access control
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => void handleSignOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "1" : "0");
      } catch {
        // ignore storage failures
      }
      return next;
    });
  };

  const compact = collapsed;

  return (
    <div className="min-h-screen bg-background text-body">
      <div className="flex min-h-screen">
        <TooltipProvider delayDuration={120}>
          <aside
            className={cn(
              "relative hidden shrink-0 border-r border-[#0c1526] bg-[#0c1526] transition-[width] duration-300 ease-out lg:flex lg:flex-col",
              compact ? "w-[88px]" : "w-[272px]",
            )}
          >
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="absolute right-0 top-5 z-10 flex h-8 w-8 translate-x-1/2 items-center justify-center rounded-full border border-border bg-white text-brand shadow-md transition-colors duration-200 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {compact ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>

            <SidebarContent compact={compact} />

            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(
                "flex items-center overflow-hidden border-t border-white/[0.06] py-2.5 text-[11px] font-medium text-slate-400 transition-colors duration-200 hover:bg-white/[0.04] hover:text-slate-200",
                compact ? "justify-center px-0" : "gap-2 px-3",
              )}
            >
              {compact ? (
                <PanelLeftOpen className="h-4 w-4 shrink-0" />
              ) : (
                <PanelLeftClose className="h-4 w-4 shrink-0" />
              )}
              <span
                aria-hidden={compact}
                className={cn(
                  "truncate transition-[max-width,opacity,transform] duration-200",
                  compact
                    ? "max-w-0 -translate-x-2 opacity-0"
                    : "max-w-[120px] translate-x-0 opacity-100",
                )}
              >
                Collapse
              </span>
            </button>
          </aside>
        </TooltipProvider>

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenuOpen={() => setMobileOpen(true)} />
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="w-[280px] max-w-[85vw] border-r-0 bg-[#0c1526] p-0"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Admin navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent
              compact={false}
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
