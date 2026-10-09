import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock3, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { getCategory, type Product } from "@/lib/products";
import { formatNio } from "@/lib/utils";
import { StitchCard } from "@/components/stitch-card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

const tint = {
  mascaras: "fucsia",
  fiestas: "naranja",
  colegios: "cielo",
  personalizados: "lima",
} as const;

export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.category);
  const addLine = useCart((s) => s.addLine);

  function add() {
    addLine({
      productId: product.slug,
      detail: "intermedio",
      quantity: product.minQty,
      notes: "",
    });
    toast.success(`${product.name} en el carrito. El detalle se puede cambiar ahí.`);
  }

  return (
    <StitchCard accent={tint[product.category]} className="h-full overflow-hidden transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-1 hover:shadow-foam-hover">
      <div className="overflow-hidden rounded-[20px]">
        <Link
          to="/producto/$slug"
          params={{ slug: product.slug }}
          className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fucsia/70"
        >
          <div className="relative aspect-[1.08] overflow-hidden bg-blush">
            <img
              src={product.image}
              alt={product.name}
              className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
              <span className="rounded-full bg-card/95 px-2.5 py-1 text-xs font-bold text-ink shadow-foam">
              {category?.name}
              </span>
              {product.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amarillo px-2.5 py-1 text-[11px] font-black text-ink shadow-foam">
                  <Sparkles className="size-3" /> Favorita
                </span>
              ) : null}
            </div>
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
              <Clock3 className="size-3" /> {product.leadDays} días
            </span>
          </div>
          <div className="px-3.5 pt-3">
            <h3 className="font-display text-lg font-semibold text-ink">{product.name}</h3>
            <p className="mt-1 text-sm leading-snug text-muted">{product.tagline}</p>
          </div>
          <div className="mt-3 flex items-end justify-between gap-3 px-3.5 pb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Desde</p>
              <p className="font-display text-lg font-semibold tabular-nums text-fucsia">{formatNio(product.basePriceNio)}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-fucsia">
              Ver pieza <ArrowUpRight className="size-4" />
            </span>
          </div>
        </Link>
        <div className="border-t border-border/60 px-3.5 py-3">
          <Button type="button" size="sm" className="w-full" onClick={add}>
            Agregar al pedido
          </Button>
        </div>
      </div>
    </StitchCard>
  );
}
