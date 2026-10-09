import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock3, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StitchCard } from "@/components/stitch-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart";
import { getCategory, getProduct } from "@/lib/products";
import { DETAIL_LEVELS, type DetailId } from "@/lib/quote";
import { cn, formatNio } from "@/lib/utils";

export const Route = createFileRoute("/producto/$slug")({
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-2xl font-semibold">Esa pieza no está en el catálogo</h1>
        <p className="mt-2 text-muted">Puede que el enlace haya cambiado. Mira el catálogo o arma un pedido libre.</p>
        <Button asChild className="mt-6">
          <Link to="/catalogo">Volver al catálogo</Link>
        </Button>
      </div>
    );
  }

  const category = getCategory(product.category);

  return (
    <div>
      <Link
        to="/catalogo"
        search={{ cat: product.category }}
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-fucsia"
      >
        <ArrowLeft className="size-4" />
        {category?.name ?? "Catálogo"}
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <StitchCard accent="fucsia" padded>
          <div className="overflow-hidden rounded-[20px]">
            <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
          </div>
        </StitchCard>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-fucsia">{category?.name}</p>
          <h1 className="mt-1 text-3xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-lg text-muted">{product.tagline}</p>
          <p className="mt-4 leading-relaxed text-ink">{product.description}</p>

          <dl className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-card p-3 shadow-foam">
              <dt className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                <Package className="size-3.5" /> Desde
              </dt>
              <dd className="mt-1 font-display text-xl font-semibold tabular-nums">{formatNio(product.basePriceNio)}</dd>
            </div>
            <div className="rounded-2xl bg-card p-3 shadow-foam">
              <dt className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                <Clock3 className="size-3.5" /> Tiempo
              </dt>
              <dd className="mt-1 font-display text-xl font-semibold">{product.leadDays} días</dd>
            </div>
          </dl>

          {product.minQty > 1 ? (
            <p className="mt-3 text-sm text-muted">Pedido mínimo: {product.minQty} piezas.</p>
          ) : null}

          <h2 className="mt-6 text-lg font-semibold">Qué incluye</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-ink">
            {product.includes.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-fucsia" />
                {item}
              </li>
            ))}
          </ul>

          <PieceOptions slug={product.slug} minQty={product.minQty} name={product.name} />
        </div>
      </div>
    </div>
  );
}

function PieceOptions({ slug, minQty, name }: { slug: string; minQty: number; name: string }) {
  const addLine = useCart((s) => s.addLine);
  const [detail, setDetail] = useState<DetailId>("intermedio");
  const [quantity, setQuantity] = useState(minQty);
  const [notes, setNotes] = useState("");

  function add() {
    addLine({ productId: slug, detail, quantity, notes });
    toast.success(`${name} agregado al carrito`);
    setNotes("");
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="grid gap-2">
        {DETAIL_LEVELS.map((level) => (
          <button
            key={level.id}
            type="button"
            onClick={() => setDetail(level.id)}
            className={cn(
              "rounded-2xl px-4 py-3 text-left shadow-foam",
              detail === level.id ? "bg-fucsia text-white" : "bg-card text-ink",
            )}
          >
            <span className="block font-display text-base font-semibold">{level.name}</span>
            <span className={cn("text-sm", detail === level.id ? "text-white/90" : "text-muted")}>
              {level.blurb}
            </span>
          </button>
        ))}
      </div>
      <div>
        <Label htmlFor="cantidad-pieza">Cantidad (mín. {minQty})</Label>
        <Input
          id="cantidad-pieza"
          type="number"
          min={minQty}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(minQty, Number(e.target.value) || minQty))}
          className="mt-1.5 max-w-40 text-center tabular-nums"
        />
      </div>
      <div>
        <Label htmlFor="notas-pieza">Personaje o notas</Label>
        <Textarea
          id="notas-pieza"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Colores, personaje, tamaño…"
          className="mt-1.5"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" size="lg" onClick={add}>
          Agregar al carrito
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link to="/carrito">Ver carrito</Link>
        </Button>
      </div>
    </div>
  );
}
