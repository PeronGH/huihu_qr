import { Hono } from "hono/mod.ts";
import { lazy } from "$/utils/lazy.ts";

const tailwindcssScript = lazy(() =>
  fetch("https://cdn.tailwindcss.com/3.3.3")
);
const htmxScript = lazy(() =>
  fetch("https://unpkg.com/htmx.org@1.9.5/dist/htmx.min.js")
);

export const assets = new Hono();

assets.get(
  "/tailwindcss",
  () => tailwindcssScript().then((res) => res.clone()),
);
assets.get("/htmx", () => htmxScript().then((res) => res.clone()));
