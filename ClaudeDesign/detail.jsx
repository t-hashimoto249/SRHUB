// detail.jsx — レース詳細ページ 2案

// ─── 案A: チャプター切替型（章ごとに大きく区切る・タブナビ） ───
function RaceDetailPageA({ race, reports = [], palette, displayFont }) {
  const [section, setSection] = React.useState('overview');
  const sections = [
    { id: 'overview', label: 'Overview', n: '01' },
    { id: 'schedule', label: 'Schedule', n: '02' },
    { id: 'gear', label: 'Gear', n: '03' },
    { id: 'entry', label: 'Entry', n: '04' },
    { id: 'reports', label: 'Reports', n: '05' },
    { id: 'videos', label: 'Videos', n: '06' },
  ];

  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      {/* フルブリードヒーロー */}
      <section style={{ position: 'relative', height: 640, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${race.hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.65)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)' }} />
        <SiteHeader palette={palette} displayFont={displayFont} variant="B" current="races" />
        <div style={{ position: 'absolute', left: 48, right: 48, bottom: 48, color: '#fff' }}>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 16, opacity: 0.85 }}>
            {race.continent} · {race.country} · {MONTH_LABELS[race.start_month]} {race.duration_days}d
          </div>
          <h1 style={{ fontFamily: displayFont.stack, fontSize: 124, fontWeight: 600, margin: 0, lineHeight: 0.88, textTransform: 'uppercase', letterSpacing: '-0.015em' }}>
            {race.title_en}
          </h1>
          <div style={{ marginTop: 16, fontSize: 17, fontFamily: '"Noto Serif JP", serif', opacity: 0.95 }}>
            {race.title}
          </div>
        </div>
      </section>

      {/* メタバー */}
      <section style={{ padding: '0 48px', marginTop: -1, background: palette.paper }}>
        <RaceMeta race={race} palette={palette} displayFont={displayFont} layout="row" />
      </section>

      {/* チャプターナビ */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 5, background: palette.bg, borderBottom: `1px solid ${palette.rule}`, padding: '0 48px' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)} style={{
              padding: '20px 28px', border: 'none', background: 'transparent', cursor: 'pointer',
              borderBottom: section === s.id ? `2px solid ${palette.accent}` : '2px solid transparent',
              color: section === s.id ? palette.ink : palette.inkSoft,
              fontFamily: displayFont.stack, fontWeight: 500, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'baseline', gap: 10,
            }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: palette.inkSoft, letterSpacing: '0.1em' }}>{s.n}</span>
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* チャプター本体 */}
      <section style={{ padding: '80px 48px', minHeight: 560 }}>
        {section === 'overview' && <ChapterOverview race={race} palette={palette} displayFont={displayFont} />}
        {section === 'schedule' && <ChapterSchedule race={race} palette={palette} displayFont={displayFont} />}
        {section === 'gear' && <ChapterGear race={race} palette={palette} displayFont={displayFont} />}
        {section === 'entry' && <ChapterEntry race={race} palette={palette} displayFont={displayFont} />}
        {section === 'reports' && <ReportPurposeTabs reports={reports} palette={palette} displayFont={displayFont} />}
        {section === 'videos' && <ChapterVideos race={race} palette={palette} displayFont={displayFont} />}
      </section>

      {/* CTA */}
      <section style={{ background: palette.accentDeep, color: palette.bg, padding: '80px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.24em', opacity: 0.7, textTransform: 'uppercase', marginBottom: 12 }}>
            Official site
          </div>
          <div style={{ fontFamily: displayFont.stack, fontSize: 36, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '-0.005em' }}>
            Apply for {race.title_en}
          </div>
        </div>
        <a href={race.official_url} style={{
          padding: '18px 32px', background: palette.bg, color: palette.ink,
          fontFamily: displayFont.stack, fontWeight: 600, fontSize: 14, letterSpacing: '0.16em', textTransform: 'uppercase',
        }}>Visit Site →</a>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}

// ─── 案B: 縦スクロール・章シーケンス（映画的・大きな章タイトル） ───
function RaceDetailPageB({ race, reports = [], palette, displayFont }) {
  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      {/* ミニヘッダー */}
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="races" />

      {/* タイトル + 写真 */}
      <section style={{ padding: '64px 48px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'end' }}>
          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.24em', color: palette.inkSoft, marginBottom: 20, textTransform: 'uppercase' }}>
              ↳ Race Profile · № {String(race.distance_km).padStart(3, '0')}
            </div>
            <h1 style={{ fontFamily: displayFont.stack, fontSize: 108, fontWeight: 600, margin: 0, lineHeight: 0.86, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              {race.title_en}
            </h1>
            <div style={{ marginTop: 16, fontFamily: '"Noto Serif JP", serif', fontSize: 18, color: palette.inkSoft }}>
              {race.title} · {race.country}
            </div>
            <p style={{ marginTop: 24, fontSize: 15, lineHeight: 1.9, color: palette.ink, fontFamily: '"Noto Serif JP", serif', maxWidth: 480, textWrap: 'pretty' }}>
              {race.summary}
            </p>
          </div>
          <div style={{ aspectRatio: '4/5', backgroundImage: `url(${race.hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>
      </section>

      <section style={{ padding: '0 48px' }}>
        <RaceMeta race={race} palette={palette} displayFont={displayFont} layout="row" />
      </section>

      {/* 章 01 */}
      <BigChapter n="01" title="Overview" palette={palette} displayFont={displayFont}>
        <ChapterOverview race={race} palette={palette} displayFont={displayFont} compact />
      </BigChapter>

      {/* 章 02: スケジュール（フルブリード） */}
      <section style={{ background: palette.bgAlt, padding: '120px 48px' }}>
        <ChapterMark n="02" title="Schedule" palette={palette} displayFont={displayFont} />
        <ChapterSchedule race={race} palette={palette} displayFont={displayFont} compact />
      </section>

      <BigChapter n="03" title="Gear" palette={palette} displayFont={displayFont}>
        <ChapterGear race={race} palette={palette} displayFont={displayFont} compact />
      </BigChapter>

      {/* 章 04: エントリー（暗背景フルブリード） */}
      <section style={{ background: palette.ink, color: palette.bg, padding: '120px 48px' }}>
        <ChapterMark n="04" title="Entry" palette={{ ...palette, ink: palette.bg, inkSoft: palette.sand, rule: 'rgba(255,255,255,0.18)' }} displayFont={displayFont} />
        <ChapterEntry race={race} palette={{ ...palette, ink: palette.bg, inkSoft: palette.sand, rule: 'rgba(255,255,255,0.18)', paper: 'transparent' }} displayFont={displayFont} compact />
      </section>

      <BigChapter n="05" title="Reports" subtitle="目的別レポート" palette={palette} displayFont={displayFont}>
        <ReportPurposeTabs reports={reports} palette={palette} displayFont={displayFont} />
      </BigChapter>

      <BigChapter n="06" title="Videos" palette={palette} displayFont={displayFont}>
        <ChapterVideos race={race} palette={palette} displayFont={displayFont} compact />
      </BigChapter>

      {/* CTA */}
      <section style={{ borderTop: `1px solid ${palette.rule}`, padding: '60px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: displayFont.stack, fontSize: 28, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '-0.005em' }}>
          {race.organizer} · {race.entry_fee && `€${race.entry_fee.amount.toLocaleString()}`}
        </div>
        <a href={race.official_url} style={{
          padding: '14px 28px', background: palette.ink, color: palette.bg,
          fontFamily: displayFont.stack, fontWeight: 600, fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase',
        }}>Official Site →</a>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}

// ─── 部品: 章ヘッダ（B案） ───
function BigChapter({ n, title, subtitle, palette, displayFont, children }) {
  return (
    <section style={{ padding: '120px 48px' }}>
      <ChapterMark n={n} title={title} subtitle={subtitle} palette={palette} displayFont={displayFont} />
      {children}
    </section>
  );
}
function ChapterMark({ n, title, subtitle, palette, displayFont }) {
  return (
    <div style={{ marginBottom: 56, display: 'flex', alignItems: 'baseline', gap: 24, borderBottom: `1px solid ${palette.rule}`, paddingBottom: 20 }}>
      <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.18em', color: palette.inkSoft }}>
        Ch. {n}
      </span>
      <h2 style={{ fontFamily: displayFont.stack, fontSize: 64, fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1, color: palette.ink }}>
        {title}
      </h2>
      {subtitle && <span style={{ fontFamily: '"Noto Serif JP", serif', fontSize: 14, color: palette.inkSoft, marginLeft: 'auto' }}>{subtitle}</span>}
    </div>
  );
}

// ─── 各チャプター ───
function ChapterOverview({ race, palette, displayFont, compact }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, maxWidth: 1200 }}>
      <div>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: palette.inkSoft, marginBottom: 16 }}>
          Summary
        </div>
        <p style={{ fontFamily: '"Noto Serif JP", serif', fontSize: 18, lineHeight: 1.9, color: palette.ink, margin: 0, textWrap: 'pretty' }}>
          {race.summary}
        </p>
        <div style={{ marginTop: 32, fontSize: 14, lineHeight: 1.95, color: palette.ink }} dangerouslySetInnerHTML={{ __html: race.contentHtml }} />
      </div>
      <div>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: palette.inkSoft, marginBottom: 16 }}>
          At a glance
        </div>
        <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            ['Difficulty', <span style={{ color: palette.accent }}><Stars n={race.difficulty} /></span>],
            ['Organizer', race.organizer],
            ['Participants', race.participants_approx ? `~${race.participants_approx} people` : '—'],
            ['Entry fee', race.entry_fee ? `${race.entry_fee.currency} ${race.entry_fee.amount.toLocaleString()}` : '—'],
            ['Start month', MONTH_LABELS[race.start_month]],
            ['Support', race.support === 'self' ? 'Self-support' : 'Full-support'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, paddingBottom: 14, borderBottom: `1px solid ${palette.rule}` }}>
              <dt style={{ fontFamily: displayFont.stack, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: palette.inkSoft }}>{k}</dt>
              <dd style={{ margin: 0, fontFamily: displayFont.stack, fontSize: 18, color: palette.ink }}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function ChapterSchedule({ race, palette, displayFont }) {
  const max = Math.max(...race.schedule.map(s => parseInt(s.description)));
  return (
    <div style={{ maxWidth: 1100 }}>
      {race.schedule.map(s => {
        const km = parseInt(s.description) || 0;
        return (
          <div key={s.day} style={{ display: 'grid', gridTemplateColumns: '120px 100px 1fr', gap: 24, padding: '28px 0', borderBottom: `1px solid ${palette.rule}`, alignItems: 'center' }}>
            <div style={{ fontFamily: displayFont.stack, fontSize: 56, fontWeight: 600, color: palette.accent, lineHeight: 1, letterSpacing: '-0.02em' }}>
              D<span style={{ fontSize: 36 }}>{s.day}</span>
            </div>
            <div>
              <div style={{ fontFamily: displayFont.stack, fontSize: 28, fontWeight: 500, color: palette.ink }}>
                {km}<span style={{ fontSize: 12, color: palette.inkSoft, letterSpacing: '0.1em' }}>&nbsp;KM</span>
              </div>
              <div style={{ height: 4, background: palette.rule, marginTop: 6, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, width: `${(km / max) * 100}%`, background: palette.accent }} />
              </div>
            </div>
            <div style={{ fontSize: 15, color: palette.ink, lineHeight: 1.7 }}>
              {s.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChapterGear({ race, palette, displayFont }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, maxWidth: 1100 }}>
      {race.gear.map((g, i) => {
        const isReq = g.startsWith('必携');
        return (
          <div key={i} style={{
            padding: 24, border: `1px solid ${palette.rule}`,
            background: isReq ? palette.paper : 'transparent',
            borderLeft: `3px solid ${isReq ? palette.accent : palette.rule}`,
          }}>
            <div style={{ fontFamily: displayFont.stack, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: isReq ? palette.accent : palette.inkSoft, marginBottom: 8 }}>
              {isReq ? 'Mandatory' : 'Recommended'}
            </div>
            <div style={{ fontSize: 15, color: palette.ink, lineHeight: 1.7 }}>
              {g.replace(/^(必携|推奨)：/, '')}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChapterEntry({ race, palette, displayFont }) {
  const steps = race.entry_flow.split('\n').filter(Boolean).map(l => l.replace(/^\d+\.\s*/, ''));
  return (
    <div style={{ maxWidth: 1100 }}>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        {steps.map((step, i) => (
          <li key={i} style={{ borderTop: `2px solid ${palette.accent}`, paddingTop: 20 }}>
            <div style={{ fontFamily: displayFont.stack, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: palette.inkSoft, marginBottom: 14 }}>
              Step {String(i + 1).padStart(2, '0')}
            </div>
            <div style={{ fontFamily: displayFont.stack, fontSize: 22, fontWeight: 500, color: palette.ink, lineHeight: 1.4 }}>
              {step}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ChapterVideos({ race, palette, displayFont }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 1200 }}>
      {race.videos.map(v => (
        <article key={v.id} style={{ cursor: 'pointer' }}>
          <div style={{ position: 'relative', aspectRatio: '16/9', background: palette.ink, overflow: 'hidden' }}>
            <Placeholder label={`youtube · ${v.id}`} ratio="16/9" tone="dark" />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', border: '1.5px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              }}>▶</div>
            </div>
          </div>
          <h4 style={{ fontFamily: '"Noto Serif JP", serif', fontSize: 17, fontWeight: 600, margin: '14px 0 0', color: palette.ink, lineHeight: 1.5 }}>
            {v.title}
          </h4>
        </article>
      ))}
    </div>
  );
}

window.RaceDetailPageA = RaceDetailPageA;
window.RaceDetailPageB = RaceDetailPageB;
