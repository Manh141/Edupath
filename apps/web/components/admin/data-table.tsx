import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AdminDataTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="admin-table-wrap">
      <Table>
        <TableHeader className="bg-secondary/70">
          <TableRow className="hover:bg-transparent">
            {headers.map((header) => (
              <TableHead
                key={header}
                className="h-14 px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}

export function AdminCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <TableCell className={`px-5 py-4 text-sm text-body ${className}`}>{children}</TableCell>;
}
