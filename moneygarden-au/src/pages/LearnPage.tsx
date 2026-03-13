import { useMemo, useState } from "react";
import { modules } from "../data/modules";
import { useAppStore } from "../store/useAppStore";
import { ModuleCard } from "../components/modules/ModuleCard";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import type { ModuleFilter } from "../types";

const filters: Array<"All" | ModuleFilter> = ["All", "New", "Popular", "Quick 5-min"];

export function LearnPage() {
  const [activeFilter, setActiveFilter] = useState<"All" | ModuleFilter>("All");
  const moduleProgress = useAppStore((state) => state.modules);

  const visibleModules = useMemo(() => {
    if (activeFilter === "All") return modules;
    return modules.filter((module) => module.filterTags.includes(activeFilter));
  }, [activeFilter]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Learn Hub</h1>
        <p className="text-sm text-muted-foreground">Interactive modules designed for Australian teens.</p>
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

