import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useAppStore } from "../store/useAppStore";
import type { OnboardingData } from "../types";

type FieldKey = keyof OnboardingData;

const steps: Array<{ key: FieldKey; title: string; description: string; choices: Array<{ label: string; value: OnboardingData[FieldKey] }> }> = [
  {
    key: "ageRange",
    title: "How old are you?",
    description: "We tailor examples by age range.",
    choices: [
      { label: "13-15", value: "13-15" },
      { label: "16-17", value: "16-17" },
      { label: "18-19", value: "18-19" },
    ],
  },
  {
    key: "goal",
    title: "What are you saving for?",
    description: "Pick your first garden mission.",
    choices: [
      { label: "Car", value: "car" },
      { label: "Phone", value: "phone" },
      { label: "Holiday", value: "holiday" },
      { label: "Emergency fund", value: "emergency" },
    ],
  },
  {
    key: "incomeStyle",
    title: "Your income style",
    description: "Choose what best fits right now.",
    choices: [
      { label: "Casual job", value: "casual-job" },
      { label: "Allowance", value: "allowance" },
      { label: "Mixed", value: "mixed" },
    ],
  },
  {
    key: "confidence",
    title: "Money confidence",
    description: "This sets module tone and pacing.",
    choices: [
      { label: "Just starting", value: "just-starting" },
      { label: "Getting there", value: "getting-there" },
      { label: "Pretty confident", value: "pretty-confident" },
    ],
  },
];

const initialData: OnboardingData = {
  ageRange: "16-17",
  goal: "car",
  incomeStyle: "casual-job",
  confidence: "just-starting",
};

export function OnboardingPage() {
  const [index, setIndex] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const navigate = useNavigate();

  const step = steps[index];
  const progress = useMemo(() => ((index + 1) / steps.length) * 100, [index]);

  const setChoice = (value: OnboardingData[FieldKey]) => {
    setData((prev) => ({ ...prev, [step.key]: value }));
  };

  const next = () => {
    if (index < steps.length - 1) return setIndex((prev) => prev + 1);
    completeOnboarding(data);
    navigate("/app/garden");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-sky-50 to-lime-50 p-4 dark:from-emerald-950 dark:via-zinc-900 dark:to-sky-950">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Welcome to MoneyGarden AU</CardTitle>
          <CardDescription>{step.description}</CardDescription>
          <div className="mt-2 h-2 rounded-full bg-muted">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="mb-3 text-xl font-semibold">{step.title}</h2>
          <div className="grid gap-2">
            {step.choices.map((choice) => {
              const active = data[step.key] === choice.value;
              return (
                <button
                  key={choice.label}
                  onClick={() => setChoice(choice.value)}
                  className={`rounded-xl border p-3 text-left transition ${
                    active ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" : "border-border hover:bg-muted"
                  }`}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setIndex((prev) => Math.max(0, prev - 1))} disabled={index === 0}>
              Back
            </Button>
            <Button onClick={next}>{index === steps.length - 1 ? "Enter Garden" : "Continue"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

