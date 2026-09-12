"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/app", label: "Desk" },
  { href: "/app/history", label: "History" },
] as const;

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-5 sm:gap-8">
          <Link href="/" className="display shrink-0 text-lg text-ink">
            WatchBrief
          </Link>
          <nav className="flex items-center gap-1" aria-label="App">
            {nav.map((item) => {
              const active =
                item.href === "/app"
                  ? pathname === "/app"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-[var(--radius-sm)] px-2.5 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-ink/5 text-ink"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <UserButton />
      </div>
    </header>
  );
}
