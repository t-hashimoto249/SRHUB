"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { Palette, DisplayFont } from "@/components/design-tokens";
import styles from "./contact.module.css";

interface ContactFormProps {
  palette: Palette;
  displayFont: DisplayFont;
}

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "success" };

const ERROR_MESSAGES: Record<string, string> = {
  name_required: "お名前を入力してください。",
  email_invalid: "メールアドレスの形式を確認してください。",
  body_required: "本文を入力してください。",
  rate_limited: "本日の送信上限に達しました。時間をおいて再度お試しください。",
  mail_not_configured: "メール送信が設定されていません。サイト管理者にご連絡ください。",
  send_failed: "送信に失敗しました。時間をおいて再度お試しください。",
  invalid_json: "送信内容を読み込めませんでした。再度入力してください。",
  network: "ネットワークエラーが発生しました。接続を確認のうえ再度お試しください。",
};

export function ContactForm({ palette, displayFont }: ContactFormProps) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    body: "",
    hp: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus({ kind: "success" });
        setForm({ name: "", email: "", subject: "", body: "", hp: "" });
      } else {
        const code = data.error ?? "send_failed";
        setStatus({ kind: "error", message: ERROR_MESSAGES[code] ?? ERROR_MESSAGES.send_failed });
      }
    } catch {
      setStatus({ kind: "error", message: ERROR_MESSAGES.network });
    }
  }

  if (status.kind === "success") {
    return (
      <div
        className={styles.success}
        style={{ borderColor: palette.accent, background: palette.paper, color: palette.ink }}
      >
        <h2 className={styles.successTitle} style={{ fontFamily: displayFont.stack }}>
          Message received.
        </h2>
        <p className={styles.successBody} style={{ color: palette.inkSoft }}>
          メッセージを受け付けました。内容を確認のうえ、編集部より折り返しご連絡します。返信は数日かかる場合があります。
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className={styles.submit}
          style={{
            marginTop: 24,
            background: palette.ink,
            color: palette.paper,
            fontFamily: displayFont.stack,
          }}
        >
          Send another →
        </button>
      </div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row} style={{ color: palette.ink }}>
        <label
          className={styles.label}
          htmlFor="contact-name"
          style={{ color: palette.inkSoft, fontFamily: displayFont.stack }}
        >
          Name
          <span className={styles.required} style={{ color: palette.accent }}>
            *
          </span>
        </label>
        <input
          id="contact-name"
          className={styles.input}
          type="text"
          name="name"
          autoComplete="name"
          required
          maxLength={80}
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          style={{ color: palette.ink, borderColor: palette.rule }}
        />
      </div>

      <div className={styles.row} style={{ color: palette.ink }}>
        <label
          className={styles.label}
          htmlFor="contact-email"
          style={{ color: palette.inkSoft, fontFamily: displayFont.stack }}
        >
          Email
          <span className={styles.required} style={{ color: palette.accent }}>
            *
          </span>
        </label>
        <input
          id="contact-email"
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
          required
          maxLength={200}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          style={{ color: palette.ink, borderColor: palette.rule }}
        />
      </div>

      <div className={styles.row} style={{ color: palette.ink }}>
        <label
          className={styles.label}
          htmlFor="contact-subject"
          style={{ color: palette.inkSoft, fontFamily: displayFont.stack }}
        >
          Subject
        </label>
        <input
          id="contact-subject"
          className={styles.input}
          type="text"
          name="subject"
          maxLength={160}
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          style={{ color: palette.ink, borderColor: palette.rule }}
        />
      </div>

      <div className={styles.row} style={{ color: palette.ink }}>
        <label
          className={styles.label}
          htmlFor="contact-body"
          style={{ color: palette.inkSoft, fontFamily: displayFont.stack }}
        >
          Message
          <span className={styles.required} style={{ color: palette.accent }}>
            *
          </span>
        </label>
        <textarea
          id="contact-body"
          className={styles.textarea}
          name="body"
          required
          maxLength={8000}
          value={form.body}
          onChange={(e) => update("body", e.target.value)}
          style={{ color: palette.ink, borderColor: palette.rule }}
        />
      </div>

      <div className={styles.honeypot} aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            name="hp"
            value={form.hp}
            onChange={(e) => update("hp", e.target.value)}
          />
        </label>
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submit}
          disabled={submitting}
          style={{
            background: palette.ink,
            color: palette.paper,
            fontFamily: displayFont.stack,
          }}
        >
          {submitting ? "Sending…" : "Send message →"}
        </button>
        {status.kind === "error" && (
          <div
            className={`${styles.status} ${styles.statusError}`}
            style={{ color: palette.accentDeep, borderColor: palette.accentDeep }}
          >
            {status.message}
          </div>
        )}
      </div>

      <p
        style={{
          fontSize: 12,
          lineHeight: 1.8,
          color: palette.inkSoft,
          margin: 0,
          marginTop: 8,
        }}
      >
        送信後、編集部にて内容を確認します。確認のうえ折り返しご連絡いたしますが、すべてのメッセージに返信できるとは限りません。
      </p>
    </form>
  );
}
