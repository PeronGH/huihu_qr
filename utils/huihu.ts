export async function getToken(openId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.215123.cn/web-app/auth/certificateLogin?openId=${openId}`,
    );

    const { success, data } = await res.json();
    if (!success) return null;

    return data.token;
  } catch {
    return null;
  }
}

export async function getQrCodeContent(
  satoken: string,
): Promise<string | null> {
  try {
    const res = await fetch(
      "https://api.215123.cn/pms/welcome/make-code-info ",
      { headers: { satoken } },
    );

    const { success, data } = await res.json();
    if (!success) return null;

    return data.qrCode;
  } catch {
    return null;
  }
}
