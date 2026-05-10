import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AdminFilterToolbarProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function AdminFilterToolbar({
  placeholder,
  value,
  onChange,
}: AdminFilterToolbarProps) {
  return (
    <div className="admin-card p-4 md:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={value ?? ""}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            className="h-11 rounded-2xl border-border bg-background pl-10 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
