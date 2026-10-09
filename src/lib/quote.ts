import { formatDateEs, formatNio, formatUsd } from "@/lib/utils";
import { getCategory, getProduct, type Product } from "@/lib/products";
import { SITE, WHATSAPP_BASE } from "@/lib/site";

export const DETAIL_LEVELS = [
  {
    id: "sencillo",
    name: "Sencillo",
    blurb: "Siluetas limpias, pocos recortes y color plano.",
    multiplier: 1,
  },
  {
    id: "intermedio",
    name: "Intermedio",
    blurb: "Más capas, sombras y volumen. El más pedido.",
    multiplier: 1.55,
  },
  {
    id: "super",
    name: "Súper detallado",
    blurb: "Muchas capas, accesorios y acabado de vitrina.",
    multiplier: 2.4,
  },
] as const;

export type DetailId = (typeof DETAIL_LEVELS)[number]["id"];
export type Currency = "NIO" | "USD";

export type QuoteInput = {
  productId: string | null;
  detail: DetailId;
  quantity: number;
  eventDate: string;
  customerName: string;
  notes: string;
};

export type QuoteBreakdown = {
  product: Product;
  level: (typeof DETAIL_LEVELS)[number];
  quantity: number;
  unitNio: number;
  subtotalNio: number;
  volumeRate: number;
  volumeNio: number;
  rushRate: number;
  rushNio: number;
  totalNio: number;
  totalUsd: number;
  daysUntil: number | null;
  tooSoon: boolean;
};

export function daysUntil(isoDate: string) {
  if (!isoDate) return null;
  const event = new Date(`${isoDate}T12:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((event.getTime() - today.getTime()) / 86_400_000);
}

export function volumeRate(qty: number) {
  if (qty >= 20) return 0.15;
  if (qty >= 12) return 0.1;
  if (qty >= 6) return 0.05;
  return 0;
}

export function rushRateFor(days: number | null, leadDays: number) {
  if (days === null) return 0;
  if (days < 0) return 0;
  if (days <= 2) return 0.4;
  if (days < leadDays || days <= 6) return 0.2;
  return 0;
}

export function computeQuote(input: QuoteInput): QuoteBreakdown | null {
  const product = input.productId ? getProduct(input.productId) : undefined;
  if (!product) return null;
  const level =
    DETAIL_LEVELS.find((item) => item.id === input.detail) ?? DETAIL_LEVELS[1];
  const quantity = Math.max(product.minQty, Math.round(input.quantity) || product.minQty);
  const unitNio = Math.round(product.basePriceNio * level.multiplier);
  const subtotalNio = unitNio * quantity;
  const vol = volumeRate(quantity);
  const volumeNio = Math.round(subtotalNio * vol);
  const afterVolume = subtotalNio - volumeNio;
  const days = daysUntil(input.eventDate);
  const rush = rushRateFor(days, product.leadDays);
  const rushNio = Math.round(afterVolume * rush);
  const totalNio = afterVolume + rushNio;
  return {
    product,
    level,
    quantity,
    unitNio,
    subtotalNio,
    volumeRate: vol,
    volumeNio,
    rushRate: rush,
    rushNio,
    totalNio,
    totalUsd: totalNio / SITE.usdRate,
    daysUntil: days,
    tooSoon: days !== null && days < 1,
  };
}

export function buildWhatsAppMessage(input: QuoteInput, quote: QuoteBreakdown) {
  const category = getCategory(quote.product.category);
  const lines = [
    "Hola, Foami Mágico 🪄",
    "",
    "Quiero cotizar este pedido:",
    "",
    `👤 Cliente: ${input.customerName.trim() || "—"}`,
    `📦 Producto: ${quote.product.name}`,
    `🏷️ Categoría: ${category?.name ?? quote.product.category}`,
    `🎨 Nivel de detalle: ${quote.level.name}`,
    `🔢 Cantidad: ${quote.quantity}`,
    `📅 Fecha del evento: ${input.eventDate ? formatDateEs(input.eventDate) : "por definir"}`,
  ];

  if (input.notes.trim()) {
    lines.push(`📝 Personaje / notas: ${input.notes.trim()}`);
  }

  lines.push("", "Desglose estimado:");
  lines.push(`• Precio unitario: ${formatNio(quote.unitNio)}`);
  lines.push(`• Subtotal: ${formatNio(quote.subtotalNio)}`);
  if (quote.volumeNio > 0) {
    lines.push(
      `• Descuento por volumen (${Math.round(quote.volumeRate * 100)}%): −${formatNio(quote.volumeNio)}`,
    );
  }
  if (quote.rushNio > 0) {
    lines.push(
      `• Entrega express (${Math.round(quote.rushRate * 100)}%): +${formatNio(quote.rushNio)}`,
    );
  }
  lines.push(
    "",
    `💰 Total estimado: ${formatNio(quote.totalNio)}  (${formatUsd(quote.totalUsd)})`,
    "",
    "Quedo pendiente de confirmación y tiempo de entrega. ¡Gracias!",
  );

  return lines.join("\n");
}

export type CartLineDraft = {
  id: string;
  productId: string;
  detail: DetailId;
  quantity: number;
  notes: string;
};

export type CartTotals = {
  items: Array<QuoteBreakdown & { id: string; notes: string }>;
  totalNio: number;
  totalUsd: number;
  tooSoon: boolean;
};

export function computeCart(lines: CartLineDraft[], eventDate: string): CartTotals {
  const items = lines.flatMap((line) => {
    const quote = computeQuote({
      productId: line.productId,
      detail: line.detail,
      quantity: line.quantity,
      eventDate,
      customerName: "",
      notes: line.notes,
    });
    if (!quote) return [];
    return [{ ...quote, id: line.id, notes: line.notes }];
  });
  const totalNio = items.reduce((sum, item) => sum + item.totalNio, 0);
  return {
    items,
    totalNio,
    totalUsd: totalNio / SITE.usdRate,
    tooSoon: items.some((item) => item.tooSoon),
  };
}

export function buildCartWhatsAppMessage(input: {
  customerName: string;
  eventDate: string;
  cart: CartTotals;
}) {
  const lines = [
    "Hola, Foami Mágico 🪄",
    "",
    "Quiero cotizar este pedido:",
    "",
    `👤 Cliente: ${input.customerName.trim() || "—"}`,
    `📅 Fecha del evento: ${input.eventDate ? formatDateEs(input.eventDate) : "por definir"}`,
    "",
    `🛒 Piezas (${input.cart.items.length}):`,
  ];

  input.cart.items.forEach((item, index) => {
    const category = getCategory(item.product.category);
    lines.push(
      "",
      `${index + 1}. ${item.product.name}`,
      `   🏷️ ${category?.name ?? item.product.category}`,
      `   🎨 ${item.level.name}`,
      `   🔢 Cantidad: ${item.quantity}`,
    );
    if (item.notes.trim()) lines.push(`   📝 ${item.notes.trim()}`);
    lines.push(`   • Unitario: ${formatNio(item.unitNio)}`);
    lines.push(`   • Subtotal: ${formatNio(item.subtotalNio)}`);
    if (item.volumeNio > 0) {
      lines.push(
        `   • Volumen −${Math.round(item.volumeRate * 100)}%: −${formatNio(item.volumeNio)}`,
      );
    }
    if (item.rushNio > 0) {
      lines.push(
        `   • Express +${Math.round(item.rushRate * 100)}%: +${formatNio(item.rushNio)}`,
      );
    }
    lines.push(`   • Total: ${formatNio(item.totalNio)}`);
  });

  lines.push(
    "",
    `💰 Total estimado: ${formatNio(input.cart.totalNio)}  (${formatUsd(input.cart.totalUsd)})`,
    "",
    "Quedo pendiente de confirmación y tiempo de entrega. ¡Gracias!",
  );

  return lines.join("\n");
}

export function whatsappUrl(message: string) {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
}
