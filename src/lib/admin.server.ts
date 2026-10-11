import { z } from "zod";
import { getSql } from "@/lib/db";
import type { Product } from "@/lib/products";

export type InventoryMode = "STOCK_TRACKED" | "MADE_TO_ORDER" | "NOT_TRACKED";
export type PublicationStatus = "PUBLISHED" | "DRAFT";
export type AvailabilityStatus = "AVAILABLE" | "UNAVAILABLE";

export type AdminProduct = Product & {
  sku: string | null;
  publicationStatus: PublicationStatus;
  availabilityStatus: AvailabilityStatus;
  inventoryMode: InventoryMode;
  stockQuantity: number;
  minimumStock: number;
  archived: boolean;
  updatedAt: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  blurb: string;
  tint: "fucsia" | "naranja" | "cielo" | "lima";
};

export type AdminSnapshot = {
  products: AdminProduct[];
  categories: AdminCategory[];
  stats: {
    published: number;
    drafts: number;
    lowStock: number;
    outOfStock: number;
    unavailable: number;
  };
  recentMovements: Array<{
    productSlug: string;
    productName: string;
    quantityDelta: number;
    resultingQuantity: number;
    reason: string;
    createdAt: string;
  }>;
};

export class AdminForbiddenError extends Error {
  readonly status = 403;
  constructor() {
    super("Administrator access required");
    this.name = "AdminForbiddenError";
  }
}

const productInput = z.object({
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(2).max(120),
  categoryId: z.enum(["mascaras", "fiestas", "colegios", "personalizados"]),
  tagline: z.string().trim().min(2).max(180),
  description: z.string().trim().min(2).max(2000),
  includes: z.array(z.string().trim().min(1).max(120)).min(1).max(12),
  basePriceNio: z.number().int().nonnegative().max(10_000_000),
  leadDays: z.number().int().nonnegative().max(365),
  minQty: z.number().int().positive().max(100_000),
  image: z.string().trim().min(1).max(500),
  featured: z.boolean(),
  sku: z.string().trim().max(80).nullable(),
  publicationStatus: z.enum(["PUBLISHED", "DRAFT"]),
  availabilityStatus: z.enum(["AVAILABLE", "UNAVAILABLE"]),
  inventoryMode: z.enum(["STOCK_TRACKED", "MADE_TO_ORDER", "NOT_TRACKED"]),
  stockQuantity: z.number().int().nonnegative().max(10_000_000),
  minimumStock: z.number().int().nonnegative().max(10_000_000),
});

function adminUserIds(): Set<string> {
  return new Set(
    (process.env.FOAMI_ADMIN_USER_IDS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function adminEmails(): Set<string> {
  return new Set(
    (process.env.FOAMI_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

async function requireAdmin(userId: string, userEmail?: string | null): Promise<{ userId: string }> {
  if (!userId) throw new AdminForbiddenError();
  if (adminUserIds().has(userId.toLowerCase())) return { userId };
  if (userEmail && adminEmails().has(userEmail.toLowerCase())) return { userId };
  const sql = await getSql();
  const rows = await sql.query<{ user_id: string }>(
    "select user_id from admin_users where user_id = $1 and role = 'ADMIN' limit 1",
    [userId],
  );
  if (!rows[0]) throw new AdminForbiddenError();
  return { userId };
}

function mapProduct(row: Record<string, unknown>): AdminProduct {
  const includes = Array.isArray(row.includes) ? row.includes.map(String) : [];
  return {
    slug: String(row.slug),
    name: String(row.name),
    category: String(row.category_id) as Product["category"],
    tagline: String(row.tagline),
    description: String(row.description),
    includes,
    basePriceNio: Number(row.base_price_nio),
    leadDays: Number(row.lead_days),
    minQty: Number(row.min_qty),
    image: String(row.image),
    featured: Boolean(row.featured),
    sku: row.sku ? String(row.sku) : null,
    publicationStatus: String(row.publication_status) as PublicationStatus,
    availabilityStatus: String(row.availability_status) as AvailabilityStatus,
    inventoryMode: String(row.inventory_mode) as InventoryMode,
    stockQuantity: Number(row.stock_quantity),
    minimumStock: Number(row.minimum_stock),
    archived: Boolean(row.archived),
    updatedAt: String(row.updated_at),
  };
}

async function readSnapshot(): Promise<AdminSnapshot> {
  const sql = await getSql();
  const [products, categories, counts, movements] = await Promise.all([
    sql.query<Record<string, unknown>>(
      "select * from products where archived = false order by updated_at desc, name asc",
    ),
    sql.query<AdminCategory>("select id, name, blurb, tint from product_categories where archived = false order by name"),
    sql.query<{ published: number; drafts: number; low_stock: number; out_of_stock: number; unavailable: number }>(
      `select
        count(*) filter (where publication_status = 'PUBLISHED')::int as published,
        count(*) filter (where publication_status = 'DRAFT')::int as drafts,
        count(*) filter (where inventory_mode = 'STOCK_TRACKED' and stock_quantity > 0 and stock_quantity <= minimum_stock)::int as low_stock,
        count(*) filter (where inventory_mode = 'STOCK_TRACKED' and stock_quantity = 0)::int as out_of_stock,
        count(*) filter (where availability_status = 'UNAVAILABLE')::int as unavailable
       from products where archived = false`,
    ),
    sql.query<Record<string, unknown>>(
      `select m.product_slug, p.name as product_name, m.quantity_delta, m.resulting_quantity, m.reason, m.created_at
       from inventory_movements m join products p on p.slug = m.product_slug
       order by m.created_at desc limit 8`,
    ),
  ]);
  const totals = counts[0] ?? { published: 0, drafts: 0, low_stock: 0, out_of_stock: 0, unavailable: 0 };
  return {
    products: products.map(mapProduct),
    categories,
    stats: {
      published: Number(totals.published),
      drafts: Number(totals.drafts),
      lowStock: Number(totals.low_stock),
      outOfStock: Number(totals.out_of_stock),
      unavailable: Number(totals.unavailable),
    },
    recentMovements: movements.map((row) => ({
      productSlug: String(row.product_slug),
      productName: String(row.product_name),
      quantityDelta: Number(row.quantity_delta),
      resultingQuantity: Number(row.resulting_quantity),
      reason: String(row.reason),
      createdAt: String(row.created_at),
    })),
  };
}

export async function getAdminSnapshotServer(userId: string, userEmail?: string | null): Promise<AdminSnapshot> {
  await requireAdmin(userId, userEmail);
  return readSnapshot();
}

export async function saveAdminProductServer(userId: string, userEmail: string | null | undefined, data: unknown) {
  const { userId: actor } = await requireAdmin(userId, userEmail);
  const input = productInput.parse(data);
  const sql = await getSql();
  await sql.query(
    `insert into products (slug, name, category_id, tagline, description, includes, base_price_nio, lead_days, min_qty, image, featured, sku, publication_status, availability_status, inventory_mode, stock_quantity, minimum_stock, updated_at)
     values ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,now())
     on conflict (slug) do update set name=excluded.name, category_id=excluded.category_id, tagline=excluded.tagline, description=excluded.description, includes=excluded.includes, base_price_nio=excluded.base_price_nio, lead_days=excluded.lead_days, min_qty=excluded.min_qty, image=excluded.image, featured=excluded.featured, sku=excluded.sku, publication_status=excluded.publication_status, availability_status=excluded.availability_status, inventory_mode=excluded.inventory_mode, stock_quantity=excluded.stock_quantity, minimum_stock=excluded.minimum_stock, updated_at=now()`,
    [input.slug, input.name, input.categoryId, input.tagline, input.description, JSON.stringify(input.includes), input.basePriceNio, input.leadDays, input.minQty, input.image, input.featured, input.sku || null, input.publicationStatus, input.availabilityStatus, input.inventoryMode, input.stockQuantity, input.minimumStock],
  );
  return { ok: true, actor };
}

export async function archiveAdminProductServer(userId: string, userEmail: string | null | undefined, data: unknown) {
  await requireAdmin(userId, userEmail);
  const { slug } = z.object({ slug: z.string().min(2) }).parse(data);
  const sql = await getSql();
  await sql.query("update products set archived = true, publication_status = 'DRAFT', updated_at = now() where slug = $1", [slug]);
  return { ok: true };
}

export async function adjustAdminInventoryServer(userId: string, userEmail: string | null | undefined, data: unknown) {
  const { userId: actor } = await requireAdmin(userId, userEmail);
  const input = z.object({ slug: z.string().min(2), delta: z.number().int().min(-10_000_000).max(10_000_000), reason: z.string().trim().min(3).max(300) }).parse(data);
  const sql = await getSql();
  await sql.query("begin");
  try {
    const rows = await sql.query<{ stock_quantity: number; inventory_mode: InventoryMode }>("select stock_quantity, inventory_mode from products where slug = $1 and archived = false for update", [input.slug]);
    const product = rows[0];
    if (!product) throw new Error("Product not found");
    if (product.inventory_mode !== "STOCK_TRACKED") throw new Error("Only stock-tracked products accept inventory adjustments");
    const previous = Number(product.stock_quantity);
    const resulting = previous + input.delta;
    if (resulting < 0) throw new Error("Inventory cannot become negative");
    await sql.query("update products set stock_quantity = $1, updated_at = now() where slug = $2", [resulting, input.slug]);
    await sql.query("insert into inventory_movements (id, product_slug, quantity_delta, previous_quantity, resulting_quantity, reason, actor_user_id) values ($1,$2,$3,$4,$5,$6,$7)", [crypto.randomUUID(), input.slug, input.delta, previous, resulting, input.reason, actor]);
    await sql.query("commit");
    return { ok: true, resultingQuantity: resulting };
  } catch (error) {
    await sql.query("rollback");
    throw error;
  }
}
