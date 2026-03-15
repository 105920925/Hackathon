import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import type { LearningModule, ModuleProgress } from "../../types";
import { ModuleIconGlyph } from "../modules/moduleIcons";
import { cn } from "../../lib/utils";

type Props = {
  modules: LearningModule[];
  moduleState: Record<string, ModuleProgress>;
  title?: string;
  subtitle?: string;
};

const nodePositions = [
  { x: 14, y: 68 },
  { x: 32, y: 38 },
  { x: 50, y: 18 },
  { x: 70, y: 40 },
  { x: 86, y: 70 },
];

export function SkillTree({ modules, moduleState, title, subtitle }: Props) {
  const states = modules.map((module, index) => {
    const completed = Boolean(moduleState[module.id]?.completed);
    const previousComplete = index === 0 ? true : Boolean(moduleState[modules[index - 1].id]?.completed);
    const highestStep = moduleState[module.id]?.highestStep ?? 0;
    const available = !completed && previousComplete;
    const locked = !completed && !previousComplete;
    const inProgress = !completed && highestStep > 0;
    return { module, completed, available, locked, inProgress };
  });

  return (
    <div className="rounded-[34px] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_24%),radial-gradient(circle_at_85%_18%,rgba(56,189,248,0.16),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(242,248,255,0.94))] p-5 shadow-[0_30px_90px_-54px_rgba(14,116,144,0.55)] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.2),transparent_24%),radial-gradient(circle_at_85%_18%,rgba(56,189,248,0.18),transparent_24%),linear-gradient(180deg,rgba(7,17,29,0.98),rgba(12,20,34,0.96))]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">{title ?? "Finance Skill Tree"}</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {subtitle ?? "Unlock each knowledge branch in order. Completed modules glow, the next module pulses, and locked nodes stay sealed until the path is ready."}
          </p>
        </div>
        <div className="rounded-full bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {states.filter((item) => item.completed).length} / {modules.length} skills unlocked
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="relative h-[520px] rounded-[30px] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.45),rgba(219,234,254,0.12))] p-6 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.55),rgba(30,41,59,0.18))]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="skill-line" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            {nodePositions.slice(0, -1).map((node, index) => {
              const next = nodePositions[index + 1];
              const complete = states[index].completed;
              return (
                <path
                  key={`${node.x}-${node.y}`}
                  d={`M ${node.x} ${node.y} C ${node.x + 8} ${node.y - 18}, ${next.x - 8} ${next.y + 18}, ${next.x} ${next.y}`}
                  fill="none"
                  stroke="url(#skill-line)"
                  strokeWidth="1.6"
                  strokeDasharray={complete ? "0" : "5 4"}
                  opacity={complete ? 0.9 : 0.35}
                />
              );
            })}
          </svg>

          {states.map((item, index) => {
            const position = nodePositions[index];
            return (
              <motion.div
                key={item.module.id}
                className="absolute"
                style={{ left: `${position.x}%`, top: `${position.y}%`, transform: "translate(-50%, -50%)" }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  to={item.locked ? "#" : `/app/learn/${item.module.id}`}
                  onClick={(event) => {
                    if (item.locked) event.preventDefault();
                  }}
                  className={cn(
                    "group block w-[220px] rounded-[28px] border p-4 backdrop-blur transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                    item.completed && "border-emerald-300 bg-emerald-50/90 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_24px_70px_-42px_rgba(16,185,129,0.75)] dark:border-emerald-900 dark:bg-emerald-950/30",
                    item.available && "border-sky-300 bg-sky-50/90 shadow-[0_0_0_1px_rgba(56,189,248,0.15),0_24px_70px_-42px_rgba(56,189,248,0.75)] dark:border-sky-900 dark:bg-sky-950/25",
                    item.inProgress && "ring-1 ring-amber-300 dark:ring-amber-800",
                    item.locked && "border-border/70 bg-zinc-100/70 opacity-75 dark:bg-zinc-900/60",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={cn("inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", item.module.themeColor, item.locked && "grayscale")}>
                      <ModuleIconGlyph icon={item.module.icon} className="h-6 w-6" />
                    </div>
                    <div className="rounded-full bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Module {item.module.moduleNumber}
                    </div>
                  </div>
                  <p className="mt-4 text-lg font-bold">{item.module.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.module.shortDescription}</p>
                  <div className="mt-4 flex items-center justify-between text-xs font-semibold">
                    <span className={cn(item.completed && "text-emerald-700 dark:text-emerald-300", item.available && "text-sky-700 dark:text-sky-300", item.locked && "text-muted-foreground")}>
                      {item.completed ? "Completed" : item.locked ? "Locked" : item.inProgress ? "In progress" : "Ready to unlock"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      {item.completed ? <CheckCircle2 className="h-4 w-4" /> : item.locked ? <Lock className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 lg:hidden">
        {states.map((item) => (
          <Link
            key={item.module.id}
            to={item.locked ? "#" : `/app/learn/${item.module.id}`}
            onClick={(event) => {
              if (item.locked) event.preventDefault();
            }}
            className={cn(
              "rounded-[26px] border p-4",
              item.completed && "border-emerald-300 bg-emerald-50/90 dark:border-emerald-900 dark:bg-emerald-950/30",
              item.available && "border-sky-300 bg-sky-50/90 dark:border-sky-900 dark:bg-sky-950/25",
              item.locked && "border-border/70 bg-muted/40 opacity-75",
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn("inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white", item.module.themeColor)}>
                <ModuleIconGlyph icon={item.module.icon} className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{item.module.title}</p>
                <p className="text-xs text-muted-foreground">{item.completed ? "Completed" : item.locked ? "Locked" : "Available"}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
