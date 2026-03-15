import { motion } from "framer-motion";
import { Gem, Target } from "lucide-react";
import type { SavingsGoal } from "../../types";
import { formatAUD } from "../../lib/utils";

type Props = {
  savingsGoals: SavingsGoal[];
};

export function SavingsGoalsHero({ savingsGoals }: Props) {
  const completed = savingsGoals.filter((goal) => Boolean(goal.completedAt)).length;
  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  return (
    <section className="rounded-[36px] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_24%),radial-gradient(circle_at_80%_16%,rgba(14,165,233,0.18),transparent_20%),linear-gradient(135deg,#eff9ff,#f8fdff)] p-6 shadow-[0_30px_90px_-52px_rgba(14,116,144,0.6)] dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_80%_16%,rgba(14,165,233,0.18),transparent_20%),linear-gradient(135deg,#07111d,#0a1627)]">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm dark:bg-zinc-900/80 dark:text-sky-300">
            <Target className="h-4 w-4" />
            Savings Goals HQ
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">Build your own savings constellation</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              This page is separate from the learning skill tree. It is your goal tracker, progress chamber, and momentum board for everything you are saving toward in AUD.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Active goals" value={String(savingsGoals.length)} />
            <StatCard label="Completed goals" value={String(completed)} />
            <StatCard label="Total saved" value={formatAUD(totalSaved)} />
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(224,242,254,0.38))] p-5 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.72),rgba(12,20,34,0.48))]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45),transparent_48%)] dark:bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.14),transparent_48%)]" />
          <svg viewBox="0 0 420 280" className="relative z-10 h-full w-full">
            {savingsGoals.map((goal, index) => {
              const pct = Math.min(goal.currentAmount / goal.targetAmount, 1);
              const x = 80 + index * 110;
              const y = 90 + (index % 2) * 70;
              return (
                <g key={goal.id}>
                  <motion.line
                    x1="210"
                    y1="140"
                    x2={x}
                    y2={y}
                    stroke="rgba(14,165,233,0.38)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: index * 0.08 }}
                  />
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={22 + pct * 14}
                    fill={goal.completedAt ? "rgba(34,197,94,0.88)" : "rgba(14,165,233,0.82)"}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 180, damping: 14, delay: index * 0.08 }}
                  />
                  <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
                    {Math.round(pct * 100)}%
                  </text>
                </g>
              );
            })}

            <motion.circle
              cx="210"
              cy="140"
              r="42"
              fill="rgba(14,165,233,0.9)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 14 }}
            />
            <foreignObject x="180" y="110" width="60" height="60">
              <div className="flex h-full w-full items-center justify-center text-white">
                <Gem className="h-8 w-8" />
              </div>
            </foreignObject>
          </svg>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-border/70 bg-white/70 p-4 dark:bg-zinc-900/70">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}
