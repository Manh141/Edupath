"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  GraduationCap,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser, isInstructorUser } from "@/lib/auth-session";
import { cartApi } from "@/lib/payment-api";
import { chatApi } from "@/lib/communication-api";

// ─── Teach CTA (one-way: student -> instructor studio) ───────────────────────

function TeachCta() {
  const { currentUser, setActiveRole } = useAuth();
  if (!currentUser) return null;

  const isAdmin = isAdminUser(currentUser);
  const canTeach = isInstructorUser(currentUser);

  if (isAdmin) {
    return (
      <Link
        href="/admin/overview"
        className="hidden items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground md:flex"
      >
        <Settings className="h-3.5 w-3.5" />
        Admin Console
      </Link>
    );
  }

  if (canTeach) {
    return (
      <Link
        href="/instructor"
        onClick={() => setActiveRole("instructor")}
        className="hidden items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground md:flex"
      >
        <BookOpen className="h-3.5 w-3.5" />
        Instructor Studio
      </Link>
    );
  }

  return (
    <Link
      href="/become-instructor"
      className="hidden items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground md:flex"
    >
      <BookOpen className="h-3.5 w-3.5" />
      Teach on EduPath
    </Link>
  );
}

function MobileTeachCta({ onClose }: { onClose: () => void }) {
  const { currentUser, setActiveRole } = useAuth();
  if (!currentUser) return null;

  const isAdmin = isAdminUser(currentUser);
  const canTeach = isInstructorUser(currentUser);
  const href = isAdmin
    ? "/admin/overview"
    : canTeach
      ? "/instructor"
      : "/become-instructor";
  const label = isAdmin
    ? "Admin Console"
    : canTeach
      ? "Instructor Studio"
      : "Teach on EduPath";
  const Icon = isAdmin ? Settings : BookOpen;

  return (
    <Link
      href={href}
      onClick={() => {
        if (canTeach) {
          setActiveRole("instructor");
        }
        onClose();
      }}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export default function Header() {
  const {
    currentUser,
    isAuthenticated,
    accessToken,
    signOut,
    setActiveRole,
  } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = isAdminUser(currentUser);
  const isInstructor = isInstructorUser(currentUser);

  const cartQuery = useQuery({
    queryKey: ["cart-count", accessToken],
    queryFn: () => cartApi.getMyCart(accessToken!),
    enabled: Boolean(accessToken) && isAuthenticated,
    staleTime: 60_000,
  });

  const cartCount = cartQuery.data?.items?.length ?? 0;

  const unreadQuery = useQuery({
    queryKey: ["chat-unread", accessToken],
    queryFn: () => chatApi.unreadSummary(accessToken!),
    enabled: Boolean(accessToken) && isAuthenticated,
    refetchInterval: 30_000,
  });
  const unreadCount = unreadQuery.data?.totalUnread ?? 0;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            EduPath
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/courses"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Courses
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Categories
          </Link>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              {/* Teach CTA */}
              <TeachCta />

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Wishlist</span>
                </Button>
              </Link>

              {/* Messages */}
              <Link href="/messages">
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <MessageSquare className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-4 min-w-4 px-1 text-[10px] bg-cta text-white border-0">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                  <span className="sr-only">Messages</span>
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <ShoppingCart className="h-4 w-4" />
                  {cartCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-4 min-w-4 px-1 text-[10px] bg-cta text-white border-0">
                      {cartCount > 9 ? "9+" : cartCount}
                    </Badge>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
              </Link>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                      {(currentUser?.email ?? "U").slice(0, 1).toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate text-sm">
                      {currentUser?.email ?? "Account"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="truncate font-medium text-brand text-sm">
                      {currentUser?.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link
                        href={isAdmin ? "/admin/overview" : "/dashboard"}
                        className="cursor-pointer"
                      >
                        {isAdmin ? (
                          <Settings className="mr-2 h-4 w-4" />
                        ) : (
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                        )}
                        {isAdmin ? "Admin Console" : "Dashboard"}
                      </Link>
                    </DropdownMenuItem>
                    {!isAdmin ? (
                      <DropdownMenuItem asChild>
                        <Link href="/my-learning" className="cursor-pointer">
                          <GraduationCap className="mr-2 h-4 w-4" />
                          My Learning
                        </Link>
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        Orders
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  {isInstructor && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/instructor"
                            className="cursor-pointer"
                            onClick={() => setActiveRole("instructor")}
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Instructor Studio
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </>
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
            </>
          ) : (
            <>
              <Link href="/auth/instructor?tab=signup">
                <Button variant="outline" size="sm">
                  Teach on EduPath
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth?tab=signup">
                <Button variant="default" size="sm">
                  Signup
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-border bg-card p-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/courses"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Categories
            </Link>
            {isAuthenticated ? (
              <>
                <MobileTeachCta onClose={() => setMobileOpen(false)} />
                <Link
                  href={isAdmin ? "/admin/overview" : "/dashboard"}
                  onClick={() => setMobileOpen(false)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    {isAdmin ? (
                      <Settings className="mr-2 h-4 w-4" />
                    ) : (
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                    )}
                    {isAdmin ? "Admin Console" : "Dashboard"}
                  </Button>
                </Link>
                {!isAdmin ? (
                  <Link
                    href="/my-learning"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <GraduationCap className="mr-2 h-4 w-4" />
                      My Learning
                    </Button>
                  </Link>
                ) : null}
                <Link href="/wishlist" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Button>
                </Link>
                <Link href="/cart" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart
                    {cartCount > 0 && (
                      <Badge className="ml-auto bg-cta text-white text-[10px] px-1.5">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/orders" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Orders
                  </Button>
                </Link>
                {isInstructor && (
                  <Link
                    href="/instructor"
                    onClick={() => {
                      setActiveRole("instructor");
                      setMobileOpen(false);
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Instructor Studio
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void signOut();
                    setMobileOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/instructor?tab=signup"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button variant="outline" size="sm" className="w-full">
                    Teach on EduPath
                  </Button>
                </Link>
                <Link href="/auth" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link
                  href="/auth?tab=signup"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button size="sm" className="w-full">
                    Signup
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
