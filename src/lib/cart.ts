import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getProduct } from "@/lib/products";
import type { CartLineDraft, Currency, DetailId } from "@/lib/quote";

export type NewCartLine = {
  productId: string;
  detail: DetailId;
  quantity: number;
  notes: string;
};

type CartState = {
  lines: CartLineDraft[];
  customerName: string;
  eventDate: string;
  currency: Currency;
  addLine: (line: NewCartLine) => void;
  updateQty: (id: string, quantity: number) => void;
  updateDetail: (id: string, detail: DetailId) => void;
  updateNotes: (id: string, notes: string) => void;
  removeLine: (id: string) => void;
  setCustomerName: (name: string) => void;
  setEventDate: (date: string) => void;
  setCurrency: (currency: Currency) => void;
  clear: () => void;
};

function samePiece(a: { productId: string; detail: DetailId; notes: string }, b: NewCartLine) {
  return a.productId === b.productId && a.detail === b.detail && a.notes === b.notes.trim();
}

function clampQty(productId: string, quantity: number) {
  const min = getProduct(productId)?.minQty ?? 1;
  return Math.max(min, Math.round(quantity) || min);
}

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      customerName: "",
      eventDate: "",
      currency: "NIO",
      addLine: (line) =>
        set((state) => {
          const notes = line.notes.trim();
          const quantity = clampQty(line.productId, line.quantity);
          const existing = state.lines.find((item) => samePiece(item, { ...line, notes }));
          if (existing) {
            return {
              lines: state.lines.map((item) =>
                item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              { id: newId(), productId: line.productId, detail: line.detail, quantity, notes },
            ],
          };
        }),
      updateQty: (id, quantity) =>
        set((state) => ({
          lines: state.lines.map((item) =>
            item.id === id ? { ...item, quantity: clampQty(item.productId, quantity) } : item,
          ),
        })),
      updateDetail: (id, detail) =>
        set((state) => {
          const current = state.lines.find((item) => item.id === id);
          if (!current || current.detail === detail) return state;
          const twin = state.lines.find(
            (item) => item.id !== id && samePiece(item, { ...current, detail }),
          );
          if (!twin) {
            return { lines: state.lines.map((item) => (item.id === id ? { ...item, detail } : item)) };
          }
          return {
            lines: state.lines
              .filter((item) => item.id !== id)
              .map((item) =>
                item.id === twin.id ? { ...item, quantity: item.quantity + current.quantity } : item,
              ),
          };
        }),
      updateNotes: (id, notes) =>
        set((state) => ({
          lines: state.lines.map((item) => (item.id === id ? { ...item, notes } : item)),
        })),
      removeLine: (id) => set((state) => ({ lines: state.lines.filter((item) => item.id !== id) })),
      setCustomerName: (customerName) => set({ customerName }),
      setEventDate: (eventDate) => set({ eventDate }),
      setCurrency: (currency) => set({ currency }),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "foami-magico-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

if (typeof window !== "undefined") {
  void useCart.persist.rehydrate();
}
