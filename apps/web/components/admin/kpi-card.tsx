import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AdminKpiCard({
  title,
  value,
  delta,
  note,
  icon,
}: {
  title: string;
  value: string;
  delta: string;
  note: string;
  icon: ReactNode;
}) {
  const isNegative = delta.trim().startsWith("-");

  return (
    <Card className="admin-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-3xl font-bold tracking-tight text-brand">{value}</div>
            <div className="text-sm">
              <span
                className={cn(
                  "font-semibold",
                  isNegative ? "text-rose-600" : "text-emerald-600",
                )}
              >
                {delta}
              </span>
              <span className="ml-2 text-muted-foreground">{note}</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-brand">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
