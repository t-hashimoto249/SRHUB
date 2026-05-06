// home.jsx — トップページ 2案

// ─── 案A: シネマティック・ヒーロー（動画背景＋静的タイポ・極小UI） ───
function HomePageA({ races, palette, displayFont }) {
  const featured = races.slice(0, 3);
  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      {/* ヒーロー：動画背景 */}
      <section style={{ position: 'relative', height: 720, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${featured[0].hero_image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.55) saturate(0.85)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.5) 100%)' }} />
        {/* 動画再生インジケーター */}
        <div style={{ position: 'absolute', top: 24, right: 32, display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.85)', fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.15em' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E55', animation: 'pulse 2s infinite' }} />
          LIVE FOOTAGE · MDS 2024
        </div>

        <SiteHeader palette={palette} displayFont={displayFont} variant="B" current="home" />

        <div style={{ position: 'absolute', left: 48, bottom: 80, right: 48, color: '#fff' }}>
          <div style={{ fontFamily: displayFont.stack, fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 18 }}>
            Vol. 12 · 2026
          </div>
          <h1 style={{
            fontFamily: displayFont.stack, fontWeight: 600, fontSize: 112, lineHeight: 0.92,
            margin: 0, letterSpacing: '-0.01em', textTransform: 'uppercase', maxWidth: 1000,
          }}>
            Days on foot,<br/>
            <span style={{ color: palette.accent }}>across the unknown.</span>
          </h1>
          <p style={{ marginTop: 28, maxWidth: 540, fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.88)' }}>
            数日かけて走り抜くステージレース。砂漠、山岳、極地、ジャングル——世界中のフィールドで開催されている本気のレースを、完走者の言葉と実装的な情報で記録します。
          </p>
        </div>

        {/* 下端メタ */}
        <div style={{ position: 'absolute', left: 48, right: 48, bottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.7)', fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.18em' }}>
          <span>SCROLL TO EXPLORE ↓</span>
          <span>{featured[0].title_en} · {featured[0].country.toUpperCase()}</span>
        </div>
      </section>

      {/* 引用ブロック・フルブリード */}
      <section style={{ padding: '120px 48px', textAlign: 'center', background: palette.bgAlt }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <div style={{ fontFamily: displayFont.stack, fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: palette.inkSoft, marginBottom: 28 }}>
            From the field — Sahara, 2024
          </div>
          <p style={{
            fontFamily: '"Noto Serif JP", serif', fontSize: 38, lineHeight: 1.5,
            color: palette.ink, margin: 0, letterSpacing: '0.02em', textWrap: 'pretty',
          }}>
            「4日目の夜、砂丘の上で星を見ていた。<br/>そこにいたのは、走る前の自分ではなかった」
          </p>
          <div style={{ marginTop: 32, fontSize: 13, color: palette.inkSoft, letterSpacing: '0.04em' }}>
            — 田中健太 · MDS 完走3回
          </div>
        </div>
      </section>

      {/* ピックアップレース */}
      <section style={{ padding: '100px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 48 }}>
          <h2 style={{ fontFamily: displayFont.stack, fontSize: 48, fontWeight: 600, margin: 0, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
            Featured Races
          </h2>
          <a style={{ fontFamily: displayFont.stack, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: palette.accentDeep, borderBottom: `1px solid ${palette.accentDeep}`, paddingBottom: 2 }}>
            View All →
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 24 }}>
          {featured.map((r, i) => (
            <FeatureCard key={r.slug} race={r} palette={palette} displayFont={displayFont} large={i === 0} />
          ))}
        </div>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}

function FeatureCard({ race, palette, displayFont, large }) {
  return (
    <article style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: large ? '4/5' : '1/1' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${race.hero_image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'saturate(0.9)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7) 100%)' }} />
        <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.16em', color: '#fff', textTransform: 'uppercase' }}>
          № {String(race.distance_km).padStart(3, '0')} · {race.continent}
        </div>
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16, color: '#fff' }}>
          <div style={{ fontFamily: displayFont.stack, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 4 }}>
            {race.country}
          </div>
          <h3 style={{ fontFamily: displayFont.stack, fontWeight: 600, fontSize: large ? 38 : 24, margin: 0, lineHeight: 1.05, textTransform: 'uppercase', letterSpacing: '-0.005em' }}>
            {race.title_en}
          </h3>
        </div>
      </div>
      <div style={{ paddingTop: 16, color: palette.ink }}>
        <div style={{ fontSize: 13, color: palette.inkSoft, marginBottom: 6 }}>{race.title}</div>
        {large && <p style={{ fontSize: 13, lineHeight: 1.7, color: palette.inkSoft, margin: 0 }}>{race.summary}</p>}
      </div>
    </article>
  );
}

// ─── 案B: 映画的グリッド・分割（複数レースを同時提示） ───
function HomePageB({ races, palette, displayFont }) {
  const featured = races.slice(0, 4);
  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="home" />

      {/* タイトルブロック */}
      <section style={{ padding: '80px 48px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'end' }}>
          <div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.24em', color: palette.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>
              Issue 12 / Spring 2026
            </div>
            <h1 style={{
              fontFamily: displayFont.stack, fontSize: 132, lineHeight: 0.86, margin: 0,
              fontWeight: 600, letterSpacing: '-0.02em', textTransform: 'uppercase',
            }}>
              Several<br/>
              <span style={{ color: palette.accent }}>Days</span><br/>
              On Foot.
            </h1>
          </div>
          <div style={{ paddingBottom: 12 }}>
            <p style={{ fontFamily: '"Noto Serif JP", serif', fontSize: 17, lineHeight: 2, color: palette.ink, margin: 0, textWrap: 'pretty' }}>
              一日では終わらない。数日かけて走り続ける。砂漠から極地まで、世界中で開催されているステージレースの中から、日本人ランナーが知るべきレースを集め、参加レポートと装備の知見を共有する場所です。集め、参加レポートと装備の知見を共有する場所です。
            </p>
            <div style={{ marginTop: 32, display: 'flex', gap: 24 }}>
              <div>
                <div style={{ fontFamily: displayFont.stack, fontSize: 36, fontWeight: 600, color: palette.accentDeep }}>32</div>
                <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: palette.inkSoft }}>Races covered</div>
              </div>
              <div>
                <div style={{ fontFamily: displayFont.stack, fontSize: 36, fontWeight: 600, color: palette.accentDeep }}>148</div>
                <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: palette.inkSoft }}>Reports</div>
              </div>
              <div>
                <div style={{ fontFamily: displayFont.stack, fontSize: 36, fontWeight: 600, color: palette.accentDeep }}>7</div>
                <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: palette.inkSoft }}>Continents</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4分割ヒーロー */}
      <section style={{ padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '420px 240px', gap: 12, height: 672 }}>
          {/* 大 */}
          <div style={{ gridRow: 'span 2', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${featured[0].hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%)' }} />
            <div style={{ position: 'absolute', top: 20, left: 24, fontFamily: 'ui-monospace, monospace', fontSize: 10, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.18em' }}>
              ▶ PLAYING · 02:14 / 04:38
            </div>
            <div style={{ position: 'absolute', left: 24, right: 24, bottom: 28, color: '#fff' }}>
              <div style={{ fontFamily: displayFont.stack, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 8 }}>
                Cover Race · {featured[0].country}
              </div>
              <h2 style={{ fontFamily: displayFont.stack, fontSize: 64, fontWeight: 600, margin: 0, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.01em' }}>
                {featured[0].title_en}
              </h2>
              <p style={{ fontSize: 13, marginTop: 16, maxWidth: 480, lineHeight: 1.7, opacity: 0.92 }}>
                {featured[0].summary}
              </p>
            </div>
          </div>
          {[featured[1], featured[2]].map(r => (
            <div key={r.slug} style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${r.hero_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%)' }} />
              <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, color: '#fff' }}>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.16em', opacity: 0.8, marginBottom: 4 }}>
                  {r.continent}
                </div>
                <div style={{ fontFamily: displayFont.stack, fontSize: 22, fontWeight: 600, textTransform: 'uppercase', lineHeight: 1.1 }}>
                  {r.title_en}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 編集後記風の記事プレビュー */}
      <section style={{ padding: '100px 48px' }}>
        <div style={{ borderTop: `1px solid ${palette.rule}`, paddingTop: 32, display: 'grid', gridTemplateColumns: '180px 1fr 1fr 1fr', gap: 32 }}>
          <div>
            <div style={{ fontFamily: displayFont.stack, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: palette.inkSoft }}>
              From<br/>The<br/>Field
            </div>
          </div>
          {[
            { tag: 'Gear', title: '装備 20 選——5度目の参加で辿り着いた答え', author: '佐藤 麻衣', img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80' },
            { tag: 'Report', title: 'サハラの夜、シュラフの中で考えたこと', author: '田中 健太', img: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=800&q=80' },
            { tag: 'Interview', title: '招待制レースを走るということ', author: '編集部', img: 'https://images.unsplash.com/photo-1517783999520-f068d7431a60?w=800&q=80' },
          ].map(p => (
            <article key={p.title}>
              <div style={{ aspectRatio: '4/3', backgroundImage: `url(${p.img})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 14 }} />
              <div style={{ fontFamily: displayFont.stack, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: palette.accentDeep, marginBottom: 8 }}>
                {p.tag}
              </div>
              <h3 style={{ fontFamily: '"Noto Serif JP", serif', fontSize: 20, lineHeight: 1.4, margin: 0, color: palette.ink, fontWeight: 600 }}>
                {p.title}
              </h3>
              <div style={{ marginTop: 12, fontSize: 12, color: palette.inkSoft }}>
                {p.author}
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}

window.HomePageA = HomePageA;
window.HomePageB = HomePageB;
