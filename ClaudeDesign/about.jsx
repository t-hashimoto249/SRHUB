// about.jsx — Aboutページ

function AboutPage({ palette, displayFont, contributors }) {
  return (
    <div style={{ background: palette.bg, color: palette.ink, fontFamily: '"Noto Sans JP", sans-serif' }}>
      <SiteHeader palette={palette} displayFont={displayFont} variant="A" current="about" />

      {/* Hero copy */}
      <section style={{ padding: '120px 48px 80px', maxWidth: 1100 }}>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.24em', color: palette.inkSoft, marginBottom: 24, textTransform: 'uppercase' }}>
          About this site
        </div>
        <h1 style={{ fontFamily: displayFont.stack, fontSize: 96, fontWeight: 600, margin: 0, lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: '-0.015em' }}>
          For those who<br/>
          <span style={{ color: palette.accent }}>run further<br/>than the finish.</span>
        </h1>
      </section>

      {/* Mission */}
      <section style={{ padding: '0 48px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 80, borderTop: `1px solid ${palette.rule}`, paddingTop: 48 }}>
          <div style={{ fontFamily: displayFont.stack, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: palette.inkSoft }}>
            Mission
          </div>
          <div>
            <p style={{ fontFamily: '"Noto Serif JP", serif', fontSize: 22, lineHeight: 1.85, margin: 0, color: palette.ink, textWrap: 'pretty' }}>
              ステージレースは、一晩では理解できない競技です。装備、エントリーの段取り、現地の気候、過去の参加者の声——必要な情報は分散しています。
            </p>
            <p style={{ fontFamily: '"Noto Serif JP", serif', fontSize: 17, lineHeight: 2, marginTop: 24, color: palette.inkSoft, textWrap: 'pretty' }}>
              このサイトは、世界中のステージレースに関する一次情報を、日本語で集約することを目的としています。完走者のレポート、装備リスト、エントリーまでの実装的な道筋。営利を目的とせず、走る人たちの記録によって育てられる場所です。
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section style={{ background: palette.bgAlt, padding: '100px 48px' }}>
        <div style={{ fontFamily: displayFont.stack, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: palette.inkSoft, marginBottom: 48 }}>
          Editorial Principles
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
          {[
            { n: '01', t: 'Primary sources only', d: '主催者の公式情報と、実際に走った人の言葉のみを扱います。要約された二次情報は載せません。' },
            { n: '02', t: 'Practical over poetic', d: '装備の重さ、レースの距離、現地の気温——意思決定に使える具体的な数字を優先します。' },
            { n: '03', t: 'No sponsorship', d: 'ブランドや主催者から金銭を受け取りません。レースの紹介順序や評価は編集判断のみで決めます。' },
          ].map(p => (
            <div key={p.n} style={{ borderTop: `2px solid ${palette.accent}`, paddingTop: 20 }}>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.18em', color: palette.inkSoft, marginBottom: 16 }}>{p.n}</div>
              <h3 style={{ fontFamily: displayFont.stack, fontSize: 26, fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.005em', lineHeight: 1.15 }}>{p.t}</h3>
              <p style={{ marginTop: 14, fontSize: 14, lineHeight: 1.85, color: palette.inkSoft }}>{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contributors */}
      <section style={{ padding: '120px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 48, borderBottom: `1px solid ${palette.rule}`, paddingBottom: 16 }}>
          <h2 style={{ fontFamily: displayFont.stack, fontSize: 56, fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
            Contributors
          </h2>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: palette.inkSoft, letterSpacing: '0.16em' }}>
            {contributors.length} runners · 2026
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 48 }}>
          {contributors.map(c => (
            <article key={c.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24, alignItems: 'start' }}>
              <div style={{ width: 120, height: 120, backgroundImage: `url(${c.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '50%', filter: 'grayscale(0.4)' }} />
              <div>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, letterSpacing: '0.2em', color: palette.inkSoft, textTransform: 'uppercase', marginBottom: 6 }}>
                  @{c.id}
                </div>
                <h3 style={{ fontFamily: displayFont.stack, fontSize: 28, fontWeight: 600, margin: 0, color: palette.ink }}>
                  {c.name}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: palette.inkSoft, marginTop: 10 }}>{c.bio}</p>
                <a style={{ fontFamily: displayFont.stack, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: palette.accentDeep, borderBottom: `1px solid ${palette.accentDeep}`, paddingBottom: 1 }}>
                  {c.contact_method} ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Contribute CTA */}
      <section style={{ background: palette.ink, color: palette.bg, padding: '80px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: displayFont.stack, fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 12 }}>
            Have you run one?
          </div>
          <div style={{ fontFamily: displayFont.stack, fontSize: 48, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
            Share your report.
          </div>
        </div>
        <a style={{ padding: '16px 28px', border: `1px solid ${palette.bg}`, fontFamily: displayFont.stack, fontWeight: 600, fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
          Contact Editorial →
        </a>
      </section>

      <SiteFooter palette={palette} displayFont={displayFont} />
    </div>
  );
}

window.AboutPage = AboutPage;
