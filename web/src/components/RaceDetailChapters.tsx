"use client";

import { useState } from "react";
import type { Race, Report } from "@/types/content";
import { MONTH_LABELS, type Palette, type DisplayFont } from "./design-tokens";
import { Stars, Placeholder } from "./Brand";
import { ReportPurposeTabs } from "./ReportPurposeTabs";

type SectionId = "overview" | "schedule" | "gear" | "entry" | "reports" | "videos";

export function RaceDetailChapters({
  race,
  reports,
  palette,
  displayFont,
}: {
  race: Race;
  reports: Report[];
  palette: Palette;
  displayFont: DisplayFont;
}) {
  const [section, setSection] = useState<SectionId>("overview");
  const sections: { id: SectionId; label: string; n: string; available: boolean }[] = [
    { id: "overview", label: "Overview", n: "01", available: true },
    { id: "schedule", label: "Schedule", n: "02", available: !!race.schedule?.length },
    { id: "gear", label: "Gear", n: "03", available: !!race.gear?.length },
    { id: "entry", label: "Entry", n: "04", available: !!race.entry_flow },
    { id: "reports", label: "Reports", n: "05", available: true },
    { id: "videos", label: "Videos", n: "06", available: !!race.videos?.length },
  ];

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          background: palette.bg,
          borderBottom: `1px solid ${palette.rule}`,
          padding: "0 48px",
        }}
      >
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {sections.map((s) => {
            const disabled = !s.available;
            return (
              <button
                key={s.id}
                onClick={() => !disabled && setSection(s.id)}
                disabled={disabled}
                style={{
                  padding: "20px 28px",
                  border: "none",
                  background: "transparent",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.35 : 1,
                  borderBottom:
                    section === s.id ? `2px solid ${palette.accent}` : "2px solid transparent",
                  color: section === s.id ? palette.ink : palette.inkSoft,
                  fontFamily: displayFont.stack,
                  fontWeight: 500,
                  fontSize: 14,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 10,
                    color: palette.inkSoft,
                    letterSpacing: "0.1em",
                  }}
                >
                  {s.n}
                </span>
                {s.label}
              </button>
            );
          })}
        </div>
      </nav>

      <section style={{ padding: "80px 48px", minHeight: 560 }}>
        {section === "overview" && <ChapterOverview race={race} palette={palette} displayFont={displayFont} />}
        {section === "schedule" && <ChapterSchedule race={race} palette={palette} displayFont={displayFont} />}
        {section === "gear" && <ChapterGear race={race} palette={palette} displayFont={displayFont} />}
        {section === "entry" && <ChapterEntry race={race} palette={palette} displayFont={displayFont} />}
        {section === "reports" && (
          <ReportPurposeTabs reports={reports} palette={palette} displayFont={displayFont} />
        )}
        {section === "videos" && <ChapterVideos race={race} palette={palette} />}
      </section>
    </>
  );
}

function ChapterOverview({
  race,
  palette,
  displayFont,
}: {
  race: Race;
  palette: Palette;
  displayFont: DisplayFont;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, maxWidth: 1200 }}>
      <div>
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: palette.inkSoft,
            marginBottom: 16,
          }}
        >
          Summary
        </div>
        <p
          style={{
            fontFamily: '"Noto Serif JP", serif',
            fontSize: 18,
            lineHeight: 1.9,
            color: palette.ink,
            margin: 0,
          }}
        >
          {race.summary}
        </p>
        <div
          style={{ marginTop: 32, fontSize: 14, lineHeight: 1.95, color: palette.ink }}
          dangerouslySetInnerHTML={{ __html: race.contentHtml }}
        />
      </div>
      <div>
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: palette.inkSoft,
            marginBottom: 16,
          }}
        >
          At a glance
        </div>
        <dl style={{ margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          {([
            ["Difficulty", <span key="d" style={{ color: palette.accent }}><Stars n={race.difficulty} /></span>],
            ["Organizer", race.organizer],
            ["Participants", race.participants_approx ? `~${race.participants_approx} people` : "—"],
            [
              "Entry fee",
              race.entry_fee ? `${race.entry_fee.currency} ${race.entry_fee.amount.toLocaleString()}` : "—",
            ],
            ["Start month", MONTH_LABELS[race.start_month]],
            ["Support", race.support === "self" ? "Self-support" : "Full-support"],
          ] as const).map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr",
                gap: 16,
                paddingBottom: 14,
                borderBottom: `1px solid ${palette.rule}`,
              }}
            >
              <dt
                style={{
                  fontFamily: displayFont.stack,
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: palette.inkSoft,
                }}
              >
                {k}
              </dt>
              <dd style={{ margin: 0, fontFamily: displayFont.stack, fontSize: 18, color: palette.ink }}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function ChapterSchedule({
  race,
  palette,
  displayFont,
}: {
  race: Race;
  palette: Palette;
  displayFont: DisplayFont;
}) {
  if (!race.schedule?.length) return null;
  const kms = race.schedule.map((s) => parseInt(s.description, 10)).filter((n) => !Number.isNaN(n));
  const max = kms.length ? Math.max(...kms) : 0;
  return (
    <div style={{ maxWidth: 1100 }}>
      {race.schedule.map((s) => {
        const km = parseInt(s.description, 10) || 0;
        return (
          <div
            key={s.day}
            style={{
              display: "grid",
              gridTemplateColumns: "120px 100px 1fr",
              gap: 24,
              padding: "28px 0",
              borderBottom: `1px solid ${palette.rule}`,
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontFamily: displayFont.stack,
                fontSize: 56,
                fontWeight: 600,
                color: palette.accent,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              D<span style={{ fontSize: 36 }}>{s.day}</span>
            </div>
            <div>
              {km > 0 ? (
                <>
                  <div style={{ fontFamily: displayFont.stack, fontSize: 28, fontWeight: 500, color: palette.ink }}>
                    {km}
                    <span style={{ fontSize: 12, color: palette.inkSoft, letterSpacing: "0.1em" }}>&nbsp;KM</span>
                  </div>
                  <div style={{ height: 4, background: palette.rule, marginTop: 6, position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: max > 0 ? `${(km / max) * 100}%` : 0,
                        background: palette.accent,
                      }}
                    />
                  </div>
                </>
              ) : (
                <div style={{ fontFamily: displayFont.stack, fontSize: 18, color: palette.inkSoft }}>—</div>
              )}
            </div>
            <div style={{ fontSize: 15, color: palette.ink, lineHeight: 1.7 }}>{s.description}</div>
          </div>
        );
      })}
    </div>
  );
}

function ChapterGear({
  race,
  palette,
  displayFont,
}: {
  race: Race;
  palette: Palette;
  displayFont: DisplayFont;
}) {
  if (!race.gear?.length) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, maxWidth: 1100 }}>
      {race.gear.map((g, i) => {
        const isReq = !!g.mandatory;
        return (
          <div
            key={i}
            style={{
              padding: 24,
              border: `1px solid ${palette.rule}`,
              background: isReq ? palette.paper : "transparent",
              borderLeft: `3px solid ${isReq ? palette.accent : palette.rule}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  fontFamily: displayFont.stack,
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: isReq ? palette.accent : palette.inkSoft,
                }}
              >
                {isReq ? "Mandatory" : "Recommended"}
              </div>
              {g.url && (
                <a
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  style={{
                    fontFamily: displayFont.stack,
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: palette.accentDeep,
                    borderBottom: `1px solid ${palette.accentDeep}`,
                    paddingBottom: 1,
                    textDecoration: "none",
                  }}
                >
                  Shop ↗
                </a>
              )}
            </div>
            <div style={{ fontSize: 15, color: palette.ink, lineHeight: 1.7 }}>
              {g.url ? (
                <a
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  style={{ color: palette.ink, textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  {g.name}
                </a>
              ) : (
                g.name
              )}
            </div>
            {g.note && (
              <div style={{ fontSize: 12, color: palette.inkSoft, marginTop: 8, lineHeight: 1.6 }}>{g.note}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ChapterEntry({
  race,
  palette,
  displayFont,
}: {
  race: Race;
  palette: Palette;
  displayFont: DisplayFont;
}) {
  if (!race.entry_flow) return null;
  const steps = race.entry_flow
    .split("\n")
    .filter(Boolean)
    .map((l) => l.replace(/^\d+\.\s*/, ""));
  return (
    <div style={{ maxWidth: 1100 }}>
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(steps.length, 4)}, 1fr)`,
          gap: 24,
        }}
      >
        {steps.map((step, i) => (
          <li key={i} style={{ borderTop: `2px solid ${palette.accent}`, paddingTop: 20 }}>
            <div
              style={{
                fontFamily: displayFont.stack,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: palette.inkSoft,
                marginBottom: 14,
              }}
            >
              Step {String(i + 1).padStart(2, "0")}
            </div>
            <div
              style={{
                fontFamily: displayFont.stack,
                fontSize: 22,
                fontWeight: 500,
                color: palette.ink,
                lineHeight: 1.4,
              }}
            >
              {step}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ChapterVideos({
  race,
  palette,
}: {
  race: Race;
  palette: Palette;
}) {
  if (!race.videos?.length) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, maxWidth: 1200 }}>
      {race.videos.map((v) => (
        <article key={v.id} style={{ cursor: "pointer" }}>
          <div style={{ position: "relative", aspectRatio: "16/9", background: palette.ink, overflow: "hidden" }}>
            <Placeholder label={`youtube · ${v.id}`} ratio="16/9" tone="dark" />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: "1.5px solid #fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                ▶
              </div>
            </div>
          </div>
          <h4
            style={{
              fontFamily: '"Noto Serif JP", serif',
              fontSize: 17,
              fontWeight: 600,
              margin: "14px 0 0",
              color: palette.ink,
              lineHeight: 1.5,
            }}
          >
            {v.title}
          </h4>
        </article>
      ))}
    </div>
  );
}
