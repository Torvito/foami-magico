import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-2xl bg-card px-3.5 py-3 text-base text-ink shadow-foam placeholder:text-muted",
        "outline-none ring-1 ring-border focus:ring-2 focus:ring-fucsia/50",
        className,
      )}
      {...props}
    />
  );
}
