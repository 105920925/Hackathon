import { useMemo, useState } from "react";
import { Award, Download, GitBranch, RotateCcw, UserCircle2 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAppStore } from "../store/useAppStore";
import { modules } from "../data/modules";
import { downloadJSON, formatAUD } from "../lib/utils";
import { getTreeProgress } from "../lib/treeProgress";
import type { UserProfile } from "../types";

export function ProfilePage() {
  const { badges, moduleState, savingsGoals, savingsLog, resetProgress, darkMode, toggleDarkMode, xp, streak, profile, updateProfile } = useAppStore(
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
      profile: state.profile,
      updateProfile: state.updateProfile,
    })),
  );
  const [draft, setDraft] = useState<UserProfile>(profile);

  const completedModules = useMemo(() => modules.filter((module) => moduleState[module.id]?.completed), [moduleState]);
  const tree = getTreeProgress(moduleState, savingsGoals);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile & Progress</h1>
        <p className="text-sm text-muted-foreground">Edit your profile, export your progress, and keep your learning setup personal.</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle2 className="h-5 w-5 text-emerald-500" />
              Profile details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              <span>First name</span>
              <input
                value={draft.firstName}
                onChange={(event) => setDraft((prev) => ({ ...prev, firstName: event.target.value }))}
                className="h-11 rounded-xl border border-border bg-background px-3 md:translate-y-2"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Preferred name</span>
              <input value={draft.preferredName} onChange={(event) => setDraft((prev) => ({ ...prev, preferredName: event.target.value }))} className="h-11 rounded-xl border border-border bg-background px-3" />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Date of birth</span>
              <input type="date" value={draft.dateOfBirth} onChange={(event) => setDraft((prev) => ({ ...prev, dateOfBirth: event.target.value }))} className="h-11 rounded-xl border border-border bg-background px-3" />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>State / territory</span>
              <select value={draft.stateOrTerritory} onChange={(event) => setDraft((prev) => ({ ...prev, stateOrTerritory: event.target.value as UserProfile["stateOrTerritory"] }))} className="h-11 rounded-xl border border-border bg-background px-3">
                {["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>School year / stage</span>
              <select value={draft.schoolYear} onChange={(event) => setDraft((prev) => ({ ...prev, schoolYear: event.target.value as UserProfile["schoolYear"] }))} className="h-11 rounded-xl border border-border bg-background px-3">
                {["Year 7-8", "Year 9-10", "Year 11-12", "Finished school", "TAFE / Uni"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Main goal</span>
              <input
                value={draft.goal}
                onChange={(event) => setDraft((prev) => ({ ...prev, goal: event.target.value }))}
                className="h-11 rounded-xl border border-border bg-background px-3"
                placeholder="Example: First car, Europe trip, emergency fund"
              />
            </label>
            <div className="md:col-span-2">
              <Button onClick={() => updateProfile(draft)}>Save profile changes</Button>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-2">
          <MetricCard label="XP" value={String(xp)} />
          <MetricCard label="Streak" value={`${streak} days`} />
          <MetricCard label="Modules completed" value={`${tree.completedModules}/${tree.totalModules}`} />
          <MetricCard label="Total saved" value={formatAUD(savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0))} />
        </section>
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
            <CardTitle>Completed modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completedModules.map((item) => (
              <div key={item.id} className="rounded-xl border border-border p-3 text-sm">
                <p className="font-medium">{item.title}</p>
                <p className="text-muted-foreground">Score: {moduleState[item.id]?.score ?? 0}%</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Settings & export</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" className="md:translate-y-[10px]" onClick={toggleDarkMode}>
            {darkMode ? "Switch to light" : "Switch to dark"}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              downloadJSON("cashcraft-profile-summary.json", {
                profile,
                xp,
                streak,
                savingsGoals,
                savingsLog,
                tree,
              })
            }
          >
            <Download className="h-4 w-4" /> Export JSON
          </Button>
          <Button variant="outline" onClick={resetProgress}>
            <RotateCcw className="h-4 w-4" /> Reset Progress
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <GitBranch className="h-4 w-4 text-emerald-500" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-black">{value}</p>
      </CardContent>
    </Card>
  );
}
