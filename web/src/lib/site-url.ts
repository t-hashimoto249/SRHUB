/**
 * 本番では `NEXT_PUBLIC_SITE_URL`（末尾スラッシュなし推奨）を設定してください。
 * Vercel では未設定時 `VERCEL_URL` が使われます。
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    return `https://${host}`;
  }

  return "http://localhost:3000";
}
