"use client";

import { useEffect } from "react";

type Scope = "organizer" | "race" | "report";

function sessionKey(scope: Scope, id: string) {
  return `srhub:pv-pinged:${scope}:${id}`;
}

export function PvPing({ scope, id }: { scope: Scope; id: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = sessionKey(scope, id);
    if (sessionStorage.getItem(key) === "1") return;

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          `/api/counters/pv/${encodeURIComponent(scope)}/${encodeURIComponent(id)}`,
          { method: "POST", signal: controller.signal },
        );
        if (res.ok) sessionStorage.setItem(key, "1");
      } catch {
        // ignore network errors
      }
    })();

    return () => controller.abort();
  }, [scope, id]);

  return null;
}
