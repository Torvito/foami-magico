import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 min-h-11 w-full rounded-2xl bg-card px-3.5 text-base text-ink shadow-foam placeholder:text-muted",
        "outline-none ring-1 ring-border focus:ring-2 focus:ring-fucsia/50",
        className,
      )}
      {...props}
    />
  );
}
