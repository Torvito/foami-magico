import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
export type { AdminCategory, AdminProduct, AdminSnapshot, InventoryMode } from "./admin.server";

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

const archiveInput = z.object({ slug: z.string().min(2) });
const adjustmentInput = z.object({
  slug: z.string().min(2),
  delta: z.number().int().min(-10_000_000).max(10_000_000),
  reason: z.string().trim().min(3).max(300),
});

export const getAdminSnapshot = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { getAdminSnapshotServer } = await import("./admin.server");
    return getAdminSnapshotServer(context.userId, context.userEmail);
  });

export const saveAdminProduct = createServerFn({ method: "POST" })
  .validator(productInput)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { saveAdminProductServer } = await import("./admin.server");
    return saveAdminProductServer(context.userId, context.userEmail, data);
  });

export const archiveAdminProduct = createServerFn({ method: "POST" })
  .validator(archiveInput)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { archiveAdminProductServer } = await import("./admin.server");
    return archiveAdminProductServer(context.userId, context.userEmail, data);
  });

export const adjustAdminInventory = createServerFn({ method: "POST" })
  .validator(adjustmentInput)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { adjustAdminInventoryServer } = await import("./admin.server");
    return adjustAdminInventoryServer(context.userId, context.userEmail, data);
  });
