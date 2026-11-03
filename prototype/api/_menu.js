// Reads the same menu.js the page uses, so the server always charges the prices shown on the site.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

let cache = null;
export function priceList() {
  if (cache) return cache;
  const src = readFileSync(join(process.cwd(), "menu.js"), "utf8");
  const ctx = {};
  vm.runInNewContext(src, ctx);
  cache = {};
  for (const cat of ctx.MENU) for (const [name, kr, price] of cat.items) if (typeof price === "number") cache[name] = { kr, price };
  return cache;
}
