import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, productsByCategory, type CategoryId } from "@/lib/products";
import { cn } from "@/lib/utils";

type CatalogSearch = { cat?: CategoryId };

function parseSearch(s: Record<string, unknown>): CatalogSearch {
  const cat = typeof s.cat === "string" ? s.cat : undefined;
  if (cat && CATEGORIES.some((c) => c.id === cat)) return { cat: cat as CategoryId };
  return {};
}

export const Route = createFileRoute("/catalogo")({
  validateSearch: parseSearch,
  component: Catalogo,
});

function Catalogo() {
  const { cat } = Route.useSearch();
  const items = productsByCategory(cat);
  const current = CATEGORIES.find((c) => c.id === cat);

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-fucsia">Catálogo</p>
      <h1 className="mt-1 text-3xl font-semibold">{current ? current.name : "Todas las piezas"}</h1>
      <p className="mt-2 max-w-2xl text-muted">
        {current
          ? current.blurb
          : "Máscaras, fiestas, colegios y encargos a medida. El precio que ves es el nivel sencillo; el cotizador ajusta detalle y cantidad."}
      </p>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        <Chip to="/catalogo" search={{}} active={!cat}>
          Todas
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.id} to="/catalogo" search={{ cat: c.id }} active={cat === c.id}>
            {c.name}
          </Chip>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}

function Chip({
  children,
  to,
  search,
  active,
}: {
  children: React.ReactNode;
  to: "/catalogo";
  search: CatalogSearch;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      search={search}
      className={cn(
        "shrink-0 rounded-full px-4 py-2 text-sm font-semibold shadow-foam transition-colors duration-150",
        active ? "bg-fucsia text-white" : "bg-card text-ink hover:bg-blush-deep",
      )}
    >
      {children}
    </Link>
  );
}
