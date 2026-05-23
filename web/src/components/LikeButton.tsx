"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { Palette, DisplayFont } from "./design-tokens";

type Scope = "organizer" | "race" | "report";

interface LikeResponse {
  kind: "like";
  scope: Scope;
  id: string;
  total: number;
  counted?: boolean;
}

function localKey(scope: Scope, id: string, date: string) {
  return `srhub:liked:${scope}:${id}:${date}`;
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function apiUrl(scope: Scope, id: string) {
  return `/api/counters/like/${encodeURIComponent(scope)}/${encodeURIComponent(id)}`;
}

const likedListeners = new Set<() => void>();

function subscribeLiked(callback: () => void) {
  likedListeners.add(callback);
  const onStorage = () => callback();
  window.addEventListener("storage", onStorage);
  return () => {
    likedListeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function notifyLiked() {
  likedListeners.forEach((l) => l());
}

function useLikedFromStorage(scope: Scope, id: string) {
  return useSyncExternalStore(
    subscribeLiked,
    () => localStorage.getItem(localKey(scope, id, todayUtc())) === "1",
    () => false,
  );
}

export function LikeButton({
  scope,
  id,
  palette,
  displayFont,
}: {
  scope: Scope;
  id: string;
  palette: Palette;
  displayFont: DisplayFont;
}) {
  const [total, setTotal] = useState<number | null>(null);
  const liked = useLikedFromStorage(scope, id);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(apiUrl(scope, id), { signal: controller.signal });
        if (!res.ok) return;
        const data = (await res.json()) as LikeResponse;
        setTotal(data.total);
      } catch {
        // ignore
      }
    })();
    return () => controller.abort();
  }, [scope, id]);

  const onClick = async () => {
    if (liked || pending) return;
    setPending(true);
    try {
      const res = await fetch(apiUrl(scope, id), { method: "POST" });
      if (!res.ok) return;
      const data = (await res.json()) as LikeResponse;
      setTotal(data.total);
      localStorage.setItem(localKey(scope, id, todayUtc()), "1");
      notifyLiked();
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
