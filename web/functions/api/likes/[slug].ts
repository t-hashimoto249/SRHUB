import {
  type Env,
  clientIp,
  incrementCount,
  json,
  readCount,
  sha256,
  todayUtc,
} from "../../_shared";

const LIKE_TTL_SECONDS = 60 * 60 * 24;
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,127}$/i;

function likeKey(slug: string) {
  return `likes:${slug}`;
}

function ipKey(ipHash: string, slug: string, date: string) {
  return `like-ip:${ipHash}:${slug}:${date}`;
}

function readSlug(params: Record<string, string | string[]>): string | null {
  const raw = params.slug;
  const slug = Array.isArray(raw) ? raw[0] : raw;
  if (!slug || !SLUG_RE.test(slug)) return null;
  return slug;
}

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const slug = readSlug(params);
  if (!slug) return json({ error: "invalid slug" }, { status: 400 });

  const total = await readCount(env.STATS_KV, likeKey(slug));
  return json({ slug, total });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => {
  const slug = readSlug(params);
  if (!slug) return json({ error: "invalid slug" }, { status: 400 });

  const ipHash = await sha256(clientIp(request));
  const guardKey = ipKey(ipHash, slug, todayUtc());

  const seen = await env.STATS_KV.get(guardKey);
  if (seen) {
    const total = await readCount(env.STATS_KV, likeKey(slug));
    return json({ slug, total, liked: false }, { status: 200 });
  }

  await env.STATS_KV.put(guardKey, "1", { expirationTtl: LIKE_TTL_SECONDS });
  const total = await incrementCount(env.STATS_KV, likeKey(slug));
  return json({ slug, total, liked: true });
};
