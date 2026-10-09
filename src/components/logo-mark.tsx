import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function LogoMark({
  className,
  animated = false,
  size = 56,
}: {
  className?: string;
  animated?: boolean;
  size?: number;
}) {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const showVideo = animated && !reduce;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-blush shadow-foam",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {showVideo ? (
        <video
          src="/images/logo-loop.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/logo-mark.jpg"
          className="size-full object-cover"
          aria-hidden="true"
        />
      ) : (
        <img
          src="/images/logo.png"
          alt=""
          width={size}
          height={size}
          className="size-full object-cover"
        />
      )}
    </span>
  );
}
