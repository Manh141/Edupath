import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const badgeStyles: Record<string, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  published: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  pending_review: "border-amber-200 bg-amber-50 text-amber-700",
  in_progress: "border-sky-200 bg-sky-50 text-sky-700",
  changes_requested: "border-amber-200 bg-amber-50 text-amber-700",
  inactive: "border-slate-200 bg-slate-100 text-slate-700",
  archived: "border-slate-200 bg-slate-100 text-slate-700",
  cancelled: "border-slate-200 bg-slate-100 text-slate-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
  banned: "border-rose-200 bg-rose-50 text-rose-700",
  refunded: "border-purple-200 bg-purple-50 text-purple-700",
  revoked: "border-rose-200 bg-rose-50 text-rose-700",
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Pending: "border-amber-200 bg-amber-50 text-amber-700",
  "Refund Requested": "border-amber-200 bg-amber-50 text-amber-700",
  Locked: "border-slate-200 bg-slate-100 text-slate-700",
  Hidden: "border-slate-200 bg-slate-100 text-slate-700",
  Rejected: "border-rose-200 bg-rose-50 text-rose-700",
  Failed: "border-rose-200 bg-rose-50 text-rose-700",
};

export function StatusBadge({ value }: { value: string }) {
  const displayValue = value.replace(/_/g, " ");

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
        badgeStyles[value] ?? "border-slate-200 bg-slate-100 text-slate-700",
      )}
    >
      {displayValue}
    </Badge>
  );
}
