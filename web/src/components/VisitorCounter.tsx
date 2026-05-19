"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "srhub:visit-pinged";

export function VisitorCounter({ color }: { color: string }) {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const alreadyPinged = sessionStorage.getItem(SESSION_KEY) === "1";
    const controller = new AbortController();

    const run = async () => {
      try {
        const res = await fetch("/api/visits", {
          method: alreadyPinged ? "GET" : "POST",
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = (await res.json()) as { total?: number };
        if (typeof data.total === "number") {
          setTotal(data.total);
          if (!alreadyPinged) sessionStorage.setItem(SESSION_KEY, "1");
        }
      } catch {
        // ignore network errors silently
      }
    };
    run();

    return () => controller.abort();
  }, []);

  if (total === null) return null;

  return (
    <span
      style={{
        fontFamily: "ui-monospace, monospace",
        fontSize: 11,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color,
      }}
      aria-label={`総アクセス数 ${total.toLocaleString("en-US")}`}
    >
      Total Visits · {total.toLocaleString("en-US")}
    </span>
  );
}
