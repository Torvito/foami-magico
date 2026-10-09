import { createFileRoute } from "@tanstack/react-router";
import { CartPanel } from "@/components/cart-panel";

export const Route = createFileRoute("/carrito")({
  component: Carrito,
});

function Carrito() {
  return (
    <div className="mx-auto max-w-xl">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-fucsia">Pedido</p>
      <h1 className="mt-1 text-3xl font-semibold">Carrito</h1>
      <p className="mt-2 text-muted">
        Revisa las piezas, cambia cantidades y manda todo junto al taller.
      </p>
      <div className="mt-6">
        <CartPanel />
      </div>
    </div>
  );
}
