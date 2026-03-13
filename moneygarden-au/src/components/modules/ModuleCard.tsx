import { CheckCircle2, Clock3, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";
import type { LearningModule } from "../../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

type Props = {
  module: LearningModule;
  completion: number;
  completed: boolean;
};

export function ModuleCard({ module, completion, completed }: Props) {
  return (
    <Card className="relative overflow-hidden border-white/60 bg-white/85 shadow-sm dark:border-white/10 dark:bg-zinc-950/70">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${module.themeColor}`} />
      <CardHeader>
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Module {module.moduleNumber}
          </span>
          {completed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Branch grown
            </span>
          ) : null}
        </div>
        <CardTitle className="text-base">{module.title}</CardTitle>
        <CardDescription>{module.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>{module.difficulty}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-4 w-4" /> {module.minutes} min
          </span>
        </div>
        <div className="mb-3 rounded-2xl bg-muted/50 p-3 text-sm">
          <div className="mb-1 flex items-center gap-2 font-semibold">
            <GitBranch className="h-4 w-4 text-emerald-500" />
            Branch growth reward
          </div>
          <p className="text-muted-foreground">{module.branchLabel}</p>
        </div>
        <div className="mb-4 h-2 rounded-full bg-muted">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${completion}%` }} />
        </div>
        <Button asChild className="w-full" variant={completed ? "secondary" : "default"}>
          <Link to={`/app/learn/${module.id}`}>{completed ? "Replay module" : "Start module"}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
