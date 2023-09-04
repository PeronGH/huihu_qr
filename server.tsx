import "std/dotenv/load.ts";
import { Hono } from "hono/mod.ts";
import { Page } from "$/htmx/page.tsx";
import { assets } from "$/routes/assets.ts";

const app = new Hono();

app.route("/assets", assets);

// Your code goes here:

app.get("/", (ctx) =>
  ctx.html(
    <Page title="Index Page">
      <div class="container mx-auto p-4">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          hx-get="/load"
          hx-target="#replaceMe"
          hx-swap="innerHTML"
        >
          Load
        </button>
        <div id="replaceMe" />
      </div>
    </Page>,
  ));

app.get(
  "/load",
  (ctx) =>
    ctx.html(
      <div id="replaceMe" class="mt-4 p-2 border-4 border-indigo-500 rounded">
        Loaded at {new Date().toString()}
      </div>,
    ),
);

Deno.serve(app.fetch);
