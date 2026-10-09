import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { CartPanel } from "@/components/cart-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart";
import { CATEGORIES, PRODUCTS, getProduct } from "@/lib/products";
import { DETAIL_LEVELS, computeQuote, type DetailId } from "@/lib/quote";
import { cn, formatNio } from "@/lib/utils";

export function QuoteForm({ initialSlug }: { initialSlug?: string }) {
  const initial = initialSlug && getProduct(initialSlug) ? initialSlug : null;
  const [productId, setProductId] = useState<string | null>(initial);
  const [detail, setDetail] = useState<DetailId>("intermedio");
  const [quantity, setQuantity] = useState(() => getProduct(initial ?? "")?.minQty ?? 1);
  const [notes, setNotes] = useState("");
  const eventDate = useCart((s) => s.eventDate);
  const addLine = useCart((s) => s.addLine);

  useEffect(() => {
    if (!initialSlug) return;
    const next = getProduct(initialSlug);
    if (!next) return;
    setProductId(next.slug);
    setQuantity((qty) => Math.max(next.minQty, qty));
  }, [initialSlug]);

  const product = productId ? getProduct(productId) : undefined;
  const quote = useMemo(
    () =>
      computeQuote({
        productId,
        detail,
        quantity,
        eventDate,
        customerName: "",
        notes,
      }),
    [productId, detail, quantity, eventDate, notes],
  );

  function selectProduct(slug: string) {
    const next = getProduct(slug);
    setProductId(slug);
    if (next) setQuantity(next.minQty);
  }

  function bumpQty(delta: number) {
    const min = product?.minQty ?? 1;
    setQuantity((q) => Math.max(min, q + delta));
  }

  function addToCart() {
    if (!product) {
      toast.error("Elige un producto del catálogo para agregarlo.");
      return;
    }
    addLine({ productId: product.slug, detail, quantity, notes });
    toast.success(`${product.name} agregado. Puedes sumar otra pieza.`);
    setNotes("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <section className="rounded-[28px] bg-card p-4 shadow-foam sm:p-5">
          <h2 className="font-display text-xl font-semibold">1. Elige la pieza</h2>
          <p className="mt-1 text-sm text-muted">Toca una tarjeta. Puedes cambiarla cuando quieras.</p>
          <div className="mt-4 space-y-5">
            {CATEGORIES.map((cat) => {
              const items = PRODUCTS.filter((item) => item.category === cat.id);
              return (
                <div key={cat.id}>
                  <h3 className="text-sm font-semibold text-muted">{cat.name}</h3>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {items.map((item) => {
                      const selected = item.slug === productId;
                      return (
                        <button
                          key={item.slug}
                          type="button"
                          onClick={() => selectProduct(item.slug)}
                          aria-pressed={selected}
                          className={cn(
                            "overflow-hidden rounded-[20px] bg-blush text-left shadow-foam transition-[transform,box-shadow] duration-150 active:scale-[0.96]",
                            selected && "ring-2 ring-fucsia ring-offset-2 ring-offset-card",
                          )}
                        >
                          <img src={item.image} alt="" className="aspect-square w-full object-cover" />
                          <span className="block px-2.5 py-2 text-xs font-semibold leading-tight text-ink">
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[28px] bg-card p-4 shadow-foam sm:p-5">
          <h2 className="font-display text-xl font-semibold">2. Detalle y cantidad</h2>
          <div className="mt-4 grid gap-2">
            {DETAIL_LEVELS.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setDetail(level.id)}
                className={cn(
                  "rounded-2xl px-4 py-3 text-left shadow-foam transition-colors duration-150",
                  detail === level.id ? "bg-fucsia text-white" : "bg-blush text-ink",
                )}
              >
                <span className="block font-display text-base font-semibold">{level.name}</span>
                <span className={cn("text-sm", detail === level.id ? "text-white/90" : "text-muted")}>
                  {level.blurb}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5">
              <Label htmlFor="cantidad">Cantidad {product ? `(mín. ${product.minQty})` : ""}</Label>
              <div className="mt-1.5 flex max-w-xs items-center gap-2">
                <Button type="button" variant="secondary" size="sm" className="size-11 px-0" onClick={() => bumpQty(-1)} aria-label="Menos">
                  <Minus className="size-4" />
                </Button>
                <Input
                  id="cantidad"
                  type="number"
                  min={product?.minQty ?? 1}
                  value={quantity}
                  onChange={(e) => {
                    const min = product?.minQty ?? 1;
                    setQuantity(Math.max(min, Number(e.target.value) || min));
                  }}
                  className="text-center tabular-nums"
                />
                <Button type="button" variant="secondary" size="sm" className="size-11 px-0" onClick={() => bumpQty(1)} aria-label="Más">
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
            {product ? (
              <p className="mt-2 text-xs text-muted">
                Tiempo habitual: {product.leadDays} días. La fecha del evento va en el carrito; si queda cerca, se suma express.
              </p>
            ) : null}
        </section>

        <section className="rounded-[28px] bg-card p-4 shadow-foam sm:p-5">
          <h2 className="font-display text-xl font-semibold">3. Notas de esta pieza</h2>
          <div className="mt-4">
            <Label htmlFor="notas">Personaje o notas</Label>
            <Textarea
              id="notas"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Unicornio lila con estrellas, para niña de 6 años"
              className="mt-1.5"
            />
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="button" size="lg" onClick={addToCart}>
              <ShoppingBag className="size-5" />
              Agregar al carrito
            </Button>
            {quote ? (
              <p className="text-sm font-semibold text-ink">
                Esta pieza: {formatNio(quote.totalNio)}
                {quote.rushNio > 0 ? " con express" : ""}
              </p>
            ) : null}
          </div>
        </section>
      </div>

      <aside className="h-fit lg:sticky lg:top-24">
        <CartPanel />
      </aside>
    </div>
  );
}
