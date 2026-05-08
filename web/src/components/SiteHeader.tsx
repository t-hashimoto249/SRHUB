"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Palette, DisplayFont } from "./design-tokens";
import styles from "./SiteHeader.module.css";

interface SiteHeaderProps {
  palette: Palette;
  displayFont: DisplayFont;
  current?: "home" | "races" | "reports" | "partners" | "about";
  variant?: "A" | "B";
}

const NAV = [
  { id: "home", label: "Home", href: "/" },
  { id: "races", label: "Races", href: "/races" },
  { id: "partners", label: "Partners", href: "/partners" },
  { id: "about", label: "About", href: "/about" },
] as const;

export function SiteHeader({ palette, displayFont, current = "home", variant = "A" }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const isB = variant === "B";

  useEffect(() => {
    if (open) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  return (
    <>
      <header
        className={styles.header}
        style={{
          borderBottom: isB ? "none" : `1px solid ${palette.rule}`,
          background: isB ? "transparent" : palette.paper,
          color: palette.ink,
        }}
      >
        <Link
          href="/"
          className={styles.brand}
          style={{ textDecoration: "none", color: "inherit" }}
          onClick={() => setOpen(false)}
        >
          <span
            className={styles.logoBox}
            style={{ background: isB ? "rgba(255,255,255,0.92)" : "transparent" }}
          >
            <Image
              src="/images/logo.png"
              alt="Stage Race"
              width={28}
              height={28}
              priority
              style={{ display: "block", objectFit: "contain" }}
            />
          </span>
          <div>
            <div
              className={styles.brandTitle}
              style={{ fontFamily: displayFont.stack, color: isB ? "#fff" : palette.ink }}
            >
              STAGE&nbsp;RACE&nbsp;HUB
            </div>
            <div
              className={styles.brandSub}
              style={{ color: isB ? "rgba(255,255,255,0.7)" : palette.inkSoft }}
            >
              日本語
            </div>
          </div>
        </Link>

        <nav className={styles.navDesktop}>
          {NAV.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={styles.navLink}
              style={{
                fontFamily: displayFont.stack,
                color: isB ? "#fff" : palette.ink,
                opacity: current === item.id ? 1 : 0.6,
                borderBottom:
                  current === item.id
                    ? `1.5px solid ${isB ? "#fff" : palette.accent}`
                    : "1.5px solid transparent",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={styles.hamburger}
          style={{ color: isB ? "#fff" : palette.ink }}
        >
          <span
            style={{
              transform: open ? "rotate(45deg) translate(4.5px, 4.5px)" : "none",
            }}
          />
          <span style={{ opacity: open ? 0 : 1 }} />
          <span
            style={{
              transform: open ? "rotate(-45deg) translate(4.5px, -4.5px)" : "none",
            }}
          />
        </button>
      </header>

      {open && (
        <div className={styles.drawer} style={{ background: palette.paper, color: palette.ink }}>
          <nav className={styles.drawerNav}>
            {NAV.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={styles.drawerLink}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: displayFont.stack,
                  color: palette.ink,
                  opacity: current === item.id ? 1 : 0.55,
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
