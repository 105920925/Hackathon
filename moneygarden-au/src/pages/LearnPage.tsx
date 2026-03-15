import { useMemo, useState } from "react";
import { Map, Sparkles } from "lucide-react";
import { modules } from "../data/modules";
import { useAppStore } from "../store/useAppStore";
import { ModuleCard } from "../components/modules/ModuleCard";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import type { ModuleFilter } from "../types";
import { getTreeProgress } from "../lib/treeProgress";
import { SkillTree } from "../components/tree/SkillTree";

const filters: Array<"All" | ModuleFilter> = ["All", "New", "Popular", "Quick 5-min"];

export function LearnPage() {
  const [activeFilter, setActiveFilter] = useState<"All" | ModuleFilter>("All");
  const moduleProgress = useAppStore((state) => state.modules);
  const savingsGoals = useAppStore((state) => state.savingsGoals);

  const visibleModules = useMemo(() => {
    if (activeFilter === "All") return modules;
    return modules.filter((module) => module.filterTags.includes(activeFilter));
  }, [activeFilter]);

  const tree = getTreeProgress(moduleProgress, savingsGoals);

  return (
    <div className="space-y-6">
      <section className="grid gap-5 rounded-[30px] bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(56,189,248,0.18),transparent_24%),linear-gradient(135deg,#fafffc,#eff6ff)] p-6 shadow-[0_24px_80px_-46px_rgba(14,116,144,0.45)] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.2),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(56,189,248,0.18),transparent_24%),linear-gradient(135deg,#07111d,#0d1726)] xl:grid-cols-[1.05fr_0.95fr] xl:grid">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm dark:bg-zinc-900/80 dark:text-sky-300">
            <Map className="h-4 w-4" />
            Follow the branch path module by module
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Learning journey</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              The learning section is your branch-growth map. Each finished module extends the tree, and finishing all five unlocks the canopy.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {modules.map((module) => {
              const completed = Boolean(moduleProgress[module.id]?.completed);
              return (
                <div key={module.id} className={`rounded-2xl border p-3 text-sm ${completed ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20" : "border-border bg-white/70 dark:bg-zinc-900/60"}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Module {module.moduleNumber}</p>
                  <p className="mt-1 font-semibold">{module.title}</p>
                  <p className="mt-1 text-muted-foreground">{completed ? "Branch grown" : module.branchLabel}</p>
                </div>
              );
            })}
          </div>
        </div>

        <SkillTree
          modules={modules}
          moduleState={moduleProgress}
          title="Skill tree preview"
          subtitle="Module progression only. Savings goals now live on their own dedicated page."
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">All modules</h2>
          <p className="text-sm text-muted-foreground">Australian-focused lessons for saving, borrowing, tax, investing, and smart spending.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          {tree.completedModules} of {tree.totalModules} branches grown
        </div>
      </div>

      <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as typeof activeFilter)}>
        <TabsList>
          {filters.map((item) => (
            <TabsTrigger key={item} value={item}>
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleModules.map((module) => {
          const progress = moduleProgress[module.id];
          const completedSteps = progress?.highestStep ?? 0;
          const completion = Math.round((completedSteps / module.steps.length) * 100);

          return (
            <ModuleCard
              key={module.id}
              module={module}
              completion={Number.isNaN(completion) ? 0 : completion}
              completed={Boolean(progress?.completed)}
            />
          );
        })}
      </div>
    </div>
  );
}
