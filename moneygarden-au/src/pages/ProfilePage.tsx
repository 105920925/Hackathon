import { useMemo } from "react";
import { Award, Download, GitBranch, Leaf, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAppStore } from "../store/useAppStore";
import { modules } from "../data/modules";
import { downloadJSON, formatAUD } from "../lib/utils";
import { useShallow } from "zustand/react/shallow";
import { getTreeProgress } from "../lib/treeProgress";

export function ProfilePage() {
  const { badges, moduleState, savingsGoals, savingsLog, resetProgress, darkMode, toggleDarkMode, xp, streak } = useAppStore(
    useShallow((state) => ({
      badges: state.badges,
      moduleState: state.modules,
      savingsGoals: state.savingsGoals,
      savingsLog: state.savingsLog,
      resetProgress: state.resetProgress,
      darkMode: state.darkMode,
      toggleDarkMode: state.toggleDarkMode,
      xp: state.xp,
      streak: state.streak,
    })),
  );

  const completedModules = useMemo(() => modules.filter((module) => moduleState[module.id]?.completed), [moduleState]);
  const tree = getTreeProgress(moduleState, savingsGoals);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile & Progress</h1>
        <p className="text-sm text-muted-foreground">Track your learning tree, completed modules, savings goals, and app preferences.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">XP</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-black">{xp}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Streak</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-black">{streak} days</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Modules completed</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-emerald-500" />
            <p className="text-3xl font-black">{tree.completedModules}/{tree.totalModules}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Goal leaves earned</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-teal-500" />
            <p className="text-3xl font-black">{tree.completedGoals}</p>
          </CardContent>
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
            {completedModules.length === 0 ? (
              <p className="text-sm text-muted-foreground">No modules completed yet.</p>
            ) : (
              completedModules.map((item) => (
                <div key={item.id} className="rounded-xl border border-border p-3 text-sm">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-muted-foreground">Score: {moduleState[item.id]?.score ?? 0}%</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Progress export & settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-muted/50 p-4 text-sm">
              <p className="text-muted-foreground">Active savings goals</p>
              <p className="mt-1 text-2xl font-black">{savingsGoals.length}</p>
            </div>
            <div className="rounded-2xl bg-muted/50 p-4 text-sm">
              <p className="text-muted-foreground">Total saved across goals</p>
              <p className="mt-1 text-2xl font-black">{formatAUD(savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0))}</p>
            </div>
            <div className="rounded-2xl bg-muted/50 p-4 text-sm">
              <p className="text-muted-foreground">Canopy status</p>
              <p className="mt-1 text-2xl font-black">{tree.canopyComplete ? "Unlocked" : "In progress"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={toggleDarkMode}>{darkMode ? "Switch to light" : "Switch to dark"}</Button>
            <Button
              variant="outline"
              className="inline-flex items-center gap-2"
              onClick={() =>
                downloadJSON("learning-tree-summary.json", {
                  xp,
                  streak,
                  savingsGoals,
                  savingsLog,
                  tree,
                  completedModules: completedModules.map((module) => ({
                    id: module.id,
                    title: module.title,
                    score: moduleState[module.id]?.score ?? 0,
                  })),
                })
              }
            >
              <Download className="h-4 w-4" /> Export JSON
            </Button>
            <Button variant="outline" className="inline-flex items-center gap-2" onClick={resetProgress}>
              <RotateCcw className="h-4 w-4" /> Reset Progress
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
