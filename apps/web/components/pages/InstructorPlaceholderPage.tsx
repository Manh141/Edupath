import type { ComponentType } from "react";

type Props = {
  title: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
  bullets?: string[];
};

export default function InstructorPlaceholderPage({
  title,
  description,
  Icon,
  bullets,
}: Props) {
  return (
    <div className="w-full px-4 py-8 sm:px-6 sm:py-10 xl:px-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">
          This workspace is being built. What&apos;s coming:
        </p>
        {bullets && bullets.length > 0 ? (
          <ul className="mx-auto mt-6 grid max-w-xl gap-2 text-left text-sm text-muted-foreground">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
