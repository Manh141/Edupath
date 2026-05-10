"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Loader2, RotateCcw, ShieldCheck, UserCheck } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminCell, AdminDataTable } from "@/components/admin/data-table";
import { DetailsDrawer } from "@/components/admin/details-drawer";
import { AdminFilterToolbar } from "@/components/admin/filter-toolbar";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataPagination } from "@/components/ui/data-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { adminUserApi } from "@/lib/user-api";
import type { AdminUser } from "@/types/user";

const roleBadgeStyles: Record<string, string> = {
  admin: "border-transparent bg-brand/10 text-brand",
  instructor: "border-transparent bg-cta/10 text-cta",
  student: "border-transparent bg-emerald-100 text-emerald-700",
};

function resolveUserRoles(user: AdminUser): string[] {
  const roles = new Set<string>();
  (user.roles ?? []).forEach((role) => {
    if (role) roles.add(role.toLowerCase());
  });
  if (user.role) roles.add(user.role.toLowerCase());
  if (user.isInstructor) roles.add("instructor");
  if (roles.size === 0) roles.add("student");
  return Array.from(roles);
}

function RoleBadges({ roles }: { roles: string[] }) {
  const ordered = ["admin", "instructor", "student"].filter((r) => roles.includes(r));
  return (
    <div className="flex flex-wrap gap-1.5">
      {ordered.map((role) => (
        <Badge
          key={role}
          variant="outline"
          className={`capitalize ${roleBadgeStyles[role] ?? ""}`}
        >
          {role}
        </Badge>
      ))}
    </div>
  );
}

function UserRow({ user }: { user: AdminUser }) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const displayName = user.fullName || user.email;
  const userRoles = resolveUserRoles(user);
  const initials = displayName.slice(0, 2).toUpperCase();

  const statusMutation = useMutation({
    mutationFn: (status: string) =>
      adminUserApi.updateUserStatus(user.id, status, accessToken!),
    onSuccess: () => {
      toast.success("User status updated.");
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Failed to update status."),
  });

  return (
    <TableRow>
      <AdminCell>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-bold text-white">
            {initials}
          </div>
          <div>
            <div className="font-semibold text-brand">{displayName}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </AdminCell>
      <AdminCell>
        <RoleBadges roles={userRoles} />
      </AdminCell>
      <AdminCell>
        <StatusBadge value={user.status} />
      </AdminCell>
      <AdminCell>
        {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "N/A"}
      </AdminCell>
      <AdminCell>
        <DetailsDrawer
          triggerLabel="View"
          title={displayName}
          description="User profile details and operational controls."
        >
          <div className="space-y-5 text-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <InfoCard label="Email" value={user.email} />
              <InfoCard
                label="Roles"
                value={userRoles.map((r) => r[0].toUpperCase() + r.slice(1)).join(", ")}
              />
              <InfoCard label="Status" value={user.status} />
              <InfoCard
                label="Created"
                value={
                  user.createdAt ? format(new Date(user.createdAt), "PPP") : "N/A"
                }
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={user.status === "active" || statusMutation.isPending}
                onClick={() => statusMutation.mutate("active")}
              >
                Activate
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={user.status === "inactive" || statusMutation.isPending}
                onClick={() => statusMutation.mutate("inactive")}
              >
                Mark inactive
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={user.status === "banned" || statusMutation.isPending}
                onClick={() => statusMutation.mutate("banned")}
              >
                Ban
              </Button>
            </div>
          </div>
        </DetailsDrawer>
      </AdminCell>
    </TableRow>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-medium text-brand">{value}</div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { accessToken } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState("");

  const usersQuery = useQuery({
    queryKey: ["admin-users", { search, page, pageSize, status: statusFilter }],
    queryFn: () =>
      adminUserApi.listUsers(
        {
          searchTerm: search || undefined,
          page,
          limit: pageSize,
          status: statusFilter || undefined,
        },
        accessToken!,
      ),
    enabled: Boolean(accessToken),
  });

  const users: AdminUser[] =
    usersQuery.data?.items ?? usersQuery.data?.data ?? [];
  const total = usersQuery.data?.meta?.total ?? usersQuery.data?.total ?? users.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="User operations"
        title="User management"
        description="Manage student and instructor profiles with live status data from user-service."
        actions={
          <Select
            value={statusFilter || "_all"}
            onValueChange={(v) => {
              setStatusFilter(v === "_all" ? "" : v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <AdminFilterToolbar
        placeholder="Search by name, email or headline..."
        value={search}
        onChange={(value: string) => {
          setSearch(value);
          setPage(1);
        }}
      />

      {usersQuery.isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : usersQuery.isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
          <p className="font-medium text-destructive">Failed to load users.</p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => usersQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <AdminDataTable
            headers={["User", "Roles", "Status", "Created", "Actions"]}
          >
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </AdminDataTable>

          <DataPagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            itemLabel="users"
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            disabled={usersQuery.isFetching}
          />
        </>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <FeaturePanel
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Status controls"
          description="Active, inactive and banned states are written through the admin user API."
        />
        <FeaturePanel
          icon={<RotateCcw className="h-5 w-5" />}
          title="Profile lifecycle"
          description="The table uses the same pagination and filters as the backend contract."
        />
        <FeaturePanel
          icon={<UserCheck className="h-5 w-5" />}
          title="Instructor profiles"
          description="Instructor state is read from the profile source of truth."
        />
      </div>
    </div>
  );
}

function FeaturePanel({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="admin-card p-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-brand">
        {icon}
      </div>
      <div className="mt-4 text-xl font-bold">{title}</div>
      <p className="mt-2 text-sm leading-7 text-body">{description}</p>
    </div>
  );
}
