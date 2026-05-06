// shared.jsx — design tokens, SiteHeader, SiteFooter, RaceMeta, helpers

// ─── デザイントークン（Tweaksから上書き可） ───
const PALETTES = {
  desert: {
    bg: '#F5F0E6',
    bgAlt: '#EDE5D4',
    paper: '#FBF8F1',
    ink: '#2A2218',
    inkSoft: '#5C4F3C',
    rule: 'rgba(42,34,24,0.18)',
    accent: '#B8763A',     // オーカー
    accentDeep: '#7A4A1F', // 深ブラウン
    sand: '#D9C8A6',
  },
  mountain: {
    bg: '#EEEEF0',
    bgAlt: '#DCDCE0',
    paper: '#F7F7F8',
    ink: '#1E2329',
    inkSoft: '#4A5260',
    rule: 'rgba(30,35,41,0.15)',
    accent: '#5A7088',
    accentDeep: '#2F3D4F',
    sand: '#B8C0CA',
  },
  polar: {
    bg: '#F4F4F2',
    bgAlt: '#E6E6E2',
    paper: '#FFFFFF',
    ink: '#16181A',
    inkSoft: '#4A4D52',
    rule: 'rgba(22,24,26,0.14)',
    accent: '#3B6E8F',
    accentDeep: '#1B2E3F',
    sand: '#CFD3D6',
  },
};

const DISPLAY_FONTS = {
  oswald: { name: 'Oswald', stack: '"Oswald", "Noto Sans JP", sans-serif', google: 'Oswald:wght@400;500;600;700' },
  bebas: { name: 'Bebas Neue', stack: '"Bebas Neue", "Noto Sans JP", sans-serif', google: 'Bebas+Neue' },
  barlow: { name: 'Barlow Condensed', stack: '"Barlow Condensed", "Noto Sans JP", sans-serif', google: 'Barlow+Condensed:wght@400;500;600;700;800' },
  archivo: { name: 'Archivo Narrow', stack: '"Archivo Narrow", "Noto Sans JP", sans-serif', google: 'Archivo+Narrow:wght@400;500;600;700' },
};

// Google Fonts 注入（一度だけ）
(function injectFonts() {
  if (document.getElementById('rs-fonts')) return;
  const fams = [
    'Noto+Sans+JP:wght@300;400;500;600;700',
    'Noto+Serif+JP:wght@400;600',
    ...Object.values(DISPLAY_FONTS).map(f => f.google),
  ];
  const link = document.createElement('link');
  link.id = 'rs-fonts';
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${fams.map(f => `family=${f}`).join('&')}&display=swap`;
  document.head.appendChild(link);
})();

// ─── カードスタイル ───
const CARD_STYLES = ['overlay', 'split', 'minimal'];

// ─── 地形アイコン（直感識別用） ───
const TERRAIN_META = {
  '砂漠':     { color: '#D9A24C', label: 'Desert',  glyph: '◢◣' },
  '山岳':     { color: '#5A7A5C', label: 'Alpine',  glyph: '▲▲' },
  '極地':     { color: '#7AA2C0', label: 'Polar',   glyph: '❄' },
  'ジャングル': { color: '#3F6B3A', label: 'Jungle',  glyph: '✦' },
  'その他':   { color: '#8C7A66', label: 'Mixed',   glyph: '◆' },
};
function TerrainIcon({ terrain, size = 18 }) {
  const m = TERRAIN_META[terrain] || TERRAIN_META['その他'];
  return (
    <span title={terrain} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: '50%',
      background: m.color, color: '#fff', fontSize: size * 0.5,
      fontFamily: 'ui-monospace, monospace', lineHeight: 1,
    }}>{m.glyph}</span>
  );
}
function TerrainTags({ terrain, palette, displayFont }) {
  return (
    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
      {terrain.map(t => {
        const m = TERRAIN_META[t] || TERRAIN_META['その他'];
        return (
          <span key={t} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 8px 3px 6px', border: `1px solid ${m.color}`,
            color: m.color, fontFamily: displayFont.stack, fontSize: 11, letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            <TerrainIcon terrain={t} size={14} />{t}
          </span>
        );
      })}
    </span>
  );
}

// 目的（Purpose）メタ
const PURPOSE_META = {
  completion: { label: '完走志向', en: 'Finish', color: '#7A4A1F' },
  competitive: { label: '上位志向', en: 'Compete', color: '#B8763A' },
  personal: { label: 'マイペース志向', en: 'Personal', color: '#5C4F3C' },
};
function PurposeBadge({ purpose, palette, displayFont, size = 'sm' }) {
  const m = PURPOSE_META[purpose];
  if (!m) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: size === 'lg' ? '5px 10px' : '3px 8px',
      border: `1px solid ${m.color}`, color: m.color,
      fontFamily: displayFont.stack, fontSize: size === 'lg' ? 11 : 10, letterSpacing: '0.16em',
      textTransform: 'uppercase',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.color }} />
      {m.label}
    </span>
  );
}

// ─── Helpers ───
const Stars = ({ n, color }) => (
  <span style={{ letterSpacing: '0.08em', color: color || 'currentColor', fontSize: '0.9em' }}>
    {'★'.repeat(n)}<span style={{ opacity: 0.25 }}>{'★'.repeat(5 - n)}</span>
  </span>
);

const Placeholder = ({ label, ratio = '16/9', tone = 'sand' }) => (
  <div style={{
    aspectRatio: ratio,
    width: '100%',
    background: `repeating-linear-gradient(135deg, ${tone === 'dark' ? '#3a3024' : '#d9c8a6'} 0 8px, ${tone === 'dark' ? '#2a2218' : '#cfb98c'} 8px 16px)`,
    color: tone === 'dark' ? '#d9c8a6' : '#5C4F3C',
    fontFamily: 'ui-monospace, monospace',
    fontSize: 11,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    [{label}]
  </div>
);

// 公式エンブレム的な丸
const Mark = ({ color, size = 28 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    border: `1.5px solid ${color}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: '"Oswald", sans-serif', fontWeight: 600, fontSize: size * 0.42,
    color, letterSpacing: '0.05em',
  }}>
    SR
  </div>
);

// ─── SiteHeader ───
function SiteHeader({ palette, displayFont, current = 'home', variant = 'A' }) {
  const isB = variant === 'B';
  return (
    <header style={{
      position: 'relative', zIndex: 10,
      borderBottom: isB ? 'none' : `1px solid ${palette.rule}`,
      background: isB ? 'transparent' : palette.paper,
      color: palette.ink,
      padding: isB ? '20px 32px' : '16px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Mark color={isB ? '#fff' : palette.ink} size={28} />
        <div style={{ lineHeight: 1.1 }}>
          <div style={{
            fontFamily: displayFont.stack, fontWeight: 600, letterSpacing: '0.04em',
            fontSize: 17, color: isB ? '#fff' : palette.ink, textTransform: 'uppercase',
          }}>
            STAGE&nbsp;RACE
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.18em', color: isB ? 'rgba(255,255,255,0.7)' : palette.inkSoft, textTransform: 'uppercase' }}>
            World Edition · 日本語
          </div>
        </div>
      </div>
      <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {[
          { id: 'home', label: 'Home' },
          { id: 'races', label: 'Races' },
          { id: 'reports', label: 'Reports' },
          { id: 'about', label: 'About' },
        ].map(item => (
          <a key={item.id} style={{
            fontFamily: displayFont.stack, fontWeight: 500, fontSize: 13, letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: isB ? '#fff' : palette.ink,
            opacity: current === item.id ? 1 : 0.6,
            borderBottom: current === item.id ? `1.5px solid ${isB ? '#fff' : palette.accent}` : '1.5px solid transparent',
            paddingBottom: 2, cursor: 'pointer',
          }}>{item.label}</a>
        ))}
      </nav>
    </header>
  );
}

// ─── SiteFooter ───
function SiteFooter({ palette, displayFont }) {
  return (
    <footer style={{
      borderTop: `1px solid ${palette.rule}`,
      background: palette.bgAlt,
      color: palette.ink,
      padding: '40px 32px 28px',
      display: 'flex', flexDirection: 'column', gap: 32,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Mark color={palette.ink} size={26} />
            <div style={{ fontFamily: displayFont.stack, fontWeight: 600, letterSpacing: '0.06em', fontSize: 16, textTransform: 'uppercase' }}>
              Stage Race
            </div>
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.7, color: palette.inkSoft, maxWidth: 280 }}>
            世界中のステージレースを、日本人ウルトラランナーに届けるための非営利の記録庫。レポートと装備の情報、参加までの道筋を扱います。
          </p>
        </div>
        {[
          { h: 'Explore', items: ['Races', 'Reports', 'Continents', 'Calendar'] },
          { h: 'About', items: ['このサイトについて', '寄稿について', '免責事項'] },
          { h: 'Connect', items: ['X / Twitter', 'Instagram', 'RSS', 'Newsletter'] },
        ].map(col => (
          <div key={col.h}>
            <div style={{ fontFamily: displayFont.stack, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: palette.inkSoft, marginBottom: 12 }}>
              {col.h}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {col.items.map(i => <li key={i} style={{ fontSize: 13, color: palette.ink }}>{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: palette.inkSoft, paddingTop: 20, borderTop: `1px solid ${palette.rule}` }}>
        <span>© 2026 Stage Race Archive</span>
        <span style={{ fontFamily: displayFont.stack, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Run · Endure · Return</span>
      </div>
    </footer>
  );
}

// ─── RaceMeta ───
function RaceMeta({ race, palette, displayFont, layout = 'row' }) {
  const items = [
    { k: 'Distance', v: `${race.distance_km} km` },
    { k: 'Stages', v: `${race.stages} days` },
    { k: 'Country', v: race.country },
    { k: 'Continent', v: race.continent },
    { k: 'Terrain', v: race.terrain.join(' / ') },
    { k: 'Support', v: race.support === 'self' ? 'Self-support' : 'Full-support' },
  ];
  return (
    <dl style={{
      margin: 0,
      display: layout === 'row' ? 'grid' : 'flex',
      gridTemplateColumns: layout === 'row' ? `repeat(${items.length}, 1fr)` : undefined,
      flexDirection: layout === 'col' ? 'column' : undefined,
      gap: layout === 'col' ? 14 : 0,
      borderTop: `1px solid ${palette.rule}`,
      borderBottom: layout === 'row' ? `1px solid ${palette.rule}` : 'none',
    }}>
      {items.map((it, i) => (
        <div key={it.k} style={{
          padding: layout === 'row' ? '14px 14px' : '0',
          borderRight: layout === 'row' && i < items.length - 1 ? `1px solid ${palette.rule}` : 'none',
        }}>
          <dt style={{
            fontFamily: displayFont.stack, fontSize: 10, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: palette.inkSoft, marginBottom: 4,
          }}>{it.k}</dt>
          <dd style={{ margin: 0, fontFamily: displayFont.stack, fontWeight: 500, fontSize: 18, color: palette.ink, letterSpacing: '0.02em' }}>
            {it.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// 月名
const MONTH_LABELS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

Object.assign(window, {
  PALETTES, DISPLAY_FONTS, CARD_STYLES,
  Stars, Placeholder, Mark, MONTH_LABELS,
  SiteHeader, SiteFooter, RaceMeta,
  TERRAIN_META, TerrainIcon, TerrainTags,
  PURPOSE_META, PurposeBadge,
});
