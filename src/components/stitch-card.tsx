import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Accent = "fucsia" | "naranja" | "cielo" | "lima" | "amarillo";

const accentClass: Record<Accent, string> = {
  fucsia: "border-fucsia/50",
  naranja: "border-naranja/55",
  cielo: "border-cielo/55",
  lima: "border-lima/55",
  amarillo: "border-amarillo/70",
};

export function StitchCard({
  className,
  children,
  accent = "fucsia",
  padded = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & { accent?: Accent; padded?: boolean }) {
  return (
    <div
      className={cn(
        "relative rounded-[28px] bg-card shadow-foam",
        padded && "p-2",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-2 rounded-[20px] border-2 border-dashed",
          accentClass[accent],
        )}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
