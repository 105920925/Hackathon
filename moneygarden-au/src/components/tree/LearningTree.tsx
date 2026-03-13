import { motion } from "framer-motion";
import { CheckCircle2, Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = {
  branchSegments: boolean[];
  completedGoals: number;
  canopyComplete: boolean;
  title?: string;
  subtitle?: string;
};

const branchPaths = [
  "M210 355 C175 320 150 285 128 248",
  "M216 310 C182 275 164 238 150 196",
  "M232 276 C272 240 310 208 355 190",
  "M236 324 C286 302 332 274 378 248",
  "M238 360 C292 356 344 342 392 318",
];

const leafPositions = [
  { x: 132, y: 240 },
  { x: 160, y: 210 },
  { x: 208, y: 188 },
  { x: 250, y: 168 },
  { x: 304, y: 176 },
  { x: 350, y: 194 },
  { x: 386, y: 228 },
  { x: 402, y: 274 },
  { x: 372, y: 314 },
  { x: 312, y: 330 },
];

const canopyLeaves = [
  { x: 136, y: 188, r: 18 },
  { x: 170, y: 152, r: 22 },
  { x: 214, y: 138, r: 24 },
  { x: 262, y: 132, r: 28 },
  { x: 314, y: 142, r: 22 },
  { x: 356, y: 166, r: 24 },
  { x: 392, y: 202, r: 20 },
  { x: 414, y: 246, r: 18 },
  { x: 392, y: 286, r: 18 },
  { x: 340, y: 308, r: 20 },
  { x: 282, y: 314, r: 22 },
  { x: 214, y: 300, r: 22 },
];

export function LearningTree({ branchSegments, completedGoals, canopyComplete, title, subtitle }: Props) {
  const visibleGoalLeaves = leafPositions.slice(0, Math.min(completedGoals, leafPositions.length));

  return (
    <Card className="overflow-hidden border-white/60 bg-white/85 shadow-[0_24px_80px_-40px_rgba(14,116,144,0.45)] backdrop-blur dark:border-white/10 dark:bg-zinc-950/70">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{title ?? "Learning Tree"}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle ?? "Modules extend the branches. Completed savings goals add reward leaves."}</p>
          </div>
          <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {canopyComplete ? "Canopy Complete" : "Tree in Progress"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.16),transparent_24%),linear-gradient(180deg,rgba(250,252,255,0.98),rgba(235,244,255,0.94))] p-4 dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(56,189,248,0.18),transparent_24%),linear-gradient(180deg,rgba(9,15,25,0.98),rgba(11,22,36,0.96))]">
          <div className="absolute right-5 top-5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm dark:bg-zinc-900/80 dark:text-sky-300">
            {visibleGoalLeaves.length} reward leaves
          </div>
          <svg viewBox="0 0 440 420" className="mx-auto h-auto w-full max-w-3xl" role="img" aria-label="Learning tree progress visual">
            <defs>
              <linearGradient id="tree-trunk" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b5a2b" />
                <stop offset="100%" stopColor="#5b3716" />
              </linearGradient>
              <linearGradient id="tree-branch" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c4a1f" />
                <stop offset="100%" stopColor="#4a2a10" />
              </linearGradient>
              <linearGradient id="tree-leaf" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
              <linearGradient id="goal-leaf" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            <ellipse cx="220" cy="386" rx="136" ry="24" fill="rgba(52,211,153,0.18)" />
            <circle cx="78" cy="76" r="30" fill="rgba(253,224,71,0.9)" />

            <motion.path
              d="M220 370 C205 308 204 242 216 170"
              fill="none"
              stroke="url(#tree-trunk)"
              strokeWidth="26"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {branchPaths.map((path, index) => (
              <motion.path
                key={path}
                d={path}
                fill="none"
                stroke="url(#tree-branch)"
                strokeWidth={index < 2 ? 12 : 10}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.25 }}
                animate={{
                  pathLength: branchSegments[index] ? 1 : 0.08,
                  opacity: branchSegments[index] ? 1 : 0.2,
                }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
              />
            ))}

            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              {visibleGoalLeaves.map((leaf, index) => (
                <motion.g
                  key={`${leaf.x}-${leaf.y}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.15 * index }}
                >
                  <ellipse cx={leaf.x} cy={leaf.y} rx="12" ry="8" fill="url(#goal-leaf)" transform={`rotate(${index * 22 - 30} ${leaf.x} ${leaf.y})`} />
                  <path d={`M${leaf.x - 3} ${leaf.y + 6} q4 8 10 10`} stroke="#166534" strokeWidth="2" fill="none" strokeLinecap="round" />
                </motion.g>
              ))}
            </motion.g>

            {canopyComplete && (
              <motion.g initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65 }}>
                {canopyLeaves.map((leaf) => (
                  <motion.circle
                    key={`${leaf.x}-${leaf.y}`}
                    cx={leaf.x}
                    cy={leaf.y}
                    r={leaf.r}
                    fill="url(#tree-leaf)"
                    fillOpacity="0.88"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 150, damping: 15 }}
                  />
                ))}
                <motion.circle
                  cx="282"
                  cy="168"
                  r="72"
                  fill="rgba(34,197,94,0.12)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0.2] }}
                  transition={{ duration: 1.4 }}
                />
              </motion.g>
            )}
          </svg>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-white/80 p-3 text-sm shadow-sm dark:bg-zinc-900/70">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Branch growth
              </div>
              <p className="text-muted-foreground">Each completed module extends the tree with a new branch segment.</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-3 text-sm shadow-sm dark:bg-zinc-900/70">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <Leaf className="h-4 w-4 text-emerald-500" />
                Goal leaves
              </div>
              <p className="text-muted-foreground">Each completed savings goal adds a fresh leaf reward to the tree.</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-3 text-sm shadow-sm dark:bg-zinc-900/70">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-sky-500" />
                Final canopy
              </div>
              <p className="text-muted-foreground">Complete all five modules to unlock the full canopy effect across the tree crown.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
