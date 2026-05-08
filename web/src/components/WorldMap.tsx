"use client";

import { useMemo, useRef, useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import type { RaceListItem } from "@/types/content";
import { MONTH_LABELS, type Palette, type DisplayFont } from "./design-tokens";
import { CONTINENT_POLYGONS, type LngLat } from "./continent-polygons";
import { resolveCoords } from "@/lib/country-coords";

const W = 1000;
const H = 500;

// Pacific 中心に経度を回転（日本中心ビュー）
function project(lat: number, lng: number, w: number, h: number): [number, number] {
  let x = lng - 150;
  if (x > 180) x -= 360;
  if (x < -180) x += 360;
  const px = ((x + 180) / 360) * w;
  const py = (1 - (Math.max(-60, Math.min(85, lat)) + 60) / 145) * h;
  return [px, py];
}

function ringToPath(ring: LngLat[], w: number, h: number): string {
  const segs: [number, number][][] = [[]];
  let prev: [number, number] | null = null;
  for (const [lng, lat] of ring) {
    const [x, y] = project(lat, lng, w, h);
    if (prev && Math.abs(x - prev[0]) > w * 0.5) {
      segs.push([]);
    }
    segs[segs.length - 1].push([x, y]);
    prev = [x, y];
  }
  return segs
    .map((s) => (s.length < 2 ? "" : "M " + s.map((p) => p.join(",")).join(" L ")))
    .filter(Boolean)
    .join(" ");
}

function pointInRing(point: [number, number], ring: LngLat[]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

const COUNTRY_LABELS: { name: string; lat: number; lng: number }[] = [
  { name: "JAPAN", lat: 36, lng: 138 },
  { name: "USA", lat: 39, lng: -98 },
  { name: "AFRICA", lat: 5, lng: 22 },
  { name: "EUROPE", lat: 50, lng: 10 },
  { name: "AUSTRALIA", lat: -25, lng: 134 },
  { name: "S. AMERICA", lat: -15, lng: -60 },
];

interface CountryGroup {
  country: string;
  coords: [number, number];
  races: RaceListItem[];
}

interface HoverState extends CountryGroup {
  px: number;
  py: number;
}

export function WorldMap({
  races,
  palette,
  displayFont,
  height = 460,
}: {
  races: RaceListItem[];
  palette: Palette;
  displayFont: DisplayFont;
  height?: number;
}) {
  const router = useRouter();
  const [hover, setHover] = useState<HoverState | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const handleSelectRace = (slug: string) => router.push(`/races/${slug}`);

  const clearHideTimer = () => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const scheduleHideHover = () => {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setHover(null);
      hideTimerRef.current = null;
    }, 120);
  };

  const byCountry = useMemo(() => {
    const m: Record<string, CountryGroup> = {};
    races.forEach((r) => {
      const coords = resolveCoords(r.country, r.coords);
      if (!coords) return;
      const key = r.country;
      if (!m[key]) m[key] = { country: r.country, coords, races: [] };
      m[key].races.push(r);
    });
    return Object.values(m);
  }, [races]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: `${W} / ${H}`,
        maxHeight: height,
        background: palette.bg,
        border: `1px solid ${palette.rule}`,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={palette.accent} stopOpacity="0.6" />
            <stop offset="100%" stopColor={palette.accent} stopOpacity="0" />
          </radialGradient>
          <pattern id="paperGrain" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill={palette.bg} />
            <circle cx="1" cy="1" r="0.3" fill={palette.inkSoft} opacity="0.08" />
          </pattern>
        </defs>

        <rect width={W} height={H} fill="url(#paperGrain)" />

        {[-30, 0, 30, 60].map((lat) => {
          const [, y] = project(lat, 0, W, H);
          return (
            <line
              key={lat}
              x1={0}
              y1={y}
              x2={W}
              y2={y}
              stroke={palette.inkSoft}
              strokeWidth="0.4"
              strokeDasharray={lat === 0 ? "1 0" : "1 4"}
              opacity={lat === 0 ? 0.18 : 0.1}
            />
          );
        })}
        {[140 - 180, 140 - 90, 140, 140 + 90, 140 + 180].map((lng, i) => {
          const [x] = project(0, lng, W, H);
          return (
            <line
              key={i}
              x1={x}
              y1={0}
              x2={x}
              y2={H}
              stroke={palette.inkSoft}
              strokeWidth="0.4"
              strokeDasharray="1 4"
              opacity={0.1}
            />
          );
        })}

        <g>
          {Object.entries(CONTINENT_POLYGONS).map(([key, ring]) => {
            const d = ringToPath(ring, W, H);
            return (
              <path
                key={key}
                d={d}
                fill={palette.ink}
                fillOpacity="0.10"
                stroke={palette.ink}
                strokeOpacity="0.55"
                strokeWidth="0.7"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            );
          })}
        </g>

        <g opacity="0.35">
          {Object.values(CONTINENT_POLYGONS).map((ring, ri) => {
            const lats = ring.map((p) => p[1]);
            const lngs = ring.map((p) => p[0]);
            const lat0 = Math.min(...lats);
            const lat1 = Math.max(...lats);
            const lng0 = Math.min(...lngs);
            const lng1 = Math.max(...lngs);
            const dots: React.ReactElement[] = [];
            const step = 4;
            for (let lat = lat0; lat <= lat1; lat += step) {
              for (let lng = lng0; lng <= lng1; lng += step) {
                if (pointInRing([lng, lat], ring)) {
                  const [x, y] = project(lat, lng, W, H);
                  dots.push(
                    <circle key={`${ri}-${lat}-${lng}`} cx={x} cy={y} r="0.55" fill={palette.ink} />,
                  );
                }
              }
            }
            return <g key={ri}>{dots}</g>;
          })}
        </g>

        {COUNTRY_LABELS.map((c) => {
          const [x, y] = project(c.lat, c.lng, W, H);
          return (
            <text
              key={c.name}
              x={x}
              y={y}
              textAnchor="middle"
              fontFamily={displayFont.stack}
              fontSize="11"
              fontWeight="600"
              letterSpacing="0.18em"
              fill={palette.inkSoft}
              opacity="0.5"
              style={{ pointerEvents: "none", textTransform: "uppercase" }}
            >
              {c.name}
            </text>
          );
        })}

        {(() => {
          const [cx, cy] = project(36, 138, W, H);
          return (
            <g opacity="0.22">
              <circle cx={cx} cy={cy} r="40" fill="none" stroke={palette.accent} strokeWidth="0.6" strokeDasharray="2 3" />
              <circle cx={cx} cy={cy} r="80" fill="none" stroke={palette.accent} strokeWidth="0.4" strokeDasharray="2 6" />
              <line x1={cx - 50} y1={cy} x2={cx - 12} y2={cy} stroke={palette.accent} strokeWidth="0.5" />
              <line x1={cx + 12} y1={cy} x2={cx + 50} y2={cy} stroke={palette.accent} strokeWidth="0.5" />
              <line x1={cx} y1={cy - 50} x2={cx} y2={cy - 12} stroke={palette.accent} strokeWidth="0.5" />
              <line x1={cx} y1={cy + 12} x2={cx} y2={cy + 50} stroke={palette.accent} strokeWidth="0.5" />
            </g>
          );
        })()}

        {byCountry.map((group) => {
          const [x, y] = project(group.coords[0], group.coords[1], W, H);
          const isHovered = hover?.country === group.country;
          const count = group.races.length;
          return (
            <g
              key={group.country}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => {
                clearHideTimer();
                if (!wrapRef.current) return;
                const rect = wrapRef.current.getBoundingClientRect();
                setHover({
                  country: group.country,
                  coords: group.coords,
                  races: group.races,
                  px: (x / W) * rect.width,
                  py: (y / H) * rect.height,
                });
              }}
              onMouseLeave={scheduleHideHover}
              onClick={() => {
                if (group.races.length === 1) {
                  handleSelectRace(group.races[0].slug);
                  return;
                }
                clearHideTimer();
                if (!wrapRef.current) return;
                const rect = wrapRef.current.getBoundingClientRect();
                setHover({
                  country: group.country,
                  coords: group.coords,
                  races: group.races,
                  px: (x / W) * rect.width,
                  py: (y / H) * rect.height,
                });
              }}
            >
              <circle cx={x} cy={y} r={isHovered ? 24 : 16} fill="url(#pinGlow)" />
              <circle cx={x} cy={y} r="6" fill="none" stroke={palette.accent} strokeWidth="1">
                <animate attributeName="r" values="6;14;6" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 5.5 : 4.5}
                fill={palette.accent}
                stroke={palette.bg}
                strokeWidth="1.5"
              />
              {count > 1 && (
                <text
                  x={x + 7}
                  y={y - 5}
                  fontFamily="ui-monospace, monospace"
                  fontSize="9"
                  fontWeight="700"
                  fill={palette.ink}
                >
                  ×{count}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {[
        { top: 8, left: 8, label: "90°N" },
        { top: 8, right: 8, label: "W ⟵ 140°E ⟶ E", textAlign: "right" as const },
        { bottom: 8, left: 8, label: "PACIFIC-CENTERED" },
        { bottom: 8, right: 8, label: `${races.length} RACES`, textAlign: "right" as const },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: c.top,
            left: c.left,
            right: c.right,
            bottom: c.bottom,
            textAlign: c.textAlign,
            fontFamily: "ui-monospace, monospace",
            fontSize: 9,
            letterSpacing: "0.18em",
            color: palette.inkSoft,
            opacity: 0.55,
            pointerEvents: "none",
            textTransform: "uppercase",
          }}
        >
          {c.label}
        </div>
      ))}

      {hover && (
        <HoverCard
          hover={hover}
          palette={palette}
          displayFont={displayFont}
          containerRef={wrapRef}
          onSelectRace={handleSelectRace}
          onCardEnter={clearHideTimer}
          onCardLeave={scheduleHideHover}
        />
      )}
    </div>
  );
}

function HoverCard({
  hover,
  palette,
  displayFont,
  containerRef,
  onSelectRace,
  onCardEnter,
  onCardLeave,
}: {
  hover: HoverState;
  palette: Palette;
  displayFont: DisplayFont;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSelectRace?: (slug: string) => void;
  onCardEnter?: () => void;
  onCardLeave?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ left: hover.px + 16, top: hover.py - 10 });

  useLayoutEffect(() => {
    if (!cardRef.current || !containerRef.current) return;
    const c = cardRef.current.getBoundingClientRect();
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    let left = hover.px + 16;
    let top = hover.py - c.height / 2;
    if (left + c.width > w - 8) left = hover.px - c.width - 16;
    if (top < 8) top = 8;
    if (top + c.height > h - 8) top = h - c.height - 8;
    setPos({ left, top });
  }, [hover.px, hover.py, containerRef]);

  const r0 = hover.races[0];

  return (
    <div
      ref={cardRef}
      onMouseEnter={onCardEnter}
      onMouseLeave={onCardLeave}
      style={{
        position: "absolute",
        left: pos.left,
        top: pos.top,
        width: 280,
        background: palette.paper,
        border: `1px solid ${palette.ink}`,
        boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
        pointerEvents: "auto",
        zIndex: 10,
      }}
    >
      <div
        style={{
          height: 110,
          backgroundImage: r0.hero_image
            ? `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%), url(${r0.hero_image})`
            : `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%)`,
          backgroundColor: r0.hero_image ? undefined : palette.accentDeep,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 12,
            bottom: 8,
            fontFamily: "ui-monospace, monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "#fff",
            textTransform: "uppercase",
          }}
        >
          {hover.country}
        </div>
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        {hover.races.length === 1 ? (
          <>
            <div
              style={{
                fontFamily: displayFont.stack,
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.005em",
                textTransform: "uppercase",
                lineHeight: 1.15,
                color: palette.ink,
                marginBottom: 4,
              }}
            >
              {r0.title_en ?? r0.title}
            </div>
            <div style={{ fontSize: 11, color: palette.inkSoft, marginBottom: 10 }}>{r0.title}</div>
            <div
              style={{
                display: "flex",
                gap: 12,
                fontSize: 11,
                fontFamily: "ui-monospace, monospace",
                color: palette.ink,
                borderTop: `1px solid ${palette.rule}`,
                paddingTop: 10,
                flexWrap: "wrap",
              }}
            >
              <span>
                <strong>{r0.distance_km}</strong>km
              </span>
              <span>{r0.stages} stages</span>
              <span>{MONTH_LABELS[r0.start_month]}</span>
              <span>★ {r0.difficulty}/5</span>
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 11,
                lineHeight: 1.6,
                color: palette.inkSoft,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {r0.summary}
            </div>
            <div
              onClick={() => onSelectRace?.(r0.slug)}
              style={{
                marginTop: 12,
                fontFamily: displayFont.stack,
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: palette.accent,
                cursor: "pointer",
              }}
            >
              Click to view ↗
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                fontFamily: displayFont.stack,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: palette.inkSoft,
                marginBottom: 10,
              }}
            >
              {hover.races.length} races in {hover.country}
            </div>
            {hover.races.map((r) => (
              <button
                key={r.slug}
                type="button"
                onClick={() => onSelectRace?.(r.slug)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "8px 0",
                  borderTop: `1px solid ${palette.rule}`,
                  gap: 12,
                  width: "100%",
                  background: "transparent",
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "none",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontFamily: displayFont.stack,
                      fontSize: 13,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color: palette.ink,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.title_en ?? r.title}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 10,
                    color: palette.inkSoft,
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.distance_km}km · {MONTH_LABELS[r.start_month]}
                </div>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
