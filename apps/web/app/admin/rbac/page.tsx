"use client";

import { CheckCircle2, Loader2, Shield, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { adminRbacApi } from "@/lib/admin-api";

export default function AdminRbacPage() {
  const { accessToken } = useAuth();
  const rbacQuery = useQuery({
    queryKey: ["admin-rbac"],
    queryFn: () => adminRbacApi.getRbac(accessToken!),
    enabled: Boolean(accessToken),
  });

  if (rbacQuery.isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (rbacQuery.isError || !rbacQuery.data) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
        <p className="font-medium text-destructive">Failed to load RBAC data.</p>
        <Button
          variant="outline"
          className="mt-3"
          onClick={() => rbacQuery.refetch()}
        >
          Retry
        </Button>
      </div>
    );
  }

  const { roles, permissionMatrix } = rbacQuery.data;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Access control"
        title="RBAC & permissions"
        description="Role membership and permission matrix are loaded from auth-service."
        actions={
          <Button variant="outline" onClick={() => rbacQuery.refetch()}>
            Refresh
          </Button>
        }
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.role} className="admin-card">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xl font-bold capitalize">{role.role}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {role.members.toLocaleString("vi-VN")} members
                  </div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-brand">
                  <Shield className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {role.inherits.map((permission) => (
                  <Badge key={permission} variant="outline" className="rounded-full border-border bg-white px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-brand">
                    {permission}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="text-2xl">Permission matrix</CardTitle>
          <p className="text-sm leading-7 text-body">Module access by role.</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[640px] space-y-3">
              <div className="grid grid-cols-4 gap-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <div>Module</div>
                <div className="text-center">Admin</div>
                <div className="text-center">Instructor</div>
                <div className="text-center">Student</div>
              </div>
              {permissionMatrix.map((row) => (
                <div key={row.module} className="grid grid-cols-4 gap-3 rounded-[22px] border border-border bg-white p-4 text-sm">
                  <div className="font-semibold text-brand">{row.module}</div>
                  <PermissionCell allowed={row.admin} />
                  <PermissionCell allowed={row.instructor} />
                  <PermissionCell allowed={row.student} />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PermissionCell({ allowed }: { allowed: boolean }) {
  return (
    <div className="flex items-center justify-center">
      {allowed ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      ) : (
        <XCircle className="h-5 w-5 text-slate-300" />
      )}
    </div>
  );
}
