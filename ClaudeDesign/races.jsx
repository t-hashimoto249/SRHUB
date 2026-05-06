// races.jsx — レース一覧ページ 2案

const CONTINENTS = ['すべて', 'アフリカ', 'アジア', 'ヨーロッパ', '北アメリカ', '南アメリカ', 'オセアニア', '南極'];
const TERRAINS = ['砂漠', '山岳', '極地', 'ジャングル'];

// ─── 案A: 編集的な大判オーバーレイ・グリッド + サイドフィルタ ───
function RaceListPageA({ races, palette, displayFont, cardStyle = 'overlay' }) {
  const [continent, setCont] = React.useState('すべて');
  const [difficulty, setDiff] = React.useState(0);
  const [terrains, setTerrains] = React.useState([]);

  const filtered = races.filter(r => {
    if (continent !== 'すべて' && r.continent !== continent) return false;
    if (difficulty && r.difficulty < difficulty) return false;
    if (terrains.length && !terrains.some(t => r.terrain.includes(t))) return false;
    return true;
  });

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="races" />

      {/* タイトル */}
      <section style={{ padding: '64px 48px 24px' }}>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.24em', color: palette.inkSoft, marginBottom: 16, textTransform: 'uppercase' }}>
          Index · {filtered.length} of {races.length} races
        </div>
        <h1 style={{ fontFamily: displayFont.stack, fontSize: 92, fontWeight: 600, margin: 0, lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
          All Races
        </h1>
      </section>

      {/* 世界地図ヒーロー */}
      <section style={{ padding: '0 48px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.24em', color: palette.inkSoft, textTransform: 'uppercase' }}>
              §02 · Atlas
            </div>
            <h2 style={{ fontFamily: displayFont.stack, fontSize: 28, fontWeight: 600, margin: '8px 0 0', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              世界のレースを地図で探す
            </h2>
          </div>
          <div style={{ fontSize: 11, color: palette.inkSoft, fontFamily: '"Noto Serif JP", serif' }}>
            ピンにカーソルを合わせると概要 · クリックで詳細へ
          </div>
        </div>
        <WorldMap races={filtered} palette={palette} displayFont={displayFont} height={500} />
      </section>

      {/* メイン: サイドフィルタ + グリッド */}
      <section style={{ padding: '0 48px 80px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 48 }}>
        {/* サイドバー */}
        <aside style={{ position: 'sticky', top: 24, alignSelf: 'start', borderTop: `1px solid ${palette.rule}`, paddingTop: 20 }}>
          <FilterGroup label="Continent" palette={palette} displayFont={displayFont}>
            {CONTINENTS.map(c => (
              <FilterChip key={c} label={c} active={continent === c} onClick={() => setCont(c)} palette={palette} displayFont={displayFont} />
            ))}
          </FilterGroup>
          <FilterGroup label="Terrain" palette={palette} displayFont={displayFont}>
            {TERRAINS.map(t => (
              <FilterChip key={t} label={t} active={terrains.includes(t)}
                onClick={() => setTerrains(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t])}
                palette={palette} displayFont={displayFont} />
            ))}
          </FilterGroup>
          <FilterGroup label="Min difficulty" palette={palette} displayFont={displayFont}>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setDiff(n)} style={{
                  flex: 1, padding: '6px 0', fontFamily: displayFont.stack, fontWeight: 600,
                  fontSize: 13, border: `1px solid ${palette.rule}`,
                  background: difficulty === n ? palette.ink : 'transparent',
                  color: difficulty === n ? palette.paper : palette.ink, cursor: 'pointer',
                }}>{n === 0 ? '—' : n}</button>
              ))}
            </div>
          </FilterGroup>
        </aside>

        {/* グリッド */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {filtered.map((r, i) => (
            <RaceCard key={r.slug} race={r} palette={palette} displayFont={displayFont} style={cardStyle} index={i} />
          ))}
          {!filtered.length && (
            <div style={{ gridColumn: 'span 2', padding: '80px 0', textAlign: 'center', color: palette.inkSoft, fontSize: 14 }}>
              該当するレースがありません
            </div>
          )}
        </div>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}

// ─── 案B: テーブル/インデックス型（情報密度高め）+ 上部フィルタバー ───
function RaceListPageB({ races, palette, displayFont }) {
  const [sort, setSort] = React.useState('difficulty');
  const [continent, setCont] = React.useState('すべて');

  const filtered = races
    .filter(r => continent === 'すべて' || r.continent === continent)
    .sort((a, b) => sort === 'difficulty' ? b.difficulty - a.difficulty : sort === 'distance' ? b.distance_km - a.distance_km : a.start_month - b.start_month);

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="races" />

      <section style={{ padding: '64px 48px 24px', borderBottom: `1px solid ${palette.rule}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{ fontFamily: displayFont.stack, fontSize: 80, fontWeight: 600, margin: 0, textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.01em' }}>
            Race Index
          </h1>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.16em', color: palette.inkSoft }}>
            UPDATED 2026.04 · {filtered.length} ENTRIES
          </div>
        </div>
      </section>

      {/* フィルタバー */}
      <section style={{ padding: '20px 48px', borderBottom: `1px solid ${palette.rule}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: palette.paper, position: 'sticky', top: 0, zIndex: 5 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CONTINENTS.map(c => (
            <FilterChip key={c} label={c} active={continent === c} onClick={() => setCont(c)} palette={palette} displayFont={displayFont} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontFamily: displayFont.stack, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: palette.inkSoft }}>Sort</span>
          {[['difficulty', 'Difficulty'], ['distance', 'Distance'], ['month', 'Month']].map(([k, l]) => (
            <button key={k} onClick={() => setSort(k)} style={{
              fontFamily: displayFont.stack, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
              background: 'transparent', border: 'none', color: sort === k ? palette.ink : palette.inkSoft,
              borderBottom: sort === k ? `1.5px solid ${palette.accent}` : '1.5px solid transparent', paddingBottom: 2, cursor: 'pointer',
            }}>{l}</button>
          ))}
        </div>
      </section>

      {/* リスト */}
      <section style={{ padding: '0 48px 80px' }}>
        {filtered.map((r, i) => (
          <article key={r.slug} style={{
            display: 'grid', gridTemplateColumns: '60px 280px 1fr 120px 120px 100px',
            gap: 32, padding: '24px 0', alignItems: 'center',
            borderBottom: `1px solid ${palette.rule}`, cursor: 'pointer',
          }}>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: palette.inkSoft, letterSpacing: '0.1em' }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div style={{ aspectRatio: '4/3', backgroundImage: `url(${r.hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div>
              <div style={{ fontFamily: displayFont.stack, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: palette.inkSoft, marginBottom: 4 }}>
                {r.country} · {r.continent}
              </div>
              <h3 style={{ fontFamily: displayFont.stack, fontSize: 32, fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.005em' }}>
                {r.title_en}
              </h3>
              <div style={{ fontSize: 12, color: palette.inkSoft, marginTop: 4 }}>{r.title}</div>
            </div>
            <div style={{ fontFamily: displayFont.stack, fontSize: 22, fontWeight: 500 }}>
              {r.distance_km}<span style={{ fontSize: 11, color: palette.inkSoft, letterSpacing: '0.1em' }}>&nbsp;KM</span>
            </div>
            <div style={{ fontSize: 12, color: palette.inkSoft }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {r.terrain.map(t => <TerrainIcon key={t} terrain={t} size={14} />)}
              </div>
              <div>{MONTH_LABELS[r.start_month]} · {r.duration_days}d</div>
            </div>
            <div style={{ color: palette.accent, fontSize: 16 }}>
              <Stars n={r.difficulty} />
            </div>
          </article>
        ))}
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}

// ─── 部品: フィルタ ───
function FilterGroup({ label, palette, displayFont, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: displayFont.stack, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: palette.inkSoft, marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{children}</div>
    </div>
  );
}

function FilterChip({ label, active, onClick, palette, displayFont }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 12px', fontSize: 12, fontFamily: displayFont.stack, letterSpacing: '0.04em',
      border: `1px solid ${active ? palette.ink : palette.rule}`,
      background: active ? palette.ink : 'transparent',
      color: active ? palette.paper : palette.ink,
      cursor: 'pointer', borderRadius: 0,
    }}>{label}</button>
  );
}

// ─── 部品: RaceCard (3スタイル) ───
function RaceCard({ race, palette, displayFont, style = 'overlay', index }) {
  if (style === 'split') {
    return (
      <article style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', background: palette.paper, border: `1px solid ${palette.rule}` }}>
        <div style={{ position: 'relative', aspectRatio: '4/3', backgroundImage: `url(${race.hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 4 }}>
            {race.terrain.map(t => <TerrainIcon key={t} terrain={t} size={20} />)}
          </div>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.18em', color: palette.inkSoft, marginBottom: 8, textTransform: 'uppercase' }}>
            {race.country} · {MONTH_LABELS[race.start_month]}
          </div>
          <h3 style={{ fontFamily: displayFont.stack, fontSize: 28, fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.005em' }}>
            {race.title_en}
          </h3>
          <div style={{ fontSize: 13, color: palette.inkSoft, marginTop: 4, marginBottom: 14 }}>{race.title}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${palette.rule}`, paddingTop: 12 }}>
            <div style={{ fontFamily: displayFont.stack, fontSize: 15 }}>
              <span style={{ fontWeight: 600 }}>{race.distance_km}</span>
              <span style={{ fontSize: 11, color: palette.inkSoft, letterSpacing: '0.1em' }}>&nbsp;KM · {race.stages}d</span>
            </div>
            <div style={{ color: palette.accent, fontSize: 14 }}><Stars n={race.difficulty} /></div>
          </div>
        </div>
      </article>
    );
  }
  if (style === 'minimal') {
    return (
      <article style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', borderTop: `1px solid ${palette.rule}`, paddingTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.18em', color: palette.inkSoft, textTransform: 'uppercase' }}>
            № {String(index + 1).padStart(2, '0')} · {race.continent}
          </div>
          <div style={{ color: palette.accent, fontSize: 13 }}><Stars n={race.difficulty} /></div>
        </div>
        <h3 style={{ fontFamily: displayFont.stack, fontSize: 36, fontWeight: 600, margin: 0, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
          {race.title_en}
        </h3>
        <div style={{ fontSize: 13, color: palette.inkSoft, marginTop: 6, marginBottom: 16 }}>{race.title} · {race.country}</div>
        <div style={{ aspectRatio: '16/9', backgroundImage: `url(${race.hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ display: 'flex', gap: 18, marginTop: 14, fontSize: 12, color: palette.inkSoft, alignItems: 'center' }}>
          <span>{race.distance_km}km</span>
          <span>{race.stages} stages</span>
          <span style={{ display: 'inline-flex', gap: 4 }}>
            {race.terrain.map(t => <TerrainIcon key={t} terrain={t} size={14} />)}
          </span>
        </div>
      </article>
    );
  }
  // overlay (default)
  return (
    <article style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden', aspectRatio: '4/5' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${race.hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(0.92)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 25%, transparent 55%, rgba(0,0,0,0.85) 100%)' }} />
      <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.92)', fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
        <span>№ {String(index + 1).padStart(3, '0')}</span>
        <span>{race.continent}</span>
      </div>
      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          {race.terrain.map(t => <TerrainIcon key={t} terrain={t} size={14} />)}
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.85 }}>
            {race.country} · {MONTH_LABELS[race.start_month]}
          </span>
        </div>
        <h3 style={{ fontFamily: displayFont.stack, fontSize: 36, fontWeight: 600, margin: 0, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
          {race.title_en}
        </h3>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>{race.title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.25)' }}>
          <div style={{ fontFamily: displayFont.stack, fontSize: 15 }}>
            <span style={{ fontWeight: 600 }}>{race.distance_km}</span>
            <span style={{ fontSize: 11, opacity: 0.7, letterSpacing: '0.1em' }}>&nbsp;KM · {race.stages}d</span>
          </div>
          <Stars n={race.difficulty} color={palette.sand} />
        </div>
      </div>
    </article>
  );
}

// ─── ミニ大陸マップ（極シンプル抽象表現） ───
function MiniMap({ races, active, palette }) {
  // SVG世界地図の超簡略化版（円配置）
  const continents = [
    { id: 'アジア', x: 75, y: 38, label: 'AS' },
    { id: 'ヨーロッパ', x: 52, y: 30, label: 'EU' },
    { id: 'アフリカ', x: 53, y: 58, label: 'AF' },
    { id: '北アメリカ', x: 22, y: 35, label: 'NA' },
    { id: '南アメリカ', x: 32, y: 70, label: 'SA' },
    { id: 'オセアニア', x: 85, y: 75, label: 'OC' },
    { id: '南極', x: 50, y: 92, label: 'AN' },
  ];
  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: 140 }}>
      <rect width="100" height="100" fill={palette.bg} />
      {continents.map(c => {
        const count = races.filter(r => r.continent === c.id).length;
        const isActive = active === c.id;
        return (
          <g key={c.id}>
            <circle cx={c.x} cy={c.y} r={3 + count * 1.2}
              fill={isActive ? palette.accent : count > 0 ? palette.accentDeep : 'transparent'}
              stroke={count > 0 ? 'transparent' : palette.rule} strokeWidth="0.5" opacity={count > 0 ? 0.85 : 0.5} />
            <text x={c.x} y={c.y + 1.2} fontSize="2.6" textAnchor="middle"
              fontFamily="ui-monospace, monospace" fill={count > 0 ? palette.paper : palette.inkSoft}
              style={{ letterSpacing: '0.05em' }}>{c.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

window.RaceListPageA = RaceListPageA;
window.RaceListPageB = RaceListPageB;
