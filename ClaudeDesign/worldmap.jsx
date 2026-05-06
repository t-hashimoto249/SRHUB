// worldmap.jsx — 日本中心の世界地図 + 国別レースピン
// Pacific-centered equirectangular projection
// 大陸を実シルエットのSVGパスで描画

// ─── 投影: 経度をPacific中心(150°)に回転 ───
function project(lat, lng, w, h) {
  let x = lng - 150;
  if (x > 180) x -= 360;
  if (x < -180) x += 360;
  const px = (x + 180) / 360 * w;
  const py = (1 - (Math.max(-60, Math.min(85, lat)) + 60) / 145) * h;
  return [px, py];
}

// 緯度経度の配列を SVG path d に変換（Pacific-centeredで日付変更線を跨ぐ場合は分割）
function ringToPath(ring, W, H) {
  // ring: [[lng, lat], ...]
  // dateline (経度=150の反対側=-30) を跨ぐ場合、リングを分割する
  // 実装簡略化: 隣接2点の投影x距離が画面幅の半分超なら分断
  const segs = [[]];
  let prev = null;
  for (const [lng, lat] of ring) {
    const [x, y] = project(lat, lng, W, H);
    if (prev && Math.abs(x - prev[0]) > W * 0.5) {
      segs.push([]); // 新しいセグメント開始
    }
    segs[segs.length - 1].push([x, y]);
    prev = [x, y];
  }
  return segs.map(s => s.length < 2 ? '' : 'M ' + s.map(p => p.join(',')).join(' L ')).filter(Boolean).join(' ');
}

function polysToPath(polys, W, H) {
  return polys.map(ring => ringToPath(ring, W, H)).filter(Boolean).join(' ');
}

// 点がリング内部にあるか（ray casting）
function pointInRing(point, ring) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi + 1e-9) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// ─── 主要国名ラベル位置 ───
const COUNTRY_LABELS = [
  { name: 'JAPAN', lat: 36, lng: 138 },
  { name: 'USA', lat: 39, lng: -98 },
  { name: 'AFRICA', lat: 5, lng: 22 },
  { name: 'EUROPE', lat: 50, lng: 10 },
  { name: 'AUSTRALIA', lat: -25, lng: 134 },
  { name: 'S. AMERICA', lat: -15, lng: -60 },
];

// ─── メインコンポーネント ───
function WorldMap({ races, palette, displayFont, onRaceClick, height = 460 }) {
  const [hover, setHover] = React.useState(null); // {race, x, y}
  const wrapRef = React.useRef(null);
  const W = 1000, H = 500;

  // レースを国でグループ化
  const byCountry = React.useMemo(() => {
    const m = {};
    races.forEach(r => {
      if (!r.coords) return;
      const k = r.country_code || r.country;
      if (!m[k]) m[k] = { country: r.country, coords: r.coords, races: [] };
      m[k].races.push(r);
    });
    return Object.values(m);
  }, [races]);

  return (
    <div ref={wrapRef} style={{
      position: 'relative', width: '100%', height,
      background: palette.bg,
      border: `1px solid ${palette.rule}`,
      overflow: 'hidden',
    }}>
      {/* 装飾: 緯度経度メモリ */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: '100%', display: 'block' }}>
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

        {/* 背景グレイン */}
        <rect width={W} height={H} fill="url(#paperGrain)" />

        {/* 緯度線（赤道, ±30°） */}
        {[-30, 0, 30, 60].map(lat => {
          const [, y] = project(lat, 0, W, H);
          return (
            <line key={lat} x1={0} y1={y} x2={W} y2={y}
              stroke={palette.inkSoft} strokeWidth="0.4"
              strokeDasharray={lat === 0 ? "1 0" : "1 4"}
              opacity={lat === 0 ? 0.18 : 0.1} />
          );
        })}
        {/* 経度線（中心=140°, ±90°） */}
        {[140 - 180, 140 - 90, 140, 140 + 90, 140 + 180].map((lng, i) => {
          const [x] = project(0, lng, W, H);
          return (
            <line key={i} x1={x} y1={0} x2={x} y2={H}
              stroke={palette.inkSoft} strokeWidth="0.4"
              strokeDasharray="1 4" opacity={0.1} />
          );
        })}

        {/* 大陸シルエット（fill + stroke） */}
        <g>
          {Object.entries(CONTINENT_POLYGONS).map(([key, ring]) => {
            const d = ringToPath(ring, W, H);
            return (
              <path key={key} d={d}
                fill={palette.ink} fillOpacity="0.10"
                stroke={palette.ink} strokeOpacity="0.55"
                strokeWidth="0.7"
                strokeLinejoin="round" strokeLinecap="round" />
            );
          })}
        </g>

        {/* 大陸内部の細かいハッチ風ドット（テクスチャ） */}
        <g opacity="0.35">
          {Object.values(CONTINENT_POLYGONS).map((ring, ri) => {
            // 各大陸の bounding box 内に薄いドット
            const lats = ring.map(p => p[1]);
            const lngs = ring.map(p => p[0]);
            const lat0 = Math.min(...lats), lat1 = Math.max(...lats);
            const lng0 = Math.min(...lngs), lng1 = Math.max(...lngs);
            const dots = [];
            const step = 4;
            for (let lat = lat0; lat <= lat1; lat += step) {
              for (let lng = lng0; lng <= lng1; lng += step) {
                if (pointInRing([lng, lat], ring)) {
                  const [x, y] = project(lat, lng, W, H);
                  dots.push(<circle key={`${ri}-${lat}-${lng}`} cx={x} cy={y} r="0.55" fill={palette.ink} />);
                }
              }
            }
            return <g key={ri}>{dots}</g>;
          })}
        </g>

        {/* 国名ラベル */}
        {COUNTRY_LABELS.map(c => {
          const [x, y] = project(c.lat, c.lng, W, H);
          return (
            <text key={c.name} x={x} y={y}
              textAnchor="middle"
              fontFamily={displayFont.stack} fontSize="11" fontWeight="600"
              letterSpacing="0.18em"
              fill={palette.inkSoft} opacity="0.5"
              style={{ pointerEvents: 'none', textTransform: 'uppercase' }}>
              {c.name}
            </text>
          );
        })}

        {/* 日本中心の照準（装飾） */}
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

        {/* レースピン */}
        {byCountry.map(group => {
          const [x, y] = project(group.coords[0], group.coords[1], W, H);
          const isHovered = hover?.country === group.country;
          const count = group.races.length;
          return (
            <g key={group.country}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => {
                const rect = wrapRef.current.getBoundingClientRect();
                setHover({
                  country: group.country,
                  races: group.races,
                  px: (x / W) * rect.width,
                  py: (y / H) * rect.height,
                });
              }}
              onMouseLeave={() => setHover(null)}
              onClick={() => onRaceClick && onRaceClick(group.races[0])}
            >
              {/* グロー */}
              <circle cx={x} cy={y} r={isHovered ? 24 : 16} fill="url(#pinGlow)" />
              {/* パルスリング */}
              <circle cx={x} cy={y} r="6" fill="none" stroke={palette.accent} strokeWidth="1">
                <animate attributeName="r" values="6;14;6" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2.4s" repeatCount="indefinite" />
              </circle>
              {/* 本体 */}
              <circle cx={x} cy={y} r={isHovered ? 5.5 : 4.5}
                fill={palette.accent} stroke={palette.bg} strokeWidth="1.5" />
              {/* 件数バッジ */}
              {count > 1 && (
                <text x={x + 7} y={y - 5}
                  fontFamily="ui-monospace, monospace" fontSize="9" fontWeight="700"
                  fill={palette.ink}>×{count}</text>
              )}
            </g>
          );
        })}
      </svg>

      {/* 装飾: コーナー目盛り */}
      {[
        { top: 8, left: 8, label: '90°N' },
        { top: 8, right: 8, label: 'W ⟵ 140°E ⟶ E', textAlign: 'right' },
        { bottom: 8, left: 8, label: 'PACIFIC-CENTERED' },
        { bottom: 8, right: 8, label: `${races.length} RACES`, textAlign: 'right' },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute', ...c,
          fontFamily: 'ui-monospace, monospace',
          fontSize: 9, letterSpacing: '0.18em',
          color: palette.inkSoft, opacity: 0.55,
          pointerEvents: 'none',
          textTransform: 'uppercase',
        }}>{c.label}</div>
      ))}

      {/* ホバーカード */}
      {hover && (
        <HoverCard hover={hover} palette={palette} displayFont={displayFont} containerRef={wrapRef} />
      )}
    </div>
  );
}

// ─── ホバーカード（マップ上にフロート） ───
function HoverCard({ hover, palette, displayFont, containerRef }) {
  const cardRef = React.useRef(null);
  const [pos, setPos] = React.useState({ left: hover.px + 16, top: hover.py - 10, side: 'right' });

  React.useLayoutEffect(() => {
    if (!cardRef.current || !containerRef.current) return;
    const c = cardRef.current.getBoundingClientRect();
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    let left = hover.px + 16;
    let top = hover.py - c.height / 2;
    let side = 'right';
    if (left + c.width > w - 8) { left = hover.px - c.width - 16; side = 'left'; }
    if (top < 8) top = 8;
    if (top + c.height > h - 8) top = h - c.height - 8;
    setPos({ left, top, side });
  }, [hover.px, hover.py]);

  const r0 = hover.races[0];

  return (
    <div ref={cardRef} style={{
      position: 'absolute', left: pos.left, top: pos.top,
      width: 280, background: palette.paper,
      border: `1px solid ${palette.ink}`,
      boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
      pointerEvents: 'none',
      zIndex: 10,
    }}>
      {/* サムネ */}
      <div style={{
        height: 110,
        backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%), url(${r0.hero_image})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', left: 12, bottom: 8,
          fontFamily: 'ui-monospace, monospace', fontSize: 10,
          letterSpacing: '0.2em', color: '#fff',
          textTransform: 'uppercase',
        }}>
          {hover.country}
        </div>
      </div>
      {/* ボディ */}
      <div style={{ padding: '14px 16px 16px' }}>
        {hover.races.length === 1 ? (
          <>
            <div style={{
              fontFamily: displayFont.stack, fontSize: 18, fontWeight: 600,
              letterSpacing: '-0.005em', textTransform: 'uppercase',
              lineHeight: 1.15, color: palette.ink,
              marginBottom: 4,
            }}>{r0.title_en}</div>
            <div style={{ fontSize: 11, color: palette.inkSoft, marginBottom: 10 }}>
              {r0.title}
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11,
              fontFamily: 'ui-monospace, monospace', color: palette.ink,
              borderTop: `1px solid ${palette.rule}`, paddingTop: 10,
              flexWrap: 'wrap',
            }}>
              <span><strong>{r0.distance_km}</strong>km</span>
              <span>{r0.stages} stages</span>
              <span>{MONTH_LABELS[r0.start_month]}</span>
              <span>★ {r0.difficulty}/5</span>
            </div>
            <div style={{
              marginTop: 10, fontSize: 11, lineHeight: 1.6, color: palette.inkSoft,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{r0.summary}</div>
            <div style={{
              marginTop: 12, fontFamily: displayFont.stack, fontSize: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: palette.accent,
            }}>Click to view ↗</div>
          </>
        ) : (
          <>
            <div style={{
              fontFamily: displayFont.stack, fontSize: 13, fontWeight: 600,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: palette.inkSoft, marginBottom: 10,
            }}>{hover.races.length} races in {hover.country}</div>
            {hover.races.map(r => (
              <div key={r.slug} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '8px 0', borderTop: `1px solid ${palette.rule}`,
                gap: 12,
              }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontFamily: displayFont.stack, fontSize: 13, fontWeight: 600,
                    textTransform: 'uppercase', color: palette.ink,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{r.title_en}</div>
                </div>
                <div style={{
                  fontFamily: 'ui-monospace, monospace', fontSize: 10,
                  color: palette.inkSoft, whiteSpace: 'nowrap',
                }}>{r.distance_km}km · {MONTH_LABELS[r.start_month]}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

window.WorldMap = WorldMap;
