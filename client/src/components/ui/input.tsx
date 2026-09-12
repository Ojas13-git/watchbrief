import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full min-w-0 rounded-[var(--radius-sm)] border border-line bg-paper-elevated px-3 text-sm text-ink placeholder:text-ink-faint outline-none transition-shadow duration-150 focus:border-accent/40 focus:ring-2 focus:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
