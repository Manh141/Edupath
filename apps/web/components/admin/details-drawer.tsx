"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function DetailsDrawer({
  triggerLabel,
  title,
  description,
  children,
}: {
  triggerLabel: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">{triggerLabel}</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full border-l border-border bg-background p-0 sm:max-w-2xl">
        <div className="flex h-full flex-col">
          <div className="border-b border-border px-6 py-5">
            <SheetHeader>
              <SheetTitle className="text-2xl">{title}</SheetTitle>
              <SheetDescription className="mt-2 text-sm leading-6 text-body">
                {description}
              </SheetDescription>
            </SheetHeader>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
