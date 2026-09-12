"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="display text-lg text-ink">
            WatchBrief
          </Link>
          <span className="hidden text-xs font-medium uppercase tracking-[0.14em] text-ink-faint sm:inline">
            Research desk
          </span>
        </div>
        <UserButton />
      </div>
    </header>
  );
}
