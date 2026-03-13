import { useMemo, useState } from "react";
import { Award, Download, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAppStore } from "../store/useAppStore";
import { modules } from "../data/modules";
import { downloadJSON, formatAUD } from "../lib/utils";
import { useShallow } from "zustand/react/shallow";

export function ProfilePage() {
  const [goalTitle, setGoalTitle] = useState("");
  const [goalAmount, setGoalAmount] = useState(0);
  const [timeline, setTimeline] = useState(0);

  const {
    badges,
    modules: progress,
    savingsGoal,
    savingsLog,
    updateSavingsGoal,
    resetProgress,
    darkMode,
    toggleDarkMode,
    xp,
    streak,
    inventory,
  } = useAppStore(
    useShallow((state) => ({
      badges: state.badges,
      modules: state.modules,
      savingsGoal: state.savingsGoal,
      savingsLog: state.savingsLog,
      updateSavingsGoal: state.updateSavingsGoal,
      resetProgress: state.resetProgress,
      darkMode: state.darkMode,
      toggleDarkMode: state.toggleDarkMode,
      xp: state.xp,
      streak: state.streak,
      inventory: state.inventory,
    })),
  );

  const completed = useMemo(() => modules.filter((module) => progress[module.id]?.completed), [progress]);

  const saveGoal = () => {
    if (goalAmount <= 0 || timeline <= 0 || !goalTitle.trim()) return;
    updateSavingsGoal(goalAmount, timeline, goalTitle.trim());
    setGoalAmount(0);
    setTimeline(0);
    setGoalTitle("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile & Progress</h1>
        <p className="text-sm text-muted-foreground">Track streaks, badges, modules, and preferences.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm">XP</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-black">{xp}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Streak</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-black">{streak} days</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Garden Inventory</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{inventory.join(", ")}</p></CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {badges.map((badge) => (
              <div key={badge.id} className="flex items-start gap-2 rounded-xl border border-border p-3">
                <Award className="mt-0.5 h-4 w-4 text-amber-500" />
                <div>
                  <p className="font-medium">{badge.label}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completed.length === 0 ? (
              <p className="text-sm text-muted-foreground">No modules completed yet.</p>
            ) : (
              completed.map((item) => (
                <div key={item.id} className="rounded-xl border border-border p-3 text-sm">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-muted-foreground">Score: {progress[item.id]?.score ?? 0}%</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Savings Goal Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <input className="h-10 rounded-xl border border-border bg-background px-3" placeholder={savingsGoal.title} value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} />
          <input type="number" className="h-10 rounded-xl border border-border bg-background px-3" placeholder={String(savingsGoal.targetAmount)} value={goalAmount || ""} onChange={(e) => setGoalAmount(Number(e.target.value))} />
          <input type="number" className="h-10 rounded-xl border border-border bg-background px-3" placeholder={String(savingsGoal.timelineWeeks)} value={timeline || ""} onChange={(e) => setTimeline(Number(e.target.value))} />
          <div className="md:col-span-3 flex flex-wrap gap-2">
            <Button onClick={saveGoal}>Update Goal</Button>
            <Button variant="outline" onClick={toggleDarkMode}>{darkMode ? "Switch to light" : "Switch to dark"}</Button>
            <Button
              variant="outline"
              className="inline-flex items-center gap-2"
              onClick={() =>
                downloadJSON("moneygarden-summary.json", {
                  xp,
                  streak,
                  savingsGoal,
                  savingsLog,
                  completedModules: completed.map((m) => ({ id: m.id, title: m.title, score: progress[m.id]?.score ?? 0 })),
                })
              }
            >
              <Download className="h-4 w-4" /> Export JSON
            </Button>
            <Button variant="outline" className="inline-flex items-center gap-2" onClick={resetProgress}>
              <RotateCcw className="h-4 w-4" /> Reset Progress
            </Button>
          </div>
          <p className="md:col-span-3 text-xs text-muted-foreground">Current goal: {savingsGoal.title} ({formatAUD(savingsGoal.currentAmount)} / {formatAUD(savingsGoal.targetAmount)})</p>
        </CardContent>
      </Card>
    </div>
  );
}
