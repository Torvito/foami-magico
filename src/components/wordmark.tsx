import { cn } from "@/lib/utils";

const LETTERS = [
  { ch: "F", color: "text-fucsia" },
  { ch: "o", color: "text-amarillo" },
  { ch: "a", color: "text-naranja" },
  { ch: "m", color: "text-lima" },
  { ch: "i", color: "text-cielo" },
] as const;

export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const letter = size === "lg" ? "text-4xl sm:text-5xl" : size === "sm" ? "text-xl" : "text-2xl";
  const script = size === "lg" ? "text-2xl sm:text-3xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <span className={cn("inline-flex items-baseline gap-1.5 leading-none", className)}>
      <span
        className={cn(
          "font-display font-semibold tracking-tight [text-shadow:0_1px_0_rgb(58_20_48_/_0.4)]",
          letter,
        )}
      >
        {LETTERS.map((l) => (
          <span key={l.ch + l.color} className={l.color}>
            {l.ch}
          </span>
        ))}
      </span>
      <span className={cn("font-sans font-extrabold italic text-ink", script)}>Mágico</span>
    </span>
  );
}
