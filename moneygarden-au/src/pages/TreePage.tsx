import { BookOpen, Lock, Sparkles, Trophy } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { modules } from "../data/modules";
import { useAppStore } from "../store/useAppStore";
import { SkillTree } from "../components/tree/SkillTree";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function TreePage() {
  const { moduleState, profile } = useAppStore(
    useShallow((state) => ({
      moduleState: state.modules,
      profile: state.profile,
    })),
  );

  const completedCount = modules.filter((module) => moduleState[module.id]?.completed).length;
  const nextModule = modules.find((module, index) => {
    if (moduleState[module.id]?.completed) return false;
    return index === 0 || Boolean(moduleState[modules[index - 1].id]?.completed);
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[34px] bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(56,189,248,0.18),transparent_22%),linear-gradient(135deg,#f9fffb,#eef7ff)] p-6 shadow-[0_30px_90px_-54px_rgba(14,116,144,0.55)] dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.2),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(56,189,248,0.2),transparent_22%),linear-gradient(135deg,#07111d,#0c1728)]">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:bg-zinc-900/80 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" />
              Learning-only skill tree
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">{profile.preferredName || "Your"} finance skill tree</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                Unlock financial knowledge like a game progression path. Savings goals now live on their own page, so this tree focuses only on module mastery.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard icon={BookOpen} label="Skills completed" value={`${completedCount}/${modules.length}`} />
            <StatCard icon={Lock} label="Skills locked" value={String(modules.length - completedCount - (nextModule ? 1 : 0))} />
            <StatCard icon={Trophy} label="Canopy status" value={completedCount === modules.length ? "Unlocked" : "In progress"} />
          </div>
        </div>
      </section>

      <SkillTree modules={modules} moduleState={moduleState} />

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="border-white/60 bg-white/85 shadow-sm dark:border-white/10 dark:bg-zinc-950/70">
          <CardHeader>
            <CardTitle>Next recommended unlock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold">{nextModule?.title ?? "All skills unlocked"}</p>
            <p className="text-muted-foreground">{nextModule?.shortDescription ?? "Every module is complete. Revisit any lesson to refresh your knowledge."}</p>
          </CardContent>
        </Card>

        <Card className="border-white/60 bg-white/85 shadow-sm dark:border-white/10 dark:bg-zinc-950/70">
          <CardHeader>
            <CardTitle>How this tree works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Modules unlock in sequence so the path feels like a skill progression rather than a random list.</p>
            <p>Lesson completion, the interactive activity, and the final quiz all still feed into the existing saved module progress logic.</p>
            <p>Savings goals are now tracked separately, so this page stays focused on learning progression only.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof BookOpen; label: string; value: string }) {
  return (
    <div className="rounded-[26px] border border-border/70 bg-white/75 p-4 dark:bg-zinc-900/70">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-3 text-2xl font-black">{value}</p>
    </div>
  );
}
