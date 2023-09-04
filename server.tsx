import "std/dotenv/load.ts";
import { Hono } from "hono/mod.ts";
import { Page } from "$/htmx/page.tsx";
import { assets } from "$/routes/assets.ts";
import { QrCode } from "$/htmx/qrcode.tsx";
import { getQrCodeContent, getToken } from "$/utils/huihu.ts";

const app = new Hono();

app.route("/assets", assets);

app.get("/", (ctx) => {
  const openId = ctx.req.query("openId");

  return ctx.html(
    <Page title="Huihu QR Code">
      <div class="w-full flex flex-col items-center space-y-4">
        <div id="qrcode" />
        <form
          hx-get="/qrcode"
          hx-target="#qrcode"
          hx-swap="outerHTML"
          hx-trigger="load, every 5s"
          class="gap-2 flex flex-col items-center"
        >
          <div class="space-x-2">
            <label for="openId">openId:</label>
            <input
              type="text"
              name="openId"
              id="openId"
              value={openId}
              required
            />
          </div>
        </form>
      </div>
    </Page>,
  );
});

app.get("/qrcode", async (ctx) => {
  const openId = ctx.req.query("openId");

  if (!openId) {
    return ctx.html(
      <p id="qrcode" class="font-semibold text-red-500">
        openId is missing
      </p>,
    );
  }

  const token = await getToken(openId);
  if (!token) {
    return ctx.html(
      <p id="qrcode" class="font-semibold text-red-500">
        incorrect openId
      </p>,
    );
  }

  const qrCodeContent = await getQrCodeContent(token);
  if (!qrCodeContent) {
    return ctx.html(
      <p id="qrcode" class="font-semibold text-red-500">
        failed to get QR code content
      </p>,
    );
  }

  return ctx.html(
    <QrCode
      id="qrcode"
      class="w-full max-h-screen p-8"
      content={qrCodeContent}
    />,
    { headers: { "HX-Push": `?openId=${openId}` } },
  );
});

Deno.serve(app.fetch);
