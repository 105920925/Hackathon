import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { moduleMap } from "../data/modules";
import { ModuleStepRenderer } from "../components/modules/ModuleStepRenderer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAppStore } from "../store/useAppStore";

export function ModulePlayerPage() {
  const { moduleId = "" } = useParams();
  const navigate = useNavigate();
  const module = moduleMap[moduleId];

  const moduleProgress = useAppStore((state) => state.modules[moduleId]);
  const addXp = useAppStore((state) => state.addXp);
  const setModuleProgress = useAppStore((state) => state.setModuleProgress);
  const completeModule = useAppStore((state) => state.completeModule);

  const [index, setIndex] = useState(
    moduleProgress?.highestStep ? Math.min(moduleProgress.highestStep, (module?.steps.length ?? 1) - 1) : 0,
  );
  const [scoreSum, setScoreSum] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  if (!module) return <Navigate to="/app/learn" replace />;

  const step = module.steps[index];
  const doneCount = Object.keys(completedSteps).length;
  const progressPct = Math.round(((doneCount + (moduleProgress?.highestStep ?? 0)) / module.steps.length) * 100);
  const moduleScore = doneCount === 0 ? (moduleProgress?.score ?? 0) : Math.round(scoreSum / doneCount);

  const onCompleteStep = ({ stepXp, score }: { stepXp: number; score: number }) => {
    if (completedSteps[step.id]) return;
    setCompletedSteps((prev) => ({ ...prev, [step.id]: true }));
    setScoreSum((prev) => prev + score);
    addXp(stepXp);

    const highestStep = Math.max(moduleProgress?.highestStep ?? 0, index + 1);
    setModuleProgress(module.id, highestStep, Math.round((scoreSum + score) / (doneCount + 1)));
  };

  const finishModule = () => {
    const stepsCompleted = Math.max(moduleProgress?.highestStep ?? 0, doneCount);
    const finalScore = doneCount ? Math.round(scoreSum / doneCount) : moduleProgress?.score ?? 0;
    completeModule(module.id, finalScore, stepsCompleted);
    navigate("/app/learn");
  };

  const atLastStep = index === module.steps.length - 1;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{module.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-2 rounded-full bg-muted">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(progressPct, 100)}%` }} />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Step {index + 1} of {module.steps.length}
            </span>
            <span>Score {moduleScore}%</span>
          </div>
        </CardContent>
      </Card>

      <ModuleStepRenderer step={step} completed={Boolean(completedSteps[step.id])} onStepComplete={onCompleteStep} />

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setIndex((prev) => Math.max(0, prev - 1))} disabled={index === 0}>
          Previous
        </Button>
        {!atLastStep ? (
          <Button onClick={() => setIndex((prev) => Math.min(module.steps.length - 1, prev + 1))}>Next Step</Button>
        ) : (
          <Button onClick={finishModule} className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Finish + Grow Branch
          </Button>
        )}
      </div>
    </div>
  );
}
