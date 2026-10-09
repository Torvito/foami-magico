import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, HandHeart, MapPin, MessageCircle, Scissors, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/logo-mark";
import { ProductCard } from "@/components/product-card";
import { StitchCard } from "@/components/stitch-card";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";
import { CATEGORIES } from "@/lib/products";
import { featuredProducts } from "@/lib/products";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({ component: Home });

const STEPS = [
  {
    icon: Sparkles,
    title: "Elige o describe",
    body: "Navega el catálogo o cuéntanos el personaje. Si no está, lo inventamos.",
  },
  {
    icon: Calendar,
    title: "Cotiza en un minuto",
    body: "Agrega varias piezas, con detalle y cantidad. El carrito suma el estimado en córdobas o dólares.",
  },
  {
    icon: MessageCircle,
    title: "Confirma por WhatsApp",
    body: "El pedido llega armado al taller. Ajustamos juntos el diseño y la entrega.",
  },
];

const NOTES = [
  {
    who: "Karla M. · Villa Fontana",
    text: "Los recuerdos de la piñata salieron idénticos al tema. Los niños pelearon por el unicornio.",
  },
  {
    who: "Profe Elena · San Patricio",
    text: "Las letras 3D aguantaron el año escolar y el mural se veía serio, no de juguetería.",
  },
  {
    who: "Marisol R. · Ciudad Sandino",
    text: "Pedí máscaras a última hora y igual llegaron con el elástico bien puesto. Se nota el oficio.",
  },
];

function Home() {
  const featured = featuredProducts();
  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="mx-auto">
          <LogoMark animated size={280} className="size-[min(72vw,280px)]" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-fucsia">
            Taller en Managua
          </p>
          <h1 className="mt-2">
            <Wordmark size="lg" />
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            Máscaras, recuerdos para piñatas, decoración de colegio y pedidos a
            tu medida. Foami cortado, cosido y armado a mano.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/cotizar">Cotizar mi pedido</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/catalogo">Ver catálogo</Link>
            </Button>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink">
            <li className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-fucsia" /> {SITE.city}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Scissors className="size-4 text-naranja" /> Hecho a mano
            </li>
            <li className="inline-flex items-center gap-1.5">
              <HandHeart className="size-4 text-lima" /> Pedidos por WhatsApp
            </li>
          </ul>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold">Categorías</h2>
          <Link to="/catalogo" className="text-sm font-semibold text-fucsia hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to="/catalogo"
              search={{ cat: cat.id }}
              className="block rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fucsia/70"
            >
              <StitchCard accent={cat.tint} className="h-full transition-[box-shadow] duration-200 hover:shadow-foam-hover">
                <div className="px-4 py-5">
                  <p className="font-display text-xl font-semibold text-ink">{cat.name}</p>
                  <p className="mt-1 text-sm leading-snug text-muted">{cat.blurb}</p>
                </div>
              </StitchCard>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Piezas que más piden</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Cómo pedirlo</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <StitchCard key={step.title} accent={i === 1 ? "naranja" : i === 2 ? "lima" : "fucsia"}>
                <div className="px-4 py-5">
                  <Icon className="size-6 text-fucsia" />
                  <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </StitchCard>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Lo que llega al taller</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {NOTES.map((note) => (
            <figure key={note.who} className="rounded-[28px] bg-card p-5 shadow-foam">
              <blockquote className="text-sm leading-relaxed text-ink">“{note.text}”</blockquote>
              <figcaption className="mt-3 text-xs font-semibold text-muted">{note.who}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] bg-fucsia px-6 py-10 text-white shadow-foam">
        <h2 className="text-3xl font-semibold text-white">¿Para cuándo es la fiesta?</h2>
        <p className="mt-2 max-w-xl text-white/90">
          Arma el estimado ahora y mándalo al WhatsApp del taller. Respondemos en horario de {SITE.hours.toLowerCase()}.
        </p>
        <Button asChild size="lg" variant="secondary" className="mt-6">
          <Link to="/cotizar">Abrir cotizador</Link>
        </Button>
      </section>
    </div>
  );
}
