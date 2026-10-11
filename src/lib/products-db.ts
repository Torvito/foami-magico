import { createServerFn } from "@tanstack/react-start";

export const getPublicCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicProductsServer } = await import("./products-db.server");
  return getPublicProductsServer();
});

export const getPublicProduct = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { getPublicProductServer } = await import("./products-db.server");
    return getPublicProductServer(data.slug);
  });
