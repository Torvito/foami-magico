import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Copy, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { useCart } from "@/lib/cart";
import { DETAIL_LEVELS, buildCartWhatsAppMessage, computeCart, whatsappUrl, type DetailId } from "@/lib/quote";
import { cn, formatNio, formatUsd, tomorrowIso } from "@/lib/utils";

export function CartPanel() {
  const lines = useCart((s) => s.lines);
  const customerName = useCart((s) => s.customerName);
  const eventDate = useCart((s) => s.eventDate);
  const currency = useCart((s) => s.currency);
  const updateQty = useCart((s) => s.updateQty);
  const updateDetail = useCart((s) => s.updateDetail);
  const updateNotes = useCart((s) => s.updateNotes);
  const removeLine = useCart((s) => s.removeLine);
  const setCustomerName = useCart((s) => s.setCustomerName);
  const setEventDate = useCart((s) => s.setEventDate);
  const setCurrency = useCart((s) => s.setCurrency);
  const clear = useCart((s) => s.clear);
  const [copied, setCopied] = useState(false);

  const cart = useMemo(() => computeCart(lines, eventDate), [lines, eventDate]);
  const totalLabel = cart.items.length
    ? currency === "NIO"
      ? formatNio(cart.totalNio)
      : formatUsd(cart.totalUsd)
    : "—";
  const altLabel = cart.items.length
    ? currency === "NIO"
      ? formatUsd(cart.totalUsd)
      : formatNio(cart.totalNio)
    : "";

  function orderMessage() {
    return buildCartWhatsAppMessage({ customerName, eventDate, cart });
  }

  function readyToSend() {
    if (!cart.items.length) {
      toast.error("Agrega al menos una pieza al carrito.");
      return false;
    }
    if (!customerName.trim()) {
      toast.error("Escribe tu nombre para enviar el pedido.");
      document.getElementById("cliente")?.focus();
      return false;
    }
    if (!eventDate) {
      toast.error("Indica la fecha del evento.");
      document.getElementById("fecha")?.focus();
      return false;
    }
    if (cart.tooSoon) {
      toast.error("La fecha del evento ya pasó. Elige un día próximo.");
      return false;
    }
    return true;
  }

  function sendWhatsApp() {
    if (!readyToSend()) return;
    window.open(whatsappUrl(orderMessage()), "_blank", "noopener,noreferrer");
  }

  async function copyMessage() {
    if (!readyToSend()) return;
    try {
      await navigator.clipboard.writeText(orderMessage());
      setCopied(true);
      toast.success("Pedido copiado. Pégalo en WhatsApp si el enlace no abre.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar. Prueba el botón de WhatsApp.");
    }
  }

  return (
    <div className="rounded-[28px] bg-card p-4 shadow-foam sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Tu carrito</h2>
        <div className="flex rounded-full bg-blush p-1 shadow-foam">
          {(["NIO", "USD"] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setCurrency(code)}
              className={cn(
                "min-h-9 rounded-full px-3 text-xs font-bold",
                currency === code ? "bg-fucsia text-white" : "text-muted",
              )}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {cart.items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">
          Todavía no hay piezas. Agrega varias: cada una conserva su detalle, cantidad y notas.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {cart.items.map((item) => (
            <li key={item.id} className="rounded-2xl bg-blush p-3">
              <div className="flex gap-3">
                <img
                  src={item.product.image}
                  alt=""
                  className="size-16 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold leading-tight">{item.product.name}</p>
                    <button
                      type="button"
                      onClick={() => removeLine(item.id)}
                      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-card hover:text-fucsia"
                      aria-label={`Quitar ${item.product.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold tabular-nums text-fucsia">{formatNio(item.totalNio)}</p>
                </div>
              </div>

              <label className="mt-3 block text-xs font-semibold text-muted">
                Detalle
                <select
                  value={item.level.id}
                  onChange={(e) => updateDetail(item.id, e.target.value as DetailId)}
                  className="mt-1 h-11 w-full rounded-2xl bg-card px-3 text-sm font-semibold text-ink shadow-foam outline-none ring-1 ring-border"
                >
                  {DETAIL_LEVELS.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-3 flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="size-11 px-0"
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                  aria-label="Menos"
                >
                  <Minus className="size-4" />
                </Button>
                <Input
                  type="number"
                  min={item.product.minQty}
                  value={item.quantity}
                  onChange={(e) => updateQty(item.id, Number(e.target.value))}
                  className="text-center tabular-nums"
                  aria-label={`Cantidad de ${item.product.name}`}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="size-11 px-0"
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                  aria-label="Más"
                >
                  <Plus className="size-4" />
                </Button>
              </div>

              {(item.volumeNio > 0 || item.rushNio > 0) && (
                <p className="mt-2 text-xs text-muted">
                  {item.volumeNio > 0 ? `Volumen −${formatNio(item.volumeNio)}` : null}
                  {item.volumeNio > 0 && item.rushNio > 0 ? " · " : null}
                  {item.rushNio > 0 ? `Express +${formatNio(item.rushNio)}` : null}
                </p>
              )}

              <label className="mt-3 block text-xs font-semibold text-muted">
                Notas de esta pieza
                <Input
                  value={item.notes}
                  onChange={(e) => updateNotes(item.id, e.target.value)}
                  placeholder="Personaje, colores, tamaño…"
                  className="mt-1"
                />
              </label>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 space-y-4">
        <div>
          <Label htmlFor="cliente">Nombre</Label>
          <Input
            id="cliente"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Ej. María López"
            autoComplete="name"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="fecha">Fecha del evento</Label>
          <Input
            id="fecha"
            type="date"
            min={tomorrowIso()}
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      <p className="mt-5 font-display text-3xl font-semibold tabular-nums text-fucsia">{totalLabel}</p>
      {altLabel ? <p className="text-sm text-muted">{altLabel}</p> : null}
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Suma de todas las piezas, con volumen y express si aplican. El total se confirma por WhatsApp.
      </p>

      <div className="mt-5 flex flex-col gap-2">
        <Button type="button" variant="whatsapp" size="lg" onClick={sendWhatsApp}>
          <WhatsAppIcon className="size-5" />
          Enviar pedido por WhatsApp
        </Button>
        <Button type="button" variant="secondary" onClick={copyMessage} disabled={!cart.items.length}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          Copiar el pedido
        </Button>
        {cart.items.length > 0 ? (
          <Button type="button" variant="ghost" onClick={clear}>
            Vaciar carrito
          </Button>
        ) : (
          <Button asChild variant="ghost">
            <Link to="/catalogo">Ver catálogo</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
