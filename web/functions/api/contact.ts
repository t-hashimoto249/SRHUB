import {
  clientIp,
  json,
  readCount,
  sha256,
} from "../_shared";

interface ContactEnv {
  STATS_KV?: KVNamespace;
  RESEND_API_KEY: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
}

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  body?: unknown;
  hp?: unknown;
}

const MAX_NAME = 80;
const MAX_EMAIL = 200;
const MAX_SUBJECT = 160;
const MAX_BODY = 8000;
const RATE_LIMIT_PER_DAY = 5;
const DAY_TTL_SECONDS = 60 * 60 * 24;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asTrimmedString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const s = value.trim();
  if (!s || s.length > max) return null;
  return s;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const onRequestPost: PagesFunction<ContactEnv> = async ({ request, env }) => {
  if (!env.RESEND_API_KEY) {
    return json({ error: "mail_not_configured" }, { status: 503 });
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return json({ error: "invalid_json" }, { status: 400 });
  }

  if (typeof payload.hp === "string" && payload.hp.trim() !== "") {
    return json({ ok: true });
  }

  const name = asTrimmedString(payload.name, MAX_NAME);
  const email = asTrimmedString(payload.email, MAX_EMAIL);
  const subject = asTrimmedString(payload.subject, MAX_SUBJECT) ?? "(no subject)";
  const body = asTrimmedString(payload.body, MAX_BODY);

  if (!name) return json({ error: "name_required" }, { status: 400 });
  if (!email || !EMAIL_RE.test(email)) return json({ error: "email_invalid" }, { status: 400 });
  if (!body) return json({ error: "body_required" }, { status: 400 });

  const ip = clientIp(request);
  const ipHash = (await sha256(ip)).slice(0, 16);
  const today = new Date().toISOString().slice(0, 10);
  const rateKey = `contact-rl:${today}:${ipHash}`;

  const kv = env.STATS_KV;
  if (kv) {
    const count = await readCount(kv, rateKey);
    if (count >= RATE_LIMIT_PER_DAY) {
      return json({ error: "rate_limited" }, { status: 429 });
    }
  }

  const from = env.CONTACT_FROM_EMAIL ?? "Stage Race Hub <contact@srhub.jp>";
  const to = env.CONTACT_TO_EMAIL ?? "takeshi249@gmail.com";

  const textParts = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Subject: ${subject}`,
    `IP-hash: ${ipHash}`,
    `Date:    ${new Date().toISOString()}`,
    "",
    "----",
    "",
    body,
  ];

  const htmlBody = [
    "<table style=\"font-family:ui-sans-serif,system-ui;font-size:14px\">",
    `<tr><td><b>Name</b></td><td>${escapeHtml(name)}</td></tr>`,
    `<tr><td><b>Email</b></td><td>${escapeHtml(email)}</td></tr>`,
    `<tr><td><b>Subject</b></td><td>${escapeHtml(subject)}</td></tr>`,
    `<tr><td><b>IP-hash</b></td><td><code>${escapeHtml(ipHash)}</code></td></tr>`,
    "</table>",
    "<hr/>",
    `<pre style="white-space:pre-wrap;font-family:ui-sans-serif,system-ui;font-size:14px">${escapeHtml(body)}</pre>`,
  ].join("");

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[Contact] ${subject}`,
      text: textParts.join("\n"),
      html: htmlBody,
    }),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text().catch(() => "");
    console.error("resend_failed", resendRes.status, detail);
    return json({ error: "send_failed" }, { status: 502 });
  }

  if (kv) {
    const after = (await readCount(kv, rateKey)) + 1;
    await kv.put(rateKey, String(after), { expirationTtl: DAY_TTL_SECONDS });
  }

  return json({ ok: true });
};
