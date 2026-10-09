import { createFileRoute, Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/logo-mark";
import { StitchCard } from "@/components/stitch-card";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/nosotros")({ component: Nosotros });

function Nosotros() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-fucsia">El taller</p>
      <h1 className="mt-1 text-3xl font-semibold">Foami con oficio, no de fábrica</h1>
      <div className="mt-8 flex justify-center">
        <LogoMark animated size={220} />
      </div>
      <div className="mt-8 space-y-4 text-base leading-relaxed text-ink">
        <p>
          Foami Mágico es un emprendimiento de Managua. Cortamos, pegamos y cosimos goma EVA
          para fiestas, colegios y encargos que no se resuelven con un molde genérico.
        </p>
        <p>
          Trabajamos máscaras con personaje, recuerdos de piñata, centros de mesa, letras para
          aula y piezas a medida. El nivel de detalle lo eliges tú: de silueta limpia a un
          acabado de muchas capas.
        </p>
        <p>
          No tenemos vitrina en mall. El catálogo está aquí y el pedido entra por WhatsApp al{" "}
          {SITE.phoneDisplay}. Si la fecha aprieta, lo decimos claro — y si se puede, cobramos
          express.
        </p>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <StitchCard accent="cielo">
          <div className="px-4 py-5">
            <h2 className="text-lg font-semibold">Dónde</h2>
            <p className="mt-1 text-sm text-muted">{SITE.city}</p>
            <p className="mt-1 text-sm text-muted">{SITE.hours}</p>
          </div>
        </StitchCard>
        <StitchCard accent="lima">
          <div className="px-4 py-5">
            <h2 className="text-lg font-semibold">Cómo se trabaja</h2>
            <p className="mt-1 text-sm text-muted">
              Cotización, boceto si hace falta, seña y entrega acordada. Sin letra chica.
            </p>
          </div>
        </StitchCard>
      </div>
      <Button asChild size="lg" className="mt-8">
        <Link to="/cotizar">Cotizar un pedido</Link>
      </Button>
    </div>
  );
}
