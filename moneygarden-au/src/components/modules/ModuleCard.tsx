import { Clock3 } from "lucide-react";
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
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${module.themeColor}`} />
      <CardHeader>
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
        <div className="mb-4 h-2 rounded-full bg-muted">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${completion}%` }} />
        </div>
        <Button asChild className="w-full" variant={completed ? "secondary" : "default"}>
          <Link to={`/app/learn/${module.id}`}>{completed ? "Replay Module" : "Start Module"}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

