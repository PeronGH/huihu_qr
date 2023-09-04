import "std/dotenv/load.ts";
import { Hono } from "hono/mod.ts";
import { Page } from "$/htmx/page.tsx";
import { assets } from "$/routes/assets.ts";
import { QrCode } from "$/htmx/qrcode.tsx";
import { getCookie, setCookie } from "hono/middleware.ts";
import { getQrCodeContent, getToken } from "$/utils/huihu.ts";

const app = new Hono();

app.route("/assets", assets);

app.get("/", (ctx) => {
  const openId = ctx.req.query("openId") ?? getCookie(ctx, "openId");

  return ctx.html(
    <Page title="Huihu QR Code">
      <div class="container mx-auto flex flex-col items-center space-y-4 my-4">
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
            <input type="text" name="openId" id="openId" value={openId} />
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
    // expire `openId` cookie
    setCookie(ctx, "openId", "", { maxAge: 0 });
    return ctx.html(
      <p id="qrcode" class="font-semibold text-red-500">
        incorrect openId
      </p>,
    );
  }
  // set `openId` cookie
  setCookie(ctx, "openId", openId, { maxAge: 60 * 60 * 24 * 365 });

  const qrCodeContent = await getQrCodeContent(token);
  if (!qrCodeContent) {
    return ctx.html(
      <p id="qrcode" class="font-semibold text-red-500">
        failed to get QR code content
      </p>,
    );
  }

  return ctx.html(
    <QrCode id="qrcode" class="w-full max-h-screen" content={qrCodeContent} />,
  );
});

Deno.serve(app.fetch);
