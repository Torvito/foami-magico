import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock3, MapPin, Phone } from "lucide-react";
import { StitchCard } from "@/components/stitch-card";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { SITE, WHATSAPP_BASE } from "@/lib/site";

export const Route = createFileRoute("/contacto")({ component: Contacto });

function Contacto() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-fucsia">Contacto</p>
      <h1 className="mt-1 text-3xl font-semibold">Hablemos por WhatsApp</h1>
      <p className="mt-2 text-muted">
        El taller atiende pedidos y dudas al mismo número. Si ya tienes cantidades y fecha, el
        cotizador arma el mensaje por ti.
      </p>

      <div className="mt-8 grid gap-3">
        <StitchCard accent="lima">
          <div className="flex items-start gap-3 px-4 py-5">
            <Phone className="mt-0.5 size-5 text-fucsia" />
            <div>
              <h2 className="font-semibold">WhatsApp y llamadas</h2>
              <a href={`tel:+${SITE.phoneE164}`} className="mt-1 block text-lg font-display font-semibold text-ink">
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </StitchCard>
        <StitchCard accent="cielo">
          <div className="flex items-start gap-3 px-4 py-5">
            <MapPin className="mt-0.5 size-5 text-fucsia" />
            <div>
              <h2 className="font-semibold">Ciudad</h2>
              <p className="mt-1 text-muted">{SITE.city}</p>
            </div>
          </div>
        </StitchCard>
        <StitchCard accent="naranja">
          <div className="flex items-start gap-3 px-4 py-5">
            <Clock3 className="mt-0.5 size-5 text-fucsia" />
            <div>
              <h2 className="font-semibold">Horario</h2>
              <p className="mt-1 text-muted">{SITE.hours}</p>
            </div>
          </div>
        </StitchCard>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" variant="whatsapp">
          <a href={WHATSAPP_BASE} target="_blank" rel="noreferrer">
            <WhatsAppIcon className="size-5" />
            Escribir ahora
          </a>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link to="/cotizar">Armar cotización</Link>
        </Button>
      </div>
    </div>
  );
}
