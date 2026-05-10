import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="page-shell py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-hero">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">EduPath</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Practical online learning for mobile, tablet, and desktop users.
              Learn anywhere and keep your progress in sync.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Explore</h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/courses"
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                Courses
              </Link>
              <Link
                href="/categories"
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                Categories
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Support</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Help center</span>
              <span className="text-sm text-muted-foreground">Terms of use</span>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Contact</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">support@edupath.vn</span>
              <span className="text-sm text-muted-foreground">1900 xxxx</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-center text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span>© 2026 EduPath. All rights reserved.</span>
          <span>Responsive learning across phone, tablet, and desktop.</span>
        </div>
      </div>
    </footer>
  );
}
