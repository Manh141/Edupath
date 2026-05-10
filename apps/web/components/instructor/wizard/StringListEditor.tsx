"use client";

import { useState } from "react";
import { GripVertical, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StringListEditor({
  label,
  description,
  placeholder,
  items,
  minItems,
  maxItems,
  saving,
  disabled,
  onSave,
}: {
  label: string;
  description?: string;
  placeholder: string;
  items: string[];
  minItems: number;
  maxItems?: number;
  saving: boolean;
  disabled?: boolean;
  onSave: (items: string[]) => void;
}) {
  const [local, setLocal] = useState<string[]>(items);
  const [draft, setDraft] = useState("");
  const [dirty, setDirty] = useState(false);

  const updateItem = (index: number, value: string) => {
    setLocal((prev) => prev.map((item, i) => (i === index ? value : item)));
    setDirty(true);
  };

  const removeItem = (index: number) => {
    setLocal((prev) => prev.filter((_, i) => i !== index));
    setDirty(true);
  };

  const addItem = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (maxItems !== undefined && local.length >= maxItems) return;
    setLocal((prev) => [...prev, trimmed]);
    setDraft("");
    setDirty(true);
  };

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= local.length) return;
    setLocal((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
    setDirty(true);
  };

  const handleSave = () => {
    const cleaned = local.map((item) => item.trim()).filter(Boolean);
    onSave(cleaned);
  };

  const meetsMin = local.length >= minItems;

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      <ul className="space-y-2">
        {local.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1"
          >
            <div className="flex flex-col text-muted-foreground">
              <button
                type="button"
                onClick={() => move(index, -1)}
                className="text-[10px] leading-none hover:text-foreground"
                aria-label="Move up"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                className="text-[10px] leading-none hover:text-foreground"
                aria-label="Move down"
              >
                ▼
              </button>
            </div>
            <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/60" />
            <Input
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              disabled={disabled}
              className="h-9 border-none shadow-none focus-visible:ring-0"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              disabled={disabled}
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </li>
        ))}
        {local.length === 0 && (
          <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
            No items yet. Add at least {minItems}.
          </p>
        )}
      </ul>

      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
          disabled={disabled}
        />
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          disabled={
            disabled || !draft.trim() || (maxItems !== undefined && local.length >= maxItems)
          }
        >
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <p className="text-xs text-muted-foreground">
          {local.length} item(s){" "}
          {meetsMin ? (
            <span className="text-emerald-600">— minimum reached</span>
          ) : (
            <span className="text-destructive">
              — need {minItems - local.length} more
            </span>
          )}
        </p>
        <Button
          type="button"
          variant="hero"
          size="sm"
          onClick={handleSave}
          disabled={disabled || saving || !dirty}
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save
        </Button>
      </div>
    </div>
  );
}
