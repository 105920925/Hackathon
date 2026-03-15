import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  PlayCircle,
  Sparkles,
  Target,
} from "lucide-react";
import type { LearningModule, ModuleProgress } from "../../types";
import { ModuleIconGlyph } from "../modules/moduleIcons";
import { cn } from "../../lib/utils";

type Props = {
  modules: LearningModule[];
  moduleState: Record<string, ModuleProgress>;
  title?: string;
  subtitle?: string;
};

type NodePosition = {
  x: number;
  y: number;
};

function getNodePositions(count: number): NodePosition[] {
  if (count <= 1) return [{ x: 50, y: 34 }];

  return Array.from({ length: count }, (_, index) => {
    const progress = index / (count - 1);
    const arc = Math.sin(progress * Math.PI);

    return {
      x: 14 + progress * 72,
      y: 72 - arc * 40,
    };
  });
}

export function SkillTree({ modules, moduleState, title, subtitle }: Props) {
  const states = modules.map((module, index) => {
    const completed = Boolean(moduleState[module.id]?.completed);
    const previousComplete =
      index === 0 ? true : Boolean(moduleState[modules[index - 1].id]?.completed);
    const highestStep = moduleState[module.id]?.highestStep ?? 0;
    const available = !completed && previousComplete;
    const locked = !completed && !previousComplete;
    const inProgress = !completed && highestStep > 0;

    return { module, completed, available, locked, inProgress, highestStep };
  });

  const positions = getNodePositions(modules.length);
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

  const selectedState = states.find((item) => item.module.id === selectedId) ?? states[0];
  const completedCount = states.filter((item) => item.completed).length;
  const nextAvailable = states.find((item) => item.available || item.inProgress);
  const progressPercent =
    modules.length === 0 ? 0 : Math.round((completedCount / modules.length) * 100);

  return (
    <div className="rounded-[34px] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_24%),radial-gradient(circle_at_85%_18%,rgba(56,189,248,0.16),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(242,248,255,0.94))] p-5 shadow-[0_30px_90px_-54px_rgba(14,116,144,0.55)] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.2),transparent_24%),radial-gradient(circle_at_85%_18%,rgba(56,189,248,0.18),transparent_24%),linear-gradient(180deg,rgba(7,17,29,0.98),rgba(12,20,34,0.96))]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">
            {title ?? "Finance Skill Tree"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {subtitle ??
              "Unlock each knowledge branch in order. Completed modules glow, the next module is spotlighted, and every node now has a guided detail view."}
          </p>
        </div>
        <div className="rounded-full bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {completedCount} / {modules.length} skills unlocked
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-[30px] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.45),rgba(219,234,254,0.12))] p-4 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.55),rgba(30,41,59,0.18))]">
          <div className="pointer-events-none absolute inset-x-10 top-6 h-24 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/50 bg-white/70 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-zinc-900/60">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Branch progress
              </p>
              <p className="mt-1 text-sm font-semibold">
                {completedCount === modules.length
                  ? "Full canopy unlocked"
                  : nextAvailable
                    ? `Next branch: ${nextAvailable.module.title}`
                    : "Choose a branch to inspect"}
              </p>
            </div>
            <div className="min-w-[170px]">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>Completion</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-sky-100 dark:bg-sky-950/60">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="relative hidden h-[520px] lg:block">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="skill-line" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="skill-trunk" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
              </defs>

              <ellipse cx="50" cy="92" rx="24" ry="4" fill="rgba(52,211,153,0.18)" />
              <path
                d="M50 88 C49 78 49 68 50 58"
                fill="none"
                stroke="url(#skill-trunk)"
                strokeWidth="3.4"
                strokeLinecap="round"
                opacity="0.8"
              />

              {positions.map((position, index) => {
                const trunkJoinY = 58 - Math.max(0, (position.y - 22) * 0.18);

                return (
                  <path
                    key={`trunk-${modules[index]?.id ?? index}`}
                    d={`M 50 58 C 50 ${trunkJoinY}, ${position.x - (position.x - 50) * 0.35} ${position.y + 6}, ${position.x} ${position.y}`}
                    fill="none"
                    stroke="rgba(120,53,15,0.38)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                );
              })}

              {positions.slice(0, -1).map((node, index) => {
                const next = positions[index + 1];
                const complete = states[index].completed;
                const activePath =
                  selectedState &&
                  (selectedState.module.id === states[index].module.id ||
                    selectedState.module.id === states[index + 1].module.id);

                return (
                  <path
                    key={`${node.x}-${node.y}`}
                    d={`M ${node.x} ${node.y} C ${node.x + 8} ${node.y - 18}, ${next.x - 8} ${next.y + 18}, ${next.x} ${next.y}`}
                    fill="none"
                    stroke="url(#skill-line)"
                    strokeWidth={activePath ? "2.2" : "1.6"}
                    strokeDasharray={complete ? "0" : "5 4"}
                    opacity={complete ? 0.92 : activePath ? 0.6 : 0.28}
                  />
                );
              })}
            </svg>

            {states.map((item, index) => {
              const position = positions[index];
              const selected = item.module.id === selectedState?.module.id;
              const completion =
                item.module.steps.length === 0
                  ? 0
                  : Math.round((item.highestStep / item.module.steps.length) * 100);

              return (
                <motion.div
                  key={item.module.id}
                  className="absolute"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.module.id)}
                    className={cn(
                      "group w-[220px] rounded-[28px] border p-4 text-left backdrop-blur transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                      selected && "scale-[1.03]",
                      item.completed &&
                        "border-emerald-300 bg-emerald-50/90 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_24px_70px_-42px_rgba(16,185,129,0.75)] dark:border-emerald-900 dark:bg-emerald-950/30",
                      item.available &&
                        "border-sky-300 bg-sky-50/90 shadow-[0_0_0_1px_rgba(56,189,248,0.15),0_24px_70px_-42px_rgba(56,189,248,0.75)] dark:border-sky-900 dark:bg-sky-950/25",
                      item.inProgress && "ring-1 ring-amber-300 dark:ring-amber-800",
                      item.locked &&
                        "border-border/70 bg-zinc-100/70 opacity-80 dark:bg-zinc-900/60",
                      selected &&
                        "shadow-[0_0_0_1px_rgba(125,211,252,0.35),0_30px_80px_-46px_rgba(56,189,248,0.7)]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={cn(
                          "inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                          item.module.themeColor,
                          item.locked && "grayscale",
                        )}
                      >
                        <ModuleIconGlyph icon={item.module.icon} className="h-6 w-6" />
                      </div>
                      <div className="rounded-full bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Module {item.module.moduleNumber}
                      </div>
                    </div>
                    <p className="mt-4 text-lg font-bold">{item.module.title}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {item.module.shortDescription}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold">
                      <span
                        className={cn(
                          item.completed && "text-emerald-700 dark:text-emerald-300",
                          item.available && "text-sky-700 dark:text-sky-300",
                          item.locked && "text-muted-foreground",
                        )}
                      >
                        {item.completed
                          ? "Completed"
                          : item.locked
                            ? "Locked"
                            : item.inProgress
                              ? "In progress"
                              : "Ready to unlock"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        {item.completed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : item.locked ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <PlayCircle className="h-4 w-4" />
                        )}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        <span>Progress</span>
                        <span>{item.completed ? "100%" : `${completion}%`}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/70 dark:bg-zinc-800/80">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            item.completed
                              ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                              : item.inProgress
                                ? "bg-gradient-to-r from-amber-400 to-orange-400"
                                : item.available
                                  ? "bg-gradient-to-r from-sky-400 to-cyan-400"
                                  : "bg-white/20",
                          )}
                          style={{ width: `${item.completed ? 100 : completion}%` }}
                        />
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          <div className="grid gap-3 lg:hidden">
            {states.map((item) => {
              const completion =
                item.module.steps.length === 0
                  ? 0
                  : Math.round((item.highestStep / item.module.steps.length) * 100);

              return (
                <button
                  key={item.module.id}
                  type="button"
                  onClick={() => setSelectedId(item.module.id)}
                  className={cn(
                    "rounded-[26px] border p-4 text-left",
                    item.completed &&
                      "border-emerald-300 bg-emerald-50/90 dark:border-emerald-900 dark:bg-emerald-950/30",
                    item.available &&
                      "border-sky-300 bg-sky-50/90 dark:border-sky-900 dark:bg-sky-950/25",
                    item.locked && "border-border/70 bg-muted/40 opacity-80",
                    item.module.id === selectedState?.module.id &&
                      "ring-2 ring-sky-300 dark:ring-sky-800",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white",
                        item.module.themeColor,
                        item.locked && "grayscale",
                      )}
                    >
                      <ModuleIconGlyph icon={item.module.icon} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{item.module.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.completed
                          ? "Completed"
                          : item.locked
                            ? "Locked"
                            : item.inProgress
                              ? "In progress"
                              : "Available"}
                      </p>
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground">
                      {item.completed ? "100%" : `${completion}%`}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[30px] border border-white/60 bg-white/75 p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950/70">
          {selectedState ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Selected branch
                  </div>
                  <h3 className="mt-3 text-2xl font-black tracking-tight">
                    {selectedState.module.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedState.module.shortDescription}
                  </p>
                </div>
                <div
                  className={cn(
                    "inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br text-white shadow-lg",
                    selectedState.module.themeColor,
                    selectedState.locked && "grayscale",
                  )}
                >
                  <ModuleIconGlyph icon={selectedState.module.icon} className="h-7 w-7" />
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <Target className="h-4 w-4" />
                    Module snapshot
                  </div>
                  <p className="mt-3 text-sm">
                    <span className="font-semibold">Difficulty:</span>{" "}
                    {selectedState.module.difficulty}
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="font-semibold">Length:</span>{" "}
                    {selectedState.module.minutes} min
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="font-semibold">XP reward:</span>{" "}
                    {selectedState.module.xpBonus}
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="font-semibold">Unlock:</span>{" "}
                    {selectedState.module.branchLabel}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <Sparkles className="h-4 w-4" />
                    Status
                  </div>
                  <p className="mt-3 text-sm font-semibold">
                    {selectedState.completed
                      ? "This branch is complete."
                      : selectedState.locked
                        ? "This branch is locked until the previous module is completed."
                        : selectedState.inProgress
                          ? "This branch is active and already underway."
                          : "This branch is ready to start now."}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedState.completed
                      ? "Nice work. You can reopen it any time for a refresh."
                      : selectedState.locked
                        ? "Follow the tree path from left to right to unlock it."
                        : "Open the module to keep extending your finance tree."}
                  </p>
                </div>
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

                <button
                  type="button"
                  onClick={() => {
                    if (nextAvailable) setSelectedId(nextAvailable.module.id);
                  }}
                  disabled={!nextAvailable}
                  className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Jump to next branch
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No modules are available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
