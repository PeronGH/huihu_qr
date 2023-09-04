import { QRCode, QRSvg } from "sexy-qr";

export interface QrCodeProps extends Record<string, unknown> {
  content: string;
  size?: number;
}

export function QrCode({ content, size, ...props }: QrCodeProps) {
  const qrcode = new QRCode({ content });
  const { svg } = new QRSvg(qrcode, {
    size: size ?? qrcode.size,
    roundInnerCorners: false,
    roundOuterCorners: false,
  });
  return <img {...props} src={`data:image/svg+xml;base64,${btoa(svg)}`} />;
}
