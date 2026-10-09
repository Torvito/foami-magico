import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  Check,
  HandHeart,
  MapPin,
  MessageCircle,
  Scissors,
  Sparkles,
} from "lucide-react";
import { LogoMark } from "@/components/logo-mark";
import { ProductCard } from "@/components/product-card";
import { StitchCard } from "@/components/stitch-card";
import { Button } from "@/components/ui/button";
import { CATEGORIES, featuredProducts } from "@/lib/products";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({ component: Home });

const STEPS = [
  {
    icon: Sparkles,
    number: "01",
    title: "Elige o describe",
    body: "Navega el catálogo o cuéntanos el personaje. Si no está, lo inventamos.",
  },
  {
    icon: Calendar,
    number: "02",
    title: "Cotiza en un minuto",
    body: "Agrega piezas, detalle, cantidad y fecha. El carrito arma tu estimado.",
  },
  {
    icon: MessageCircle,
    number: "03",
    title: "Confirma por WhatsApp",
    body: "El pedido llega armado al taller y ajustamos juntos diseño y entrega.",
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
    text: "Pedí máscaras a última hora y llegaron con el elástico bien puesto. Se nota el oficio.",
  },
];

function Home() {
  const featured = featuredProducts();
  const heroProducts = featured.slice(0, 3);

  return (
    <div className="space-y-16 pb-4">
      <section className="relative overflow-hidden rounded-[36px] bg-card px-5 py-8 shadow-foam sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-amarillo/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 size-72 rounded-full bg-fucsia/10 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blush px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-fucsia shadow-foam">
              <span className="size-2 rounded-full bg-lima" />
              Taller en {SITE.city}
            </div>
            <h1 className="mt-5 max-w-lg text-4xl font-semibold leading-[1.02] text-ink sm:text-5xl lg:text-6xl">
              Piezas hechas a mano para momentos que se quedan.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              Máscaras, recuerdos para piñatas, decoración de colegio y pedidos a tu medida. Foami cortado, cosido y armado con cariño.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-foam-hover">
                <Link to="/cotizar">
                  Cotizar mi pedido <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/catalogo">Ver catálogo</Link>
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink">
              <span className="inline-flex items-center gap-1.5"><MapPin className="size-4 text-fucsia" />{SITE.city}</span>
              <span className="inline-flex items-center gap-1.5"><Scissors className="size-4 text-naranja" />Hecho a mano</span>
              <span className="inline-flex items-center gap-1.5"><HandHeart className="size-4 text-lima" />Pedidos por WhatsApp</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] lg:pr-5">
            <div className="absolute left-1/2 top-1/2 size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[18px] border-blush shadow-inner" />
            <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
              {heroProducts.map((product, index) => (
                <Link
                  key={product.slug}
                  to="/producto/$slug"
                  params={{ slug: product.slug }}
                  className={index === 0 ? "group col-span-2 overflow-hidden rounded-[28px] bg-blush shadow-foam" : "group overflow-hidden rounded-[24px] bg-blush shadow-foam"}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className={index === 0 ? "aspect-[1.85] w-full object-cover transition duration-500 group-hover:scale-105" : "aspect-square w-full object-cover transition duration-500 group-hover:scale-105"}
                  />
                  <span className="block bg-card/90 px-3 py-2 text-xs font-bold text-ink backdrop-blur-sm">
                    {product.name}
                  </span>
                </Link>
              ))}
            </div>
            <div className="absolute -right-1 top-5 hidden rotate-6 items-center gap-2 rounded-2xl bg-amarillo px-3 py-2 text-xs font-black text-ink shadow-foam sm:flex">
              <Sparkles className="size-4" /> Hecho con magia
            </div>
            <div className="absolute -bottom-4 left-2 flex items-center gap-2 rounded-2xl bg-fucsia px-3 py-2 text-xs font-black text-white shadow-foam">
              <Check className="size-4" /> Diseños a tu medida
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          ["01", "Diseños con intención", "Cada pieza nace para una fiesta, aula o recuerdo especial."],
          ["02", "Cotización clara", "Mira cantidades, detalle y entrega antes de escribirnos."],
          ["03", "Atención cercana", "Te respondemos por WhatsApp en horario de taller."],
        ].map(([number, title, body], index) => (
          <div key={title} className="rounded-[24px] bg-card px-5 py-4 shadow-foam">
            <span className={`font-display text-sm font-bold ${index === 1 ? "text-naranja" : index === 2 ? "text-lima" : "text-fucsia"}`}>{number}</span>
            <h2 className="mt-2 text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-fucsia">Explora por ocasión</p>
            <h2 className="mt-1 text-3xl font-semibold">Categorías para empezar</h2>
          </div>
          <Link to="/catalogo" className="hidden items-center gap-1 text-sm font-bold text-fucsia hover:underline sm:inline-flex">
            Ver todas <ArrowRight className="size-4" />
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
              <StitchCard accent={cat.tint} className="h-full transition duration-200 hover:-translate-y-1 hover:shadow-foam-hover">
                <div className="flex min-h-32 flex-col justify-between px-4 py-5">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{cat.id}</span>
                  <div>
                    <p className="font-display text-xl font-semibold text-ink">{cat.name}</p>
                    <p className="mt-1 text-sm leading-snug text-muted">{cat.blurb}</p>
                  </div>
                </div>
              </StitchCard>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-fucsia">Favoritas del taller</p>
            <h2 className="mt-1 text-3xl font-semibold">Piezas que más piden</h2>
          </div>
          <Link to="/catalogo" className="hidden items-center gap-1 text-sm font-bold text-fucsia hover:underline sm:inline-flex">
            Ver catálogo <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </section>

      <section className="rounded-[32px] bg-ink px-5 py-8 text-white shadow-foam sm:px-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amarillo">Así funciona</p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Del primer boceto a tu celebración.</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, number, title, body }) => (
              <div key={number} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-amarillo">
                  <Icon className="size-5" />
                  <span className="font-display text-sm font-bold">{number}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-fucsia">Historias del taller</p>
            <h2 className="mt-1 text-3xl font-semibold">Lo que llega al taller</h2>
          </div>
          <span className="hidden text-sm font-semibold text-muted sm:block">Hecho con manos y corazón</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {NOTES.map((note) => (
            <figure key={note.who} className="rounded-[28px] bg-card p-5 shadow-foam transition hover:-translate-y-1 hover:shadow-foam-hover">
              <div className="mb-4 flex gap-1 text-amarillo"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
              <blockquote className="text-sm leading-relaxed text-ink">“{note.text}”</blockquote>
              <figcaption className="mt-4 text-xs font-bold text-muted">{note.who}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[32px] bg-fucsia px-6 py-10 text-white shadow-foam sm:px-10">
        <div className="pointer-events-none absolute -right-8 -top-10 opacity-20"><LogoMark size={180} /></div>
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">Tu idea puede ser la próxima pieza</p>
          <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">¿Para cuándo es la fiesta?</h2>
          <p className="mt-3 max-w-xl text-white/90">Arma el estimado ahora y mándalo al WhatsApp del taller. Respondemos de {SITE.hours.toLowerCase()}.</p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to="/cotizar">Abrir cotizador <ArrowRight className="size-5" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
