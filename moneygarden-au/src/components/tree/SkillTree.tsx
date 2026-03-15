import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Lock, PlayCircle } from "lucide-react";
import type { LearningModule, ModuleProgress } from "../../types";
import { ModuleIconGlyph } from "../modules/moduleIcons";
import { cn } from "../../lib/utils";

type Props = {
  modules: LearningModule[];
  moduleState: Record<string, ModuleProgress>;
  title?: string;
  subtitle?: string;
};

type SkillState = {
  module: LearningModule;
  completed: boolean;
  available: boolean;
  locked: boolean;
  inProgress: boolean;
  completion: number;
};

type NodePoint = {
  x: number;
  y: number;
};

const treeRows = [
  { y: 84, indexes: [0], minX: 50, maxX: 50 },
  { y: 68, indexes: [1, 2], minX: 40, maxX: 60 },
  { y: 52, indexes: [3, 4, 5], minX: 30, maxX: 70 },
  { y: 36, indexes: [6, 7, 8], minX: 30, maxX: 70 },
  { y: 20, indexes: [9, 10, 11], minX: 30, maxX: 70 },
] as const;

function buildTreePositions(): NodePoint[] {
  const positions: NodePoint[] = [];

  treeRows.forEach(({ y, indexes, minX, maxX }) => {
    if (indexes.length === 1) {
      positions[indexes[0]] = { x: minX, y };
      return;
    }

    const step = (maxX - minX) / (indexes.length - 1);

    indexes.forEach((index, offset) => {
      positions[index] = {
        x: Number((minX + step * offset).toFixed(2)),
        y,
      };
    });
  });

  return positions;
}

const treePositions = buildTreePositions();

const nodeDisplayTitles = [
  "Fundamentals",
  "Borrowing Basics",
  "Work & Tax",
  "Investing Intro",
  "Smart Spending",
  "Budget Planning",
  "Money Safety",
  "Living Costs",
  "Consumer Rights",
  "Super Basics",
  "Income Growth",
  "Big Decisions",
];

const connectors: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 4],
  [2, 5],
  [3, 6],
  [4, 7],
  [5, 8],
  [6, 9],
  [7, 10],
  [8, 11],
];

function getStates(
  modules: LearningModule[],
  moduleState: Record<string, ModuleProgress>,
): SkillState[] {
  return modules.map((module, index) => {
    const completed = Boolean(moduleState[module.id]?.completed);
    const parentIndexes = connectors
      .filter(([, to]) => to === index)
      .map(([from]) => from);
    const unlocked =
      parentIndexes.length === 0 ||
      parentIndexes.every((parentIndex) => Boolean(moduleState[modules[parentIndex]?.id]?.completed));
    const highestStep = moduleState[module.id]?.highestStep ?? 0;
    const inProgress = unlocked && !completed && highestStep > 0;
    const available = unlocked && !completed && highestStep === 0;
    const locked = !completed && !unlocked;
    const completion =
      module.steps.length === 0 ? 0 : Math.round((highestStep / module.steps.length) * 100);

    return {
      module,
      completed,
      available,
      locked,
      inProgress,
      completion,
    };
  });
}

function nodeSurfaceStyles(state: SkillState) {
  if (state.completed) {
    return "bg-emerald-400 shadow-[0_0_0_6px_rgba(74,222,128,0.08)]";
  }
  if (state.inProgress) {
    return "bg-amber-300 shadow-[0_0_0_6px_rgba(253,224,71,0.08)]";
  }
  if (state.available) {
    return "bg-teal-300 shadow-[0_0_0_6px_rgba(94,234,212,0.08)]";
  }
  return "bg-slate-800/90";
}

function nodeStyles(state: SkillState) {
  if (state.completed) {
    return "border-emerald-200 text-emerald-950";
  }
  if (state.inProgress) {
    return "border-amber-200 text-amber-950";
  }
  if (state.available) {
    return "border-teal-200 text-teal-950";
  }
  return "border-slate-600 text-slate-300";
}

export function SkillTree({ modules, moduleState, title, subtitle }: Props) {
  const states = getStates(modules, moduleState);
  const points = treePositions.slice(0, states.length);
  const visibleConnectors = connectors.filter(
    ([from, to]) => from < states.length && to < states.length,
  );
  const defaultSelectedId =
    states.find((item) => item.available || item.inProgress)?.module.id ??
    states.find((item) => item.completed)?.module.id ??
    modules[0]?.id ??
    "";
  const [selectedId, setSelectedId] = useState(defaultSelectedId);

  useEffect(() => {
    if (!states.some((item) => item.module.id === selectedId)) {
      setSelectedId(defaultSelectedId);
    }
  }, [defaultSelectedId, selectedId, states]);

  const selectedIndex = states.findIndex((item) => item.module.id === selectedId);
  const selectedState = selectedIndex >= 0 ? states[selectedIndex] : states[0];
  const completedCount = states.filter((item) => item.completed).length;
  const overallProgress =
    modules.length === 0 ? 0 : Math.round((completedCount / modules.length) * 100);
  const childIndexes = connectors
    .filter(([from]) => from === selectedIndex)
    .map(([, to]) => to)
    .filter((index) => index < states.length);
  const unlocksLabel =
    childIndexes.length === 0
      ? "Canopy complete"
      : childIndexes
          .map((index) => nodeDisplayTitles[index] ?? `Module ${index + 1}`)
          .join(", ");
  const selectedCompletedSteps = selectedState
    ? selectedState.completed
      ? selectedState.module.steps.length
      : Math.min(
          moduleState[selectedState.module.id]?.highestStep ?? 0,
          selectedState.module.steps.length,
        )
    : 0;
  const selectedStepProgress =
    selectedState?.module.steps.length
      ? Math.round((selectedCompletedSteps / selectedState.module.steps.length) * 100)
      : 0;

  return (
    <section className="rounded-[30px] border border-border/80 bg-background/95 p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {title ?? "Learning Tree"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {subtitle ??
              "Begin at Fundamentals. Each completed lesson unlocks the next branch in your learning tree."}
          </p>
        </div>

        <div className="min-w-[240px] rounded-2xl border border-border bg-muted/25 p-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <span>Overall progress</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {completedCount} of {modules.length} modules completed
          </p>
        </div>
      </div>

      <div className="rounded-[28px] border border-emerald-950/20 bg-[linear-gradient(180deg,#0a1720,#0b1828)] p-5 text-slate-100">
        <div className="mb-4 hidden items-center justify-between gap-3 lg:flex">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
            Learning path
          </p>
          <p className="text-xs text-slate-400">
            Follow the connected modules from bottom to top
          </p>
        </div>

        <div className="relative hidden h-[560px] overflow-hidden rounded-[22px] lg:block">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            {visibleConnectors.map(([from, to], index) => {
              const a = points[from];
              const b = points[to];
              const active =
                states[from]?.completed ||
                states[to]?.completed ||
                states[to]?.available ||
                states[to]?.inProgress;

              return (
                <path
                  key={index}
                  d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
                  fill="none"
                  stroke={active ? "rgba(209,250,229,0.78)" : "rgba(148,163,184,0.16)"}
                  strokeWidth={active ? "1.05" : "0.75"}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {states.map((item, index) => {
            const point = points[index];
            const selected = item.module.id === selectedState?.module.id;
            const displayTitle = nodeDisplayTitles[index] ?? item.module.title;

            return (
              <div
                key={item.module.id}
                className="absolute"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              >
                <div className="relative h-12 w-12 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-full",
                      nodeSurfaceStyles(item),
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.module.id)}
                    className={cn(
                      "absolute inset-0 z-20 flex items-center justify-center rounded-full border-2 bg-transparent transition",
                      nodeStyles(item),
                      selected && "scale-110 ring-4 ring-emerald-100/15",
                    )}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-4.5 w-4.5" />
                    ) : item.locked ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : (
                      <ModuleIconGlyph icon={item.module.icon} className="h-4 w-4" />
                    )}
                  </button>
                  <div className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-20 w-28 -translate-x-1/2 text-center">
                    <p className="text-sm font-semibold leading-tight text-slate-100">{displayTitle}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 lg:hidden">
          {states.map((item, index) => {
            const displayTitle = nodeDisplayTitles[index] ?? item.module.title;
            const statusLabel = item.completed
              ? "Completed"
              : item.locked
                ? "Locked"
                : item.inProgress
                  ? "In progress"
                  : "Unlocked";

            return (
              <button
                key={item.module.id}
                type="button"
                onClick={() => setSelectedId(item.module.id)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-3 text-left transition",
                  item.module.id === selectedState?.module.id
                    ? "border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/20"
                    : "border-border bg-background",
                )}
              >
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border",
                    nodeStyles(item),
                  )}
                >
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : item.locked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <ModuleIconGlyph icon={item.module.icon} className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{displayTitle}</p>
                  <p className="text-xs text-muted-foreground">{statusLabel}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedState && (
        <div className="mt-5 rounded-[24px] border border-border bg-background p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {nodeDisplayTitles[selectedIndex] ?? `Module ${selectedState.module.moduleNumber}`}
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">
                {selectedState.module.title}
              </h3>
            </div>

            <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {selectedState.completed
                ? "Completed"
                : selectedState.locked
                  ? "Locked"
                  : selectedState.inProgress
                    ? "In progress"
                    : "Ready to start"}
            </div>
          </div>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {selectedState.module.shortDescription}
          </p>

          <div className="mt-5 rounded-2xl border border-border bg-muted/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Module progress
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {selectedCompletedSteps} of {selectedState.module.steps.length} steps completed
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{selectedStepProgress}%</p>
                <p className="text-xs text-muted-foreground">
                  Score {moduleState[selectedState.module.id]?.score ?? 0}%
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 transition-all duration-500"
                style={{ width: `${selectedStepProgress}%` }}
              />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <InfoCard label="Difficulty" value={selectedState.module.difficulty} />
            <InfoCard label="Length" value={`${selectedState.module.minutes} min`} />
            <InfoCard
              label="Unlocks"
              value={unlocksLabel}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to={selectedState.locked ? "#" : `/app/learn/${selectedState.module.id}`}
              onClick={(event) => {
                if (selectedState.locked) event.preventDefault();
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                selectedState.locked
                  ? "cursor-not-allowed bg-muted text-muted-foreground"
                  : "bg-emerald-500 text-white hover:bg-emerald-600",
              )}
            >
              {selectedState.completed
                ? "Review module"
                : selectedState.inProgress
                  ? "Continue module"
                  : "Start module"}
              {!selectedState.locked && <ArrowRight className="h-4 w-4" />}
            </Link>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm text-muted-foreground">
              {selectedState.completed ? <CheckCircle2 className="h-4 w-4" /> : selectedState.locked ? <Lock className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
              {completedCount} branches grown
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}
