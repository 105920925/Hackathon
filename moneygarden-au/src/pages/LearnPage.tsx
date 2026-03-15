import { useMemo, useState } from "react";
import { Map, Sparkles } from "lucide-react";
import { modules } from "../data/modules";
import { useAppStore } from "../store/useAppStore";
import { ModuleCard } from "../components/modules/ModuleCard";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import type { ModuleFilter } from "../types";
import { SkillTree } from "../components/tree/SkillTree";

const filters: Array<"All" | ModuleFilter> = ["All", "New", "Popular", "Quick 5-min"];

export function LearnPage() {
  const [activeFilter, setActiveFilter] = useState<"All" | ModuleFilter>("All");
  const moduleProgress = useAppStore((state) => state.modules);

  const visibleModules = useMemo(() => {
    if (activeFilter === "All") return modules;
    return modules.filter((module) => module.filterTags.includes(activeFilter));
  }, [activeFilter]);

  return (
    <div className="space-y-6">
      <section className="space-y-5 rounded-[30px] bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(56,189,248,0.18),transparent_24%),linear-gradient(135deg,#fafffc,#eff6ff)] p-6 shadow-[0_24px_80px_-46px_rgba(14,116,144,0.45)] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.2),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(56,189,248,0.18),transparent_24%),linear-gradient(135deg,#07111d,#0d1726)]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm dark:bg-zinc-900/80 dark:text-sky-300">
            <Map className="h-4 w-4" />
            Start from the trunk and unlock each branch
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Learning journey</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Begin at Fundamentals, then grow your learning tree by finishing each module in order.
            </p>
          </div>
        </div>

        <SkillTree
          modules={modules}
          moduleState={moduleProgress}
          title="Learning tree"
          subtitle="Fundamentals is your root node. Finish a module to unlock the next branch above it."
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">All modules</h2>
          <p className="text-sm text-muted-foreground">Australian-focused lessons for saving, borrowing, tax, investing, and smart spending.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          Modules unlock one by one as your tree grows
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
