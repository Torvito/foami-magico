import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("admin route is registered and uses the protected RPC bridge", async () => {
  const manifest = JSON.parse(await read("public/manus-routes.json"));
  assert.ok(manifest.routes.some((route) => route.path === "/admin"));
  const route = await read("src/routes/admin.tsx");
  assert.match(route, /getAdminSnapshot/);
  assert.match(route, /saveAdminProduct/);
  assert.match(route, /adjustAdminInventory/);
  assert.match(route, /archiveAdminProduct/);
});

test("inventory schema prevents negative quantities and records movement actors", async () => {
  const migration = await read("migrations/0002_admin_inventory.sql");
  const server = await read("src/lib/admin.server.ts");
  assert.match(migration, /stock_quantity integer not null default 0 check \(stock_quantity >= 0\)/);
  assert.match(migration, /resulting_quantity integer not null check \(resulting_quantity >= 0\)/);
  assert.match(migration, /actor_user_id text not null/);
  assert.match(server, /for update/); // the server adjustment locks the product row
});

test("admin authorization has no self-promotion fallback", async () => {
  const server = await read("src/lib/admin.server.ts");
  assert.match(server, /FOAMI_ADMIN_EMAILS/);
  assert.match(server, /FOAMI_ADMIN_USER_IDS/);
  assert.match(server, /role = 'ADMIN'/);
  assert.match(server, /AdminForbiddenError/);
  assert.doesNotMatch(server, /first.*user|promot.*first/i);
});
