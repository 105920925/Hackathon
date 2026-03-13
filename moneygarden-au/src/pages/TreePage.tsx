import { motion } from "framer-motion";
import { BookOpen, Clock3, Sparkles } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { modules } from "../data/modules";
import { getTreeProgress } from "../lib/treeProgress";
import { formatAUD } from "../lib/utils";
import { useAppStore } from "../store/useAppStore";
import { LearningTree } from "../components/tree/LearningTree";
import { SavingsGoalsList } from "../components/tree/SavingsGoalsList";
import { TreeProgress } from "../components/tree/TreeProgress";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function TreePage() {
  const { moduleState, savingsGoals, savingsLog, addSavingsGoal, updateSavingsGoal, removeSavingsGoal, logSavings } = useAppStore(
    useShallow((state) => ({
      moduleState: state.modules,
      savingsGoals: state.savingsGoals,
      savingsLog: state.savingsLog,
      addSavingsGoal: state.addSavingsGoal,
      updateSavingsGoal: state.updateSavingsGoal,
      removeSavingsGoal: state.removeSavingsGoal,
      logSavings: state.logSavings,
    })),
  );

  const tree = getTreeProgress(moduleState, savingsGoals);
  const nextModule = modules.find((module) => !moduleState[module.id]?.completed) ?? null;

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.2),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(56,189,248,0.18),transparent_24%),linear-gradient(135deg,#f8fffb,#edf7ff)] p-6 shadow-[0_30px_80px_-48px_rgba(14,116,144,0.55)] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(56,189,248,0.2),transparent_22%),linear-gradient(135deg,#07111d,#0a1727)]">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:bg-zinc-900/80 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" />
              One tree. Every lesson and savings win feeds it.
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">Learning Tree</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                Complete modules to extend the branches. Finish savings goals to earn fresh leaves. When all five modules are done, the canopy fills in across the whole tree.
              </p>
            </div>
            <TreeProgress
              completedModules={tree.completedModules}
              totalModules={tree.totalModules}
              completedGoals={tree.completedGoals}
              totalGoals={tree.totalGoals}
              canopyComplete={tree.canopyComplete}
            />
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <LearningTree
              branchSegments={tree.branchSegments}
              completedGoals={tree.completedGoals}
              canopyComplete={tree.canopyComplete}
              subtitle="Branch Growth comes from modules. Leaf rewards come from completed savings goals."
            />
          </motion.div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/60 bg-white/85 shadow-sm dark:border-white/10 dark:bg-zinc-950/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-500" />
              Branch Growth roadmap
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {modules.map((module) => {
              const completed = Boolean(moduleState[module.id]?.completed);
              return (
                <div
                  key={module.id}
                  className={`rounded-2xl border p-4 transition ${completed ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20" : "border-border bg-background/60"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Module {module.moduleNumber}</p>
                      <p className="font-semibold">{module.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{module.branchLabel}</p>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-semibold ${completed ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>
                      {completed ? "Branch grown" : "Not complete"}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-white/60 bg-white/85 shadow-sm dark:border-white/10 dark:bg-zinc-950/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-sky-500" />
              Momentum snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Next recommended module</p>
              <p className="mt-1 font-semibold">{nextModule?.title ?? "All modules complete"}</p>
              <p className="mt-1 text-sm text-muted-foreground">{nextModule?.shortDescription ?? "Your canopy is complete. Revisit any module for a refresher."}</p>
            </div>
            <div className="rounded-2xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Recent savings activity</p>
              <div className="mt-2 space-y-2">
                {savingsLog.slice(0, 4).map((entry) => {
                  const goal = savingsGoals.find((item) => item.id === entry.goalId);
                  return (
                    <div key={entry.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{goal?.title ?? "Savings goal"}</p>
                        <p className="text-muted-foreground">{entry.date}</p>
                      </div>
                      <span className="font-semibold text-emerald-600">{formatAUD(entry.amount)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Savings goals</h2>
          <p className="text-sm text-muted-foreground">Create as many goals as you need. Each completed goal adds its own reward leaf to the tree.</p>
        </div>
        <SavingsGoalsList savingsGoals={savingsGoals} onAddGoal={addSavingsGoal} onUpdateGoal={updateSavingsGoal} onRemoveGoal={removeSavingsGoal} onDeposit={logSavings} />
      </section>
    </div>
  );
}
