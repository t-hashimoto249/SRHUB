import {
  type Env,
  clientIp,
  incrementCount,
  json,
  readCount,
  sha256,
} from "../_shared";

const COUNTER_KEY = "visits:total";
const IP_TTL_SECONDS = 60 * 60;

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const total = await readCount(env.STATS_KV, COUNTER_KEY);
  return json({ total });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const ipHash = await sha256(clientIp(request));
  const ipKey = `visit-ip:${ipHash}`;

  const seen = await env.STATS_KV.get(ipKey);
  if (seen) {
    const total = await readCount(env.STATS_KV, COUNTER_KEY);
    return json({ total, counted: false });
  }

  await env.STATS_KV.put(ipKey, "1", { expirationTtl: IP_TTL_SECONDS });
  const total = await incrementCount(env.STATS_KV, COUNTER_KEY);
  return json({ total, counted: true });
};
