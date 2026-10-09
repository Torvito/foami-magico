import { Link } from "@tanstack/react-router";
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
    <StitchCard accent={tint[product.category]} className="h-full transition-[box-shadow,transform] duration-200 ease-out hover:shadow-foam-hover">
      <div className="overflow-hidden rounded-[20px]">
        <Link
          to="/producto/$slug"
          params={{ slug: product.slug }}
          className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fucsia/70"
        >
          <div className="relative aspect-square overflow-hidden bg-blush">
            <img
              src={product.image}
              alt={product.name}
              className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            />
            <span className="absolute left-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-foam">
              {category?.name}
            </span>
          </div>
          <div className="px-3.5 pt-3">
            <h3 className="font-display text-lg font-semibold text-ink">{product.name}</h3>
            <p className="mt-1 text-sm leading-snug text-muted">{product.tagline}</p>
          </div>
        </Link>
        <div className="flex items-center justify-between gap-2 px-3.5 pb-4 pt-3">
          <p className="text-sm font-semibold text-ink">Desde {formatNio(product.basePriceNio)}</p>
          <Button type="button" size="sm" onClick={add}>
            Agregar
          </Button>
        </div>
      </div>
    </StitchCard>
  );
}
