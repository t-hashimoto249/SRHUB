import {
  type CounterKind,
  type CounterScope,
  type Env,
  clientIp,
  counterGuardKey,
  counterMonthKey,
  counterTotalKey,
  incrementCount,
  isCounterId,
  isCounterKind,
  isCounterScope,
  json,
  monthUtc,
  readCount,
  sha256,
} from "../../../../_shared";

// PV: 同IP・同対象は1時間に1回まで
// Like: 同IP・同対象は24時間に1回まで
const GUARD_TTL_SECONDS: Record<CounterKind, number> = {
  pv: 60 * 60,
  like: 60 * 60 * 24,
};

interface ParsedParams {
  kind: CounterKind;
  scope: CounterScope;
  id: string;
}

function parseParams(params: Record<string, string | string[]>): ParsedParams | null {
  const pick = (key: string): string | undefined => {
    const v = params[key];
    return Array.isArray(v) ? v[0] : v;
  };
  const kind = pick("kind");
  const scope = pick("scope");
  const id = pick("id");
  if (!isCounterKind(kind)) return null;
  if (!isCounterScope(scope)) return null;
  if (!isCounterId(id)) return null;
  return { kind, scope, id };
}

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const parsed = parseParams(params);
  if (!parsed) return json({ error: "invalid params" }, { status: 400 });
  const { kind, scope, id } = parsed;
  const total = await readCount(env.STATS_KV, counterTotalKey(kind, scope, id));
  return json({ kind, scope, id, total });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => {
  const parsed = parseParams(params);
  if (!parsed) return json({ error: "invalid params" }, { status: 400 });
  const { kind, scope, id } = parsed;

  const totalKey = counterTotalKey(kind, scope, id);
  const ipHash = await sha256(clientIp(request));
  const guardKey = counterGuardKey(kind, ipHash, scope, id);

  const seen = await env.STATS_KV.get(guardKey);
  if (seen) {
    const total = await readCount(env.STATS_KV, totalKey);
    return json({ kind, scope, id, total, counted: false });
  }

  await env.STATS_KV.put(guardKey, "1", { expirationTtl: GUARD_TTL_SECONDS[kind] });
  const total = await incrementCount(env.STATS_KV, totalKey);
  // 月別カウンタも同時に積む（集計時に期間切り出し可能にするため）
  await incrementCount(env.STATS_KV, counterMonthKey(kind, scope, id, monthUtc()));
  return json({ kind, scope, id, total, counted: true });
};
