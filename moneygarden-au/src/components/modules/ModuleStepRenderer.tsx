import { useMemo, useState } from "react";
import type { ModuleStep } from "../../types";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { cn } from "../../lib/utils";

type Props = {
  step: ModuleStep;
  completed: boolean;
  onStepComplete: (payload: { stepXp: number; score: number }) => void;
};

export function ModuleStepRenderer({ step, completed, onStepComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState(
    step.type === "slider" ? Math.round((step.min + step.max) / 2) : 0,
  );
  const [scenarioChoice, setScenarioChoice] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<Record<string, "Need" | "Want" | null>>(() => {
    if (step.type !== "match") return {};
    return Object.fromEntries(step.pairs.map((pair) => [pair.item, null]));
  });

  const matchAccuracy = useMemo(() => {
    if (step.type !== "match") return 0;
    const total = step.pairs.length;
    const correct = step.pairs.filter((pair) => assignments[pair.item] === pair.category).length;
    return Math.round((correct / total) * 100);
  }, [assignments, step]);

  const isReady = useMemo(() => {
    if (completed) return false;
    switch (step.type) {
      case "info":
        return true;
      case "quiz":
        return selected !== null;
      case "slider":
        return true;
      case "scenario":
        return scenarioChoice !== null;
      case "match":
        return Object.values(assignments).every((value) => value !== null);
      default:
        return false;
    }
  }, [assignments, completed, scenarioChoice, selected, step.type]);

  const getScore = () => {
    switch (step.type) {
      case "info":
        return 100;
      case "quiz":
        return selected === step.correctIndex ? 100 : 40;
      case "slider": {
        const distance = Math.abs(sliderValue - step.recommended);
        const range = step.max - step.min;
        return Math.max(50, Math.round(100 - (distance / range) * 100));
      }
      case "scenario":
        return scenarioChoice === null ? 0 : step.choices[scenarioChoice].score;
      case "match":
        return matchAccuracy;
      default:
        return 0;
    }
  };

  const complete = () => {
    if (!isReady) return;
    onStepComplete({ stepXp: step.xp, score: getScore() });
  };

  const setDrop = (item: string, bucket: "Need" | "Want") => {
    setAssignments((prev) => ({ ...prev, [item]: bucket }));
  };

  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold">{step.title}</h3>
        <p className="text-sm text-muted-foreground">{step.description}</p>
      </div>

      {step.type === "info" && (
        <ul className="space-y-2 text-sm text-muted-foreground">
          {step.bullets.map((bullet) => (
            <li key={bullet} className="rounded-lg bg-muted p-2">
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {step.type === "quiz" && (
        <div className="space-y-3">
          <p className="font-medium">{step.question}</p>
          {step.options.map((option, index) => (
            <button
              key={option}
              onClick={() => setSelected(index)}
              className={cn(
                "w-full rounded-xl border p-3 text-left",
                selected === index ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" : "border-border",
              )}
            >
              {option}
            </button>
          ))}
          {selected !== null && (
            <p className="text-sm text-muted-foreground">{step.explanation}</p>
          )}
        </div>
      )}

      {step.type === "slider" && (
        <div className="space-y-3">
          <p className="font-medium">{step.prompt}</p>
          <input
            type="range"
            min={step.min}
            max={step.max}
            value={sliderValue}
            onChange={(event) => setSliderValue(Number(event.target.value))}
            className="w-full accent-emerald-500"
          />
          <p className="text-sm text-muted-foreground">
            Your value: <span className="font-semibold">{sliderValue}</span> {step.unit}
          </p>
          <p className="text-sm text-muted-foreground">{step.explanation}</p>
        </div>
      )}

      {step.type === "scenario" && (
        <div className="space-y-3">
          <p className="font-medium">{step.prompt}</p>
          {step.choices.map((choice, index) => (
            <button
              key={choice.label}
              onClick={() => setScenarioChoice(index)}
              className={cn(
                "w-full rounded-xl border p-3 text-left",
                scenarioChoice === index ? "border-sky-500 bg-sky-50 dark:bg-sky-950/40" : "border-border",
              )}
            >
              <p className="font-medium">{choice.label}</p>
              <p className="text-sm text-muted-foreground">{choice.impact}</p>
            </button>
          ))}
        </div>
      )}

      {step.type === "match" && (
        <div className="space-y-4">
          <p className="font-medium">{step.prompt}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {(["Need", "Want"] as const).map((bucket) => (
              <div
                key={bucket}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const item = event.dataTransfer.getData("text/plain");
                  if (item) setDrop(item, bucket);
                }}
                className="min-h-36 rounded-xl border-2 border-dashed border-border bg-muted/40 p-3"
              >
                <p className="mb-2 font-semibold">{bucket}</p>
                <div className="space-y-2">
                  {step.pairs
                    .filter((pair) => assignments[pair.item] === bucket)
                    .map((pair) => (
                      <div
                        key={pair.item}
                        draggable
                        onDragStart={(event) => event.dataTransfer.setData("text/plain", pair.item)}
                        className="cursor-grab rounded-lg bg-background p-2 text-sm shadow"
                      >
                        {pair.item}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border p-3">
            <p className="mb-2 text-sm font-medium">Unsorted</p>
            <div className="flex flex-wrap gap-2">
              {step.pairs
                .filter((pair) => assignments[pair.item] === null)
                .map((pair) => (
                  <div
                    key={pair.item}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData("text/plain", pair.item)}
                    className="cursor-grab rounded-lg bg-background px-3 py-2 text-sm shadow"
                  >
                    {pair.item}
                  </div>
                ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Accuracy: {matchAccuracy}%</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={complete} disabled={!isReady || completed}>
          {completed ? "Completed" : "Complete Step"}
        </Button>
        <span className="text-sm text-muted-foreground">+{step.xp} XP</span>
      </div>
    </Card>
  );
}

