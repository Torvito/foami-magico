import { getSql } from "@/lib/db";
import type { Product } from "@/lib/products";

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    slug: String(row.slug),
    name: String(row.name),
    category: String(row.category_id) as Product["category"],
    tagline: String(row.tagline),
    description: String(row.description),
    includes: Array.isArray(row.includes) ? row.includes.map(String) : [],
    basePriceNio: Number(row.base_price_nio),
    leadDays: Number(row.lead_days),
    minQty: Number(row.min_qty),
    image: String(row.image),
    featured: Boolean(row.featured),
  };
}

export async function getPublicProductsServer(): Promise<Product[]> {
  const sql = await getSql();
  const rows = await sql.query<Record<string, unknown>>(
    "select slug, name, category_id, tagline, description, includes, base_price_nio, lead_days, min_qty, image, featured from products where archived = false and publication_status = 'PUBLISHED' and availability_status = 'AVAILABLE' order by featured desc, name asc",
  );
  return rows.map(rowToProduct);
}

export async function getPublicProductServer(slug: string): Promise<Product | null> {
  const sql = await getSql();
  const rows = await sql.query<Record<string, unknown>>(
    "select slug, name, category_id, tagline, description, includes, base_price_nio, lead_days, min_qty, image, featured from products where slug = $1 and archived = false and publication_status = 'PUBLISHED' and availability_status = 'AVAILABLE' limit 1",
    [slug],
  );
  return rows[0] ? rowToProduct(rows[0]) : null;
}
