import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Surface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-line bg-paper-elevated shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
