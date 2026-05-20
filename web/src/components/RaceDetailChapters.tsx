"use client";

import Link from "next/link";
import { useState } from "react";
import type { Race, Report } from "@/types/content";
import { MONTH_LABELS, type Palette, type DisplayFont } from "./design-tokens";
import { Stars } from "./Brand";
import { ReportPurposeTabs } from "./ReportPurposeTabs";
import styles from "./RaceDetailChapters.module.css";

type SectionId = "overview" | "schedule" | "gear" | "entry" | "reports" | "videos";

export function RaceDetailChapters({
  race,
  reports,
  palette,
  displayFont,
  organizerId,
}: {
  race: Race;
  reports: Report[];
  palette: Palette;
  displayFont: DisplayFont;
  organizerId?: string | null;
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
        className={styles.nav}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          background: palette.bg,
          borderBottom: `1px solid ${palette.rule}`,
        }}
      >
        <div className={styles.navInner}>
          {sections.map((s) => {
            const disabled = !s.available;
            return (
              <button
                key={s.id}
                onClick={() => !disabled && setSection(s.id)}
                disabled={disabled}
                className={styles.navButton}
                style={{
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.35 : 1,
                  borderBottom:
                    section === s.id ? `2px solid ${palette.accent}` : "2px solid transparent",
                  color: section === s.id ? palette.ink : palette.inkSoft,
                  fontFamily: displayFont.stack,
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

      <section className={styles.section}>
        {section === "overview" && (
          <ChapterOverview
            race={race}
            palette={palette}
            displayFont={displayFont}
            organizerId={organizerId}
          />
        )}
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
  organizerId,
}: {
  race: Race;
  palette: Palette;
  displayFont: DisplayFont;
  organizerId?: string | null;
}) {
  return (
    <div className={styles.overviewGrid}>
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
        <p className={styles.overviewSummary} style={{ color: palette.ink }}>
          {race.summary}
        </p>
        <div
          style={{ marginTop: 28, fontSize: 14, lineHeight: 1.95, color: palette.ink }}
          dangerouslySetInnerHTML={{ __html: race.contentHtml }}
        />
        {race.editions?.length ? (
          <div style={{ marginTop: 40 }}>
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
              Editions · 開催地履歴
            </div>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                borderTop: `1px solid ${palette.rule}`,
              }}
            >
              {race.editions
                .slice()
                .sort((a, b) => b.year - a.year)
                .map((e) => (
                  <li
                    key={`${e.year}-${e.country}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 1fr",
                      gap: 16,
                      padding: "12px 0",
                      borderBottom: `1px solid ${palette.rule}`,
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: displayFont.stack,
                        fontSize: 18,
                        fontWeight: 600,
                        color: palette.accent,
                      }}
                    >
                      {e.year}
                    </span>
                    <span
                      style={{
                        fontFamily: '"Noto Sans JP", sans-serif',
                        fontSize: 14,
                        color: palette.ink,
                        lineHeight: 1.6,
                      }}
                    >
                      {e.country}
                      {e.note ? (
                        <span style={{ marginLeft: 10, color: palette.inkSoft, fontSize: 12 }}>
                          — {e.note}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        ) : null}
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
            [
              "Organizer",
              organizerId ? (
                <Link
                  key="org"
                  href={`/organizers/${organizerId}`}
                  style={{ color: palette.accentDeep, textDecoration: "underline" }}
                >
                  {race.organizer}
                </Link>
              ) : (
                race.organizer || "—"
              ),
            ],
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
              className={styles.overviewMetaRow}
              style={{ borderBottom: `1px solid ${palette.rule}` }}
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
              <dd
                className={styles.overviewMetaValue}
                style={{ margin: 0, fontFamily: displayFont.stack, color: palette.ink }}
              >
                {v}
              </dd>
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
    <div className={styles.schedule}>
      {race.schedule.map((s) => {
        const km = parseInt(s.description, 10) || 0;
        return (
          <div
            key={s.day}
            className={styles.scheduleRow}
            style={{ borderBottom: `1px solid ${palette.rule}` }}
          >
            <div
              className={styles.scheduleDay}
              style={{ fontFamily: displayFont.stack, color: palette.accent }}
            >
              D<span className={styles.scheduleDayInner}>{s.day}</span>
            </div>
            <div className={styles.scheduleStat}>
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
            <div className={styles.scheduleDesc} style={{ color: palette.ink }}>
              {s.description}
            </div>
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
    <div className={styles.gearGrid}>
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
  const desktopClass =
    steps.length >= 4 ? styles.entryListMany : steps.length === 3 ? styles.entryListThree : "";
  return (
    <ol className={`${styles.entryList} ${desktopClass}`}>
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
            className={styles.entryStepTitle}
            style={{ fontFamily: displayFont.stack, color: palette.ink }}
          >
            {step}
          </div>
        </li>
      ))}
    </ol>
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
    <div className={styles.videoGrid}>
      {race.videos.map((v) => (
        <article key={v.id}>
          <div style={{ position: "relative", aspectRatio: "16/9", background: palette.ink, overflow: "hidden" }}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}`}
              title={v.title ?? `YouTube video ${v.id}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          </div>
          {(v.title || v.channel) && (
            <div style={{ marginTop: 14 }}>
              {v.title && (
                <h4
                  style={{
                    fontFamily: '"Noto Serif JP", serif',
                    fontSize: 17,
                    fontWeight: 600,
                    margin: 0,
                    color: palette.ink,
                    lineHeight: 1.5,
                  }}
                >
                  {v.title}
                </h4>
              )}
              {v.channel && (
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: '"Noto Sans JP", sans-serif',
                    fontSize: 12,
                    color: palette.inkSoft,
                    display: "flex",
                    gap: 8,
                    alignItems: "baseline",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: palette.accent,
                    }}
                  >
                    Channel
                  </span>
                  {v.channelUrl ? (
                    <a
                      href={v.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: palette.inkSoft, textDecoration: "underline" }}
                    >
                      {v.channel}
                    </a>
                  ) : (
                    <span>{v.channel}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
