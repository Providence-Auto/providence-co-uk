"use client";

import { Camera, Check, FileText, FolderOpen } from "lucide-react";
import { type ReactNode, useRef } from "react";
import { useLoopingProgress } from "@/components/useLoopingProgress";
import VoyageTrack, { type VoyageStage } from "@/components/VoyageTrack";
import {
  clamp01,
  easeInOutCubic,
  type LoopFrame,
  loopOpacity,
  segmentWindow,
  stageLevel,
} from "@/lib/motion";

/**
 * The tool micro-demos (landing-page-playbook.md P3, R5). Each one is a small,
 * looping picture of something a buyer is actually handed. The text is always
 * in the DOM — the list of inspection points, the documents, the quote's lines —
 * and only the ticks, fills and stamps move, so the server HTML, a screen reader
 * and a reader with reduced motion all get the same, finished content.
 *
 * Copy and data arrive as props from the server section (ToolDemos), which
 * reads src/config/tool-demos.ts; nothing here types a claim.
 */

/** The share of the play phase the steps take; the rest lands the stamp. */
const STEPS_SPAN = 0.86;

/** Step `index` of `count`, 0..1, within the steps' share of the loop. */
function step(frame: LoopFrame, index: number, count: number): number {
  return stageLevel(
    { progress: clamp01(frame.progress / STEPS_SPAN), fade: frame.fade },
    segmentWindow(index, count, 0.35),
  );
}

/** 0..1 for the closing stamp, after every step is done. */
function stamp(frame: LoopFrame): number {
  return clamp01((frame.progress - 0.9) / 0.1) * frame.fade;
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-black/5">
      {children}
    </div>
  );
}

function PanelHeader({
  title,
  icon,
  status,
}: {
  title: string;
  icon?: ReactNode;
  status: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
        {icon}
        {title}
      </span>
      <span aria-hidden className="shrink-0">
        {status}
      </span>
    </div>
  );
}

/** "4 of 6 ready": how many of a demo's steps are complete. */
function Counter({ levels, noun }: { levels: number[]; noun: string }) {
  const done = levels.filter((level) => level >= 0.999).length;
  return (
    <span className="text-xs font-semibold tabular-nums text-zinc-500">
      {done} of {levels.length} {noun}
    </span>
  );
}

/** The stamp a demo lands on: grey while working, gradient once done. */
function Stamp({
  level,
  done,
  working,
}: {
  level: number;
  done: string;
  working: string;
}) {
  const finished = level > 0.5;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-300 ${
        finished
          ? "bg-gradient-to-r from-sky-500 to-violet-500 text-white"
          : "bg-zinc-200/70 text-zinc-500"
      }`}
    >
      {finished ? (
        <Check className="size-3" strokeWidth={3} />
      ) : (
        <span className="size-1.5 rounded-full bg-amber-400" />
      )}
      {finished ? done : working}
    </span>
  );
}

/** A step marker: a ring that draws round, then fills with a tick. */
function StepMark({ level }: { level: number }) {
  const circumference = 2 * Math.PI * 8;
  const drawn = clamp01(level / 0.75);
  const ticked = clamp01((level - 0.75) / 0.25);
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 shrink-0">
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        stroke="#d4d4d8"
        strokeWidth="2"
      />
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - drawn)}
        transform="rotate(-90 10 10)"
      />
      <g style={{ opacity: ticked }}>
        <circle cx="10" cy="10" r="9" fill="#8b5cf6" />
        <path
          d="M6 10.4l2.6 2.6L14 7.6"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

// ── The inspection ───────────────────────────────────────────────────────────

export function InspectionDemo({
  points,
  localCheck,
  guarantee,
  stampLabel,
}: {
  points: string[];
  localCheck?: string;
  guarantee: string;
  stampLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useLoopingProgress(ref, {
    playMs: 5200,
    holdMs: 2400,
    fadeMs: 700,
  });
  const rows = localCheck ? [...points, localCheck] : points;
  const levels = rows.map((_, index) => step(frame, index, rows.length));

  return (
    <div ref={ref}>
      <Panel>
        <PanelHeader
          title="Inspection report"
          status={<Counter levels={levels} noun="checked" />}
        />
        <ul className="divide-y divide-black/5">
          {rows.map((row, index) => {
            const level = levels[index];
            const local = index === points.length;
            return (
              <li key={row} className="flex items-center gap-3 py-2">
                <StepMark level={level} />
                <span
                  className={
                    local
                      ? "text-[13px] leading-snug text-zinc-700"
                      : "text-sm text-zinc-800"
                  }
                  style={{ opacity: 0.45 + 0.55 * level }}
                >
                  {row}
                </span>
                <Camera
                  aria-hidden
                  className="ml-auto size-4 shrink-0 text-violet-500"
                  style={{ opacity: clamp01((level - 0.75) / 0.25) }}
                />
              </li>
            );
          })}
        </ul>
        <div className="mt-3">
          <Stamp level={stamp(frame)} done={stampLabel} working="Checking" />
        </div>
        <p className="mt-3 border-t border-black/5 pt-3 text-xs leading-relaxed text-zinc-500">
          {guarantee}
        </p>
      </Panel>
    </div>
  );
}

// ── The landed quote ─────────────────────────────────────────────────────────

/**
 * A computed amount, drawn as a bar that fills. Every bar is the same length on
 * purpose: the demo shows that each line is worked out, not how big it is — a
 * relative size would be a claim about a car nobody has named.
 */
function AmountBar({ level, wide = false }: { level: number; wide?: boolean }) {
  return (
    <span
      aria-hidden
      className={`relative block shrink-0 overflow-hidden rounded-full bg-zinc-200 ${
        wide ? "h-2.5 w-24" : "h-2 w-16"
      }`}
    >
      <span
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-500 to-violet-500"
        style={{ width: `${level * 100}%` }}
      />
    </span>
  );
}

export function LandedQuoteDemo({
  quote,
}: {
  quote: {
    paidToUs: { label: string; rows: string[] };
    paidInYourName: { label: string; rows: string[] };
    total: string;
    stamp: string;
  };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useLoopingProgress(ref, {
    playMs: 4800,
    holdMs: 2600,
    fadeMs: 700,
  });
  const lines = [...quote.paidToUs.rows, ...quote.paidInYourName.rows];
  const count = lines.length + 1; // every line, then the total
  const levelOf = (row: string) => step(frame, lines.indexOf(row), count);

  const group = (label: string, rows: string[]) => (
    <div className="py-2">
      <p className="mb-1.5 text-xs font-medium text-zinc-500">{label}</p>
      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row} className="flex items-center justify-between gap-4">
            <span className="text-sm text-zinc-800">{row}</span>
            <AmountBar level={levelOf(row)} />
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div ref={ref}>
      <Panel>
        <PanelHeader
          title="Landed quote"
          status={
            <Counter
              levels={[...lines, quote.total].map((_, index) =>
                step(frame, index, count),
              )}
              noun="worked out"
            />
          }
        />
        {group(quote.paidToUs.label, quote.paidToUs.rows)}
        <div className="border-t border-black/5">
          {group(quote.paidInYourName.label, quote.paidInYourName.rows)}
        </div>
        <div className="mt-1 flex items-center justify-between gap-4 border-t border-black/10 pt-3">
          <span className="text-sm font-semibold text-zinc-900">
            {quote.total}
          </span>
          <AmountBar level={step(frame, lines.length, count)} wide />
        </div>
        <div className="mt-3">
          <Stamp level={stamp(frame)} done={quote.stamp} working="Pricing" />
        </div>
      </Panel>
    </div>
  );
}

// ── The document pack ────────────────────────────────────────────────────────

export function DocumentPackDemo({
  documents,
  stampLabel,
}: {
  documents: string[];
  stampLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useLoopingProgress(ref, {
    playMs: 5600,
    holdMs: 2400,
    fadeMs: 700,
  });
  const levels = documents.map((_, index) =>
    step(frame, index, documents.length),
  );

  return (
    <div ref={ref}>
      <Panel>
        <PanelHeader
          title="Document pack"
          icon={<FolderOpen aria-hidden className="size-4 text-sky-500" />}
          status={<Counter levels={levels} noun="ready" />}
        />
        <ul className="space-y-1.5">
          {documents.map((document, index) => {
            const level = levels[index];
            return (
              <li
                key={document}
                className="flex items-start gap-2.5 rounded-xl bg-white px-3 py-2 ring-1 ring-black/5"
                style={{
                  opacity: 0.4 + 0.6 * level,
                  transform: `translateX(${(1 - level) * 6}px)`,
                }}
              >
                <FileText
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-zinc-400"
                />
                <span className="text-[13px] leading-snug text-zinc-800">
                  {document}
                </span>
                <Check
                  aria-hidden
                  strokeWidth={3}
                  className="ml-auto mt-0.5 size-3.5 shrink-0 text-violet-500"
                  style={{ opacity: clamp01((level - 0.75) / 0.25) }}
                />
              </li>
            );
          })}
        </ul>
        <div className="mt-3">
          <Stamp level={stamp(frame)} done={stampLabel} working="Preparing" />
        </div>
      </Panel>
    </div>
  );
}

// ── The tracking ─────────────────────────────────────────────────────────────

export function TrackingDemo({ stages }: { stages: VoyageStage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useLoopingProgress(ref, {
    playMs: 6000,
    holdMs: 2600,
    fadeMs: 700,
  });
  const t = easeInOutCubic(frame.progress);
  const current =
    stages.filter((stage) => stage.at <= t + 1e-6).at(-1) ?? stages[0];

  return (
    <div ref={ref}>
      <Panel>
        <PanelHeader
          title="Your import"
          status={
            <span className="text-xs font-semibold text-zinc-500">
              Stage {stages.indexOf(current) + 1} of {stages.length}
            </span>
          }
        />
        <div style={{ opacity: loopOpacity(frame) }}>
          <VoyageTrack stages={stages} progress={t} showLabels={false} />
          <div
            aria-hidden
            className="mt-1 flex items-center justify-between gap-4"
          >
            <span className="text-sm text-zinc-500">
              Now:{" "}
              <span className="font-semibold text-zinc-900">
                {current.label}
              </span>
            </span>
            <span className="flex gap-1.5">
              {stages.map((stage) => (
                <span
                  key={stage.label}
                  className={`size-2 rounded-full transition-colors duration-300 ${
                    stage.at <= t + 1e-6 ? "bg-violet-500" : "bg-zinc-300"
                  }`}
                />
              ))}
            </span>
          </div>
        </div>
        <ol className="sr-only">
          {stages.map((stage) => (
            <li key={stage.label}>{stage.label}</li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
