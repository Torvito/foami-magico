import { createFileRoute } from "@tanstack/react-router";
import { QuoteForm } from "@/components/quote-form";
import { getProduct } from "@/lib/products";

type CotizarSearch = { producto?: string };

function parseSearch(s: Record<string, unknown>): CotizarSearch {
  const producto = typeof s.producto === "string" ? s.producto : undefined;
  if (producto && getProduct(producto)) return { producto };
  return {};
}

export const Route = createFileRoute("/cotizar")({
  validateSearch: parseSearch,
  component: Cotizar,
});

function Cotizar() {
  const { producto } = Route.useSearch();
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-fucsia">Cotizador</p>
      <h1 className="mt-1 text-3xl font-semibold">Arma tu pedido</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Elige una pieza, su detalle y la cantidad, y agrégala al carrito. Puedes sumar varias.
        El total, en córdobas o dólares, se confirma por WhatsApp antes de cortar.
      </p>
      <div className="mt-6">
        <QuoteForm initialSlug={producto} />
      </div>
    </div>
  );
}
