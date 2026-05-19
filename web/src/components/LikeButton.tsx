"use client";

import { useEffect, useState } from "react";
import type { Palette, DisplayFont } from "./design-tokens";

interface LikeResponse {
  slug: string;
  total: number;
  liked?: boolean;
}

function localKey(slug: string, date: string) {
  return `srhub:liked:${slug}:${date}`;
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function LikeButton({
  slug,
  palette,
  displayFont,
}: {
  slug: string;
  palette: Palette;
  displayFont: DisplayFont;
}) {
  const [total, setTotal] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(localKey(slug, todayUtc())) === "1");

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/likes/${encodeURIComponent(slug)}`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = (await res.json()) as LikeResponse;
        setTotal(data.total);
      } catch {
        // ignore
      }
    })();
    return () => controller.abort();
  }, [slug]);

  const onClick = async () => {
    if (liked || pending) return;
    setPending(true);
    try {
      const res = await fetch(`/api/likes/${encodeURIComponent(slug)}`, {
        method: "POST",
      });
      if (!res.ok) return;
      const data = (await res.json()) as LikeResponse;
      setTotal(data.total);
      setLiked(true);
      localStorage.setItem(localKey(slug, todayUtc()), "1");
    } catch {
      // ignore
    } finally {
      setPending(false);
    }
  };

  const disabled = liked || pending || total === null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={liked}
      aria-label={liked ? "いいね済み" : "このレポートにいいねする"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        background: liked ? palette.accentDeep : palette.paper,
        color: liked ? palette.bg : palette.ink,
        border: `1px solid ${liked ? palette.accentDeep : palette.rule}`,
        borderRadius: 999,
        fontFamily: displayFont.stack,
        fontSize: 12,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        cursor: disabled ? "default" : "pointer",
        opacity: pending ? 0.6 : 1,
        transition: "background 120ms ease, color 120ms ease",
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1 }}>
        {liked ? "♥" : "♡"}
      </span>
      <span>Like</span>
      <span style={{ fontFamily: "ui-monospace, monospace", letterSpacing: "0.08em" }}>
        {total === null ? "—" : total.toLocaleString("en-US")}
      </span>
    </button>
  );
}
