"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function QuickActionDialog({
  triggerLabel,
  title,
  description,
  children,
  confirmLabel = "Confirm",
  onConfirm,
}: {
  triggerLabel: string;
  title: string;
  description: string;
  children?: ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="rounded-[28px] border-border p-0 sm:max-w-xl">
        <div className="border-b border-border px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-2xl">{title}</DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-6 text-body">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>
        {children ? (
          <div className="space-y-4 px-6 py-5 text-sm leading-7 text-body">
            {children}
          </div>
        ) : null}
        <DialogFooter className="border-t border-border px-6 py-4">
          <Button variant="outline">Cancel</Button>
          <Button variant="cta" onClick={onConfirm} disabled={!onConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
