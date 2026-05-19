export interface Env {
  STATS_KV: KVNamespace;
}

export const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
} as const;

export function json(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { ...JSON_HEADERS, ...(init.headers ?? {}) },
  });
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "0.0.0.0"
  );
}

export async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function readCount(kv: KVNamespace, key: string): Promise<number> {
  const raw = await kv.get(key);
  if (!raw) return 0;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : 0;
}

export async function incrementCount(kv: KVNamespace, key: string): Promise<number> {
  const next = (await readCount(kv, key)) + 1;
  await kv.put(key, String(next));
  return next;
}

export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}
