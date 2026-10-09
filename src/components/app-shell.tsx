import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Calculator, Home, Phone, ShoppingBag } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { LogoMark } from "@/components/logo-mark";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { Wordmark } from "@/components/wordmark";
import { useCart } from "@/lib/cart";
import { SITE, WHATSAPP_BASE } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/catalogo", label: "Catálogo", icon: BookOpen },
  { to: "/cotizar", label: "Cotizar", icon: Calculator },
  { to: "/carrito", label: "Carrito", icon: ShoppingBag },
  { to: "/contacto", label: "Contacto", icon: Phone },
] as const;

function pathActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);
  const pieceCount = useCart((s) => s.lines.reduce((sum, line) => sum + line.quantity, 0));
  const count = ready ? pieceCount : 0;

  useEffect(() => {
    if (useCart.persist.hasHydrated()) {
      setReady(true);
      return;
    }
    return useCart.persist.onFinishHydration(() => setReady(true));
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenido"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-card focus-visible:px-4 focus-visible:py-2 focus-visible:shadow-foam"
      >
        Saltar al contenido
      </a>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-blush/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex items-center gap-2.5 rounded-full pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fucsia/70">
            <LogoMark size={44} />
            <Wordmark size="sm" />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-150",
                  pathActive(pathname, item.to)
                    ? "bg-card text-fucsia shadow-foam"
                    : "text-ink/80 hover:bg-card/70 hover:text-ink",
                )}
              >
                {item.label}
                {item.to === "/carrito" && count > 0 ? (
                  <span className="rounded-full bg-fucsia px-1.5 py-0.5 text-[10px] leading-none text-white">
                    {count > 99 ? "99+" : count}
                  </span>
                ) : null}
              </Link>
            ))}
            <Button asChild size="sm" variant="whatsapp" className="ml-2">
              <a href={WHATSAPP_BASE} target="_blank" rel="noreferrer">
                <WhatsAppIcon className="size-4" />
                WhatsApp
              </a>
            </Button>
          </nav>
          <Button asChild size="sm" variant="whatsapp" className="lg:hidden">
            <a href={WHATSAPP_BASE} target="_blank" rel="noreferrer" aria-label="Escribir por WhatsApp">
              <WhatsAppIcon className="size-4" />
            </a>
          </Button>
        </div>
      </header>

      <main id="contenido" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 lg:pb-12">
        {children}
      </main>

      <footer className="mb-16 border-t border-border/70 bg-card/70 lg:mb-0">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted">
          <p>
            {SITE.name} · {SITE.city}
          </p>
          <p>{SITE.hours}</p>
          <Link to="/nosotros" className="font-semibold text-fucsia hover:underline">
            Sobre el taller
          </Link>
        </div>
      </footer>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md lg:hidden"
        aria-label="Móvil"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathActive(pathname, item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl text-[11px] font-semibold",
                    active ? "text-fucsia" : "text-muted",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                  {item.to === "/carrito" && count > 0 ? (
                    <span className="absolute right-1/2 top-1 translate-x-4 rounded-full bg-fucsia px-1 text-[10px] font-bold leading-4 text-white">
                      {count > 99 ? "99+" : count}
                    </span>
                  ) : null}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          className: "font-sans",
        }}
      />
    </div>
  );
}
