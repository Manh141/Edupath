"use client";

import Link from "next/link";

type AuthFlowNoticePageProps = {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function AuthFlowNoticePage({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: AuthFlowNoticePageProps) {
  return (
    <div className="container mx-auto max-w-lg px-4 py-12">
      <div className="rounded-[2rem] border border-border bg-card p-8 shadow-card">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Auth Flow Updated
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold text-foreground">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center rounded-xl border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
