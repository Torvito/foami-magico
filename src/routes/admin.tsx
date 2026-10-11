import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Archive, BarChart3, Check, Package, Pencil, Plus, Save, Search, ShieldCheck, Warehouse } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  adjustAdminInventory,
  archiveAdminProduct,
  getAdminSnapshot,
  saveAdminProduct,
  type AdminProduct,
  type AdminSnapshot,
  type InventoryMode,
} from "@/lib/admin";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  loader: () => getAdminSnapshot(),
  head: () => ({ meta: [{ title: "Administración · Foami Mágico" }] }),
  component: AdminPage,
});

type FormState = Omit<AdminProduct, "category" | "updatedAt" | "archived"> & { categoryId: string; includesText: string };

function formFromProduct(product: AdminProduct): FormState {
  return { ...product, categoryId: product.category, includesText: product.includes.join("\n") };
}

function blankForm(snapshot: AdminSnapshot): FormState {
  return {
    slug: "",
    name: "",
    categoryId: snapshot.categories[0]?.id ?? "mascaras",
    tagline: "",
    description: "",
    includes: [],
    includesText: "",
    basePriceNio: 0,
    leadDays: 1,
    minQty: 1,
    image: "/images/pedido-personalizado.jpg",
    featured: false,
    sku: null,
    publicationStatus: "DRAFT",
    availabilityStatus: "AVAILABLE",
    inventoryMode: "MADE_TO_ORDER",
    stockQuantity: 0,
    minimumStock: 0,
  };
}

function AdminPage() {
  const snapshot = Route.useLoaderData();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(snapshot.products[0]?.slug ?? null);
  const [form, setForm] = useState<FormState | null>(() => snapshot.products[0] ? formFromProduct(snapshot.products[0]) : blankForm(snapshot));
  const [adjustment, setAdjustment] = useState({ delta: "", reason: "" });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return snapshot.products;
    return snapshot.products.filter((product) => `${product.name} ${product.slug} ${product.sku ?? ""}`.toLowerCase().includes(normalized));
  }, [query, snapshot.products]);

  function selectProduct(product: AdminProduct) {
    setSelectedSlug(product.slug);
    setForm(formFromProduct(product));
    setAdjustment({ delta: "", reason: "" });
  }

  function createProduct() {
    setSelectedSlug(null);
    setForm(blankForm(snapshot));
    setAdjustment({ delta: "", reason: "" });
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => current ? { ...current, [key]: value } : current);
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    try {
      await saveAdminProduct({ data: {
        ...form,
        includes: form.includesText.split("\n").map((item) => item.trim()).filter(Boolean),
        featured: Boolean(form.featured),
        categoryId: form.categoryId as "mascaras" | "fiestas" | "colegios" | "personalizados",
        sku: form.sku?.trim() || null,
      } });
      toast.success("Producto guardado. El cambio queda persistido en la base de datos.");
      await router.invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el producto.");
    } finally {
      setSaving(false);
    }
  }

  async function archive() {
    if (!selectedSlug || !window.confirm("¿Archivar esta pieza? Dejará de aparecer en el catálogo público.")) return;
    try {
      await archiveAdminProduct({ data: { slug: selectedSlug } });
      toast.success("Producto archivado.");
      await router.invalidate();
      createProduct();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo archivar el producto.");
    }
  }

  async function adjustStock() {
    if (!selectedSlug || !form || form.inventoryMode !== "STOCK_TRACKED") return;
    const delta = Number(adjustment.delta);
    if (!Number.isInteger(delta) || delta === 0 || !adjustment.reason.trim()) {
      toast.error("Indica una cantidad distinta de cero y el motivo del ajuste.");
      return;
    }
    try {
      const result = await adjustAdminInventory({ data: { slug: selectedSlug, delta, reason: adjustment.reason } });
      toast.success(`Inventario actualizado a ${result.resultingQuantity} unidades.`);
      setAdjustment({ delta: "", reason: "" });
      await router.invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo ajustar el inventario.");
    }
  }

  return (
    <div className="space-y-7 pb-8">
      <header className="rounded-[32px] bg-ink px-5 py-7 text-white shadow-foam sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white/80"><ShieldCheck className="size-4 text-amarillo" /> Área protegida</div>
            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Administración del taller</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">Actualiza piezas, disponibilidad y existencias sin editar el código. Cada ajuste de inventario queda registrado.</p>
          </div>
          <Button type="button" variant="secondary" onClick={createProduct}><Plus className="size-4" /> Nueva pieza</Button>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Resumen operativo">
        <Metric icon={Package} label="Publicados" value={snapshot.stats.published} tone="fucsia" />
        <Metric icon={Pencil} label="Borradores" value={snapshot.stats.drafts} tone="cielo" />
        <Metric icon={BarChart3} label="Stock bajo" value={snapshot.stats.lowStock} tone="naranja" />
        <Metric icon={Warehouse} label="Agotados" value={snapshot.stats.outOfStock} tone="fucsia" />
        <Metric icon={ShieldCheck} label="No disponibles" value={snapshot.stats.unavailable} tone="lima" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <section className="rounded-[28px] bg-card p-4 shadow-foam sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-fucsia">Catálogo</p><h2 className="mt-1 text-xl font-semibold">Piezas administrables</h2></div>
            <span className="rounded-full bg-blush px-2.5 py-1 text-xs font-bold text-muted">{snapshot.products.length}</span>
          </div>
          <label className="relative mt-4 block"><span className="sr-only">Buscar productos</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, slug o SKU" className="pl-9" /></label>
          <div className="mt-4 space-y-2" role="list">
            {filtered.map((product) => (
              <button key={product.slug} type="button" onClick={() => selectProduct(product)} className={cn("w-full rounded-2xl p-3 text-left transition hover:-translate-y-0.5 hover:shadow-foam-hover", selectedSlug === product.slug ? "bg-fucsia text-white shadow-foam" : "bg-blush text-ink")}>
                <div className="flex items-start justify-between gap-3"><span className="font-semibold leading-tight">{product.name}</span><StatusPill value={product.publicationStatus === "PUBLISHED" ? "Publicado" : "Borrador"} active={selectedSlug === product.slug} /></div>
                <div className={cn("mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs", selectedSlug === product.slug ? "text-white/75" : "text-muted")}><span>{product.slug}</span><span>{product.basePriceNio} C$</span>{product.inventoryMode === "STOCK_TRACKED" ? <span>{product.stockQuantity} en stock</span> : <span>A pedido</span>}</div>
              </button>
            ))}
            {!filtered.length ? <p className="rounded-2xl bg-blush p-4 text-sm text-muted">No hay productos para esa búsqueda.</p> : null}
          </div>
        </section>

        {form ? <ProductEditor form={form} categories={snapshot.categories} update={update} saving={saving} onSave={save} onArchive={archive} adjustment={adjustment} setAdjustment={setAdjustment} onAdjust={adjustStock} isNew={!selectedSlug} /> : null}
      </div>

      <section className="rounded-[28px] bg-card p-4 shadow-foam sm:p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-fucsia">Trazabilidad</p><h2 className="mt-1 text-xl font-semibold">Últimos movimientos</h2></div><span className="text-xs font-semibold text-muted">Solo lectura</span></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="text-xs uppercase tracking-[0.12em] text-muted"><tr><th className="pb-2">Pieza</th><th className="pb-2">Cambio</th><th className="pb-2">Resultado</th><th className="pb-2">Motivo</th><th className="pb-2">Fecha</th></tr></thead><tbody>{snapshot.recentMovements.map((movement) => <tr key={`${movement.productSlug}-${movement.createdAt}`} className="border-t border-border/60"><td className="py-3 font-semibold">{movement.productName}</td><td className={cn("py-3 font-bold", movement.quantityDelta > 0 ? "text-lima" : "text-fucsia")}>{movement.quantityDelta > 0 ? "+" : ""}{movement.quantityDelta}</td><td className="py-3">{movement.resultingQuantity}</td><td className="py-3 text-muted">{movement.reason}</td><td className="py-3 text-muted">{new Date(movement.createdAt).toLocaleDateString("es-NI")}</td></tr>)}</tbody></table>{!snapshot.recentMovements.length ? <p className="py-5 text-sm text-muted">Todavía no hay ajustes registrados.</p> : null}</div></section>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone }: { icon: typeof Package; label: string; value: number; tone: "fucsia" | "cielo" | "naranja" | "lima" }) {
  return <div className="rounded-[24px] bg-card p-4 shadow-foam"><Icon className={`size-5 text-${tone}`} /><p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</p><p className="mt-1 font-display text-3xl font-semibold">{value}</p></div>;
}

function StatusPill({ value, active }: { value: string; active: boolean }) { return <span className={cn("rounded-full px-2 py-1 text-[10px] font-bold", active ? "bg-white/15 text-white" : "bg-card text-muted")}>{value}</span>; }

function ProductEditor({ form, categories, update, saving, onSave, onArchive, adjustment, setAdjustment, onAdjust, isNew }: { form: FormState; categories: AdminSnapshot["categories"]; update: <K extends keyof FormState>(key: K, value: FormState[K]) => void; saving: boolean; onSave: () => void; onArchive: () => void; adjustment: { delta: string; reason: string }; setAdjustment: (value: { delta: string; reason: string }) => void; onAdjust: () => void; isNew: boolean }) {
  return <section className="rounded-[28px] bg-card p-4 shadow-foam sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-fucsia">Editor</p><h2 className="mt-1 text-xl font-semibold">{isNew ? "Nueva pieza" : "Editar pieza"}</h2></div>{!isNew ? <Button type="button" variant="ghost" onClick={onArchive}><Archive className="size-4" /> Archivar</Button> : null}</div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Nombre"><Input value={form.name} onChange={(e) => update("name", e.target.value)} /></Field><Field label="Slug"><Input value={form.slug} onChange={(e) => update("slug", e.target.value)} disabled={!isNew} /></Field><Field label="Categoría"><select value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="h-11 w-full rounded-2xl bg-blush px-3 text-sm font-semibold text-ink ring-1 ring-border">{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></Field><Field label="SKU"><Input value={form.sku ?? ""} onChange={(e) => update("sku", e.target.value || null)} /></Field><Field label="Precio base (C$)"><Input type="number" min="0" value={form.basePriceNio} onChange={(e) => update("basePriceNio", Number(e.target.value))} /></Field><Field label="Días de producción"><Input type="number" min="0" value={form.leadDays} onChange={(e) => update("leadDays", Number(e.target.value))} /></Field><Field label="Cantidad mínima"><Input type="number" min="1" value={form.minQty} onChange={(e) => update("minQty", Number(e.target.value))} /></Field><Field label="Imagen pública"><Input value={form.image} onChange={(e) => update("image", e.target.value)} /></Field></div><Field label="Tagline" className="mt-4"><Input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} /></Field><Field label="Descripción" className="mt-4"><Textarea value={form.description} onChange={(e) => update("description", e.target.value)} /></Field><Field label="Incluye (una línea por elemento)" className="mt-4"><Textarea value={form.includesText} onChange={(e) => update("includesText", e.target.value)} /></Field><div className="mt-4 grid gap-4 sm:grid-cols-3"><Field label="Publicación"><select value={form.publicationStatus} onChange={(e) => update("publicationStatus", e.target.value as FormState["publicationStatus"])} className="h-11 w-full rounded-2xl bg-blush px-3 text-sm font-semibold ring-1 ring-border"><option value="PUBLISHED">Publicado</option><option value="DRAFT">Borrador</option></select></Field><Field label="Disponibilidad"><select value={form.availabilityStatus} onChange={(e) => update("availabilityStatus", e.target.value as FormState["availabilityStatus"])} className="h-11 w-full rounded-2xl bg-blush px-3 text-sm font-semibold ring-1 ring-border"><option value="AVAILABLE">Disponible</option><option value="UNAVAILABLE">No disponible</option></select></Field><Field label="Inventario"><select value={form.inventoryMode} onChange={(e) => update("inventoryMode", e.target.value as InventoryMode)} className="h-11 w-full rounded-2xl bg-blush px-3 text-sm font-semibold ring-1 ring-border"><option value="MADE_TO_ORDER">Hecho a pedido</option><option value="STOCK_TRACKED">Controlar stock</option><option value="NOT_TRACKED">No controlar</option></select></Field></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Existencias"><Input type="number" min="0" value={form.stockQuantity} onChange={(e) => update("stockQuantity", Number(e.target.value))} disabled={form.inventoryMode !== "STOCK_TRACKED"} /></Field><Field label="Umbral de stock bajo"><Input type="number" min="0" value={form.minimumStock} onChange={(e) => update("minimumStock", Number(e.target.value))} disabled={form.inventoryMode !== "STOCK_TRACKED"} /></Field></div><label className="mt-4 flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="size-4 accent-fucsia" /> Mostrar como favorita</label><div className="mt-5 flex flex-wrap gap-2"><Button type="button" onClick={onSave} disabled={saving}><Save className="size-4" /> {saving ? "Guardando…" : "Guardar pieza"}</Button>{form.inventoryMode === "STOCK_TRACKED" && !isNew ? <div className="flex flex-wrap gap-2 rounded-2xl bg-blush p-2"><Input aria-label="Cambio de inventario" placeholder="+/- unidades" value={adjustment.delta} onChange={(e) => setAdjustment({ ...adjustment, delta: e.target.value })} className="w-32" /><Input aria-label="Motivo del ajuste" placeholder="Motivo" value={adjustment.reason} onChange={(e) => setAdjustment({ ...adjustment, reason: e.target.value })} className="w-40" /><Button type="button" variant="secondary" onClick={onAdjust}><Check className="size-4" /> Ajustar stock</Button></div> : null}</div></section>;
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) { return <div className={className}><Label>{label}</Label><div className="mt-1.5">{children}</div></div>; }
