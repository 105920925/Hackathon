import { GitBranch, Leaf, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = {
  completedModules: number;
  totalModules: number;
  completedGoals: number;
  totalGoals: number;
  canopyComplete: boolean;
};

export function TreeProgress({ completedModules, totalModules, completedGoals, totalGoals, canopyComplete }: Props) {
  const modulePct = totalModules === 0 ? 0 : Math.round((completedModules / totalModules) * 100);
  const goalPct = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <GitBranch className="h-4 w-4 text-emerald-500" />
            Modules completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-black text-emerald-600">{completedModules}/{totalModules}</p>
          <div className="mt-3 h-2 rounded-full bg-muted">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${modulePct}%` }} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Leaf className="h-4 w-4 text-teal-500" />
            Savings goals completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-black text-teal-600">{completedGoals}/{totalGoals}</p>
          <div className="mt-3 h-2 rounded-full bg-muted">
            <div className="h-full rounded-full bg-teal-500" style={{ width: `${goalPct}%` }} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-sky-500" />
            Canopy status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-black text-sky-600">{canopyComplete ? "Unlocked" : "In progress"}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {canopyComplete ? "All learning modules are complete and the canopy is now fully revealed." : "Finish every learning module to trigger the final canopy reveal."}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
