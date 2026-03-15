import { useShallow } from "zustand/react/shallow";
import { SavingsGoalsHero } from "../components/savings/SavingsGoalsHero";
import { SavingsGoalsList } from "../components/tree/SavingsGoalsList";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { formatAUD } from "../lib/utils";
import { useAppStore } from "../store/useAppStore";

export function SavingsGoalsPage() {
  const { savingsGoals, savingsLog, addSavingsGoal, updateSavingsGoal, removeSavingsGoal, logSavings } = useAppStore(
    useShallow((state) => ({
      savingsGoals: state.savingsGoals,
      savingsLog: state.savingsLog,
      addSavingsGoal: state.addSavingsGoal,
      updateSavingsGoal: state.updateSavingsGoal,
      removeSavingsGoal: state.removeSavingsGoal,
      logSavings: state.logSavings,
    })),
  );

  return (
    <div className="space-y-6">
      <SavingsGoalsHero savingsGoals={savingsGoals} />

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <SavingsGoalsList savingsGoals={savingsGoals} onAddGoal={addSavingsGoal} onUpdateGoal={updateSavingsGoal} onRemoveGoal={removeSavingsGoal} onDeposit={logSavings} />

        <Card className="border-white/60 bg-white/85 shadow-sm dark:border-white/10 dark:bg-zinc-950/70">
          <CardHeader>
            <CardTitle>Recent savings activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {savingsLog.slice(0, 8).map((entry) => {
              const goal = savingsGoals.find((item) => item.id === entry.goalId);
              return (
                <div key={entry.id} className="flex items-center justify-between rounded-2xl border border-border p-3 text-sm">
                  <div>
                    <p className="font-semibold">{goal?.title ?? "Savings goal"}</p>
                    <p className="text-muted-foreground">{entry.date}</p>
                  </div>
                  <p className="font-semibold text-emerald-600">{formatAUD(entry.amount)}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
