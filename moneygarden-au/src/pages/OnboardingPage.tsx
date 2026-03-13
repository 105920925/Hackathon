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
    description: "We tailor the examples to your stage of life.",
    choices: [
      { label: "13-15", value: "13-15" },
      { label: "16-17", value: "16-17" },
      { label: "18-19", value: "18-19" },
    ],
  },
  {
    key: "goal",
    title: "What goal matters most right now?",
    description: "This helps personalise your first savings examples.",
    choices: [
      { label: "Car", value: "car" },
      { label: "Phone", value: "phone" },
      { label: "Travel", value: "travel" },
      { label: "Emergency fund", value: "emergency" },
    ],
  },
  {
    key: "incomeStyle",
    title: "Your income style",
    description: "Choose the option that best matches your current money flow.",
    choices: [
      { label: "Casual job", value: "casual-job" },
      { label: "Allowance", value: "allowance" },
      { label: "Mixed", value: "mixed" },
    ],
  },
  {
    key: "confidence",
    title: "Money confidence",
    description: "We use this to shape the tone of your learning journey.",
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
    navigate("/app/tree");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-sky-50 to-teal-50 p-4 dark:from-emerald-950 dark:via-zinc-900 dark:to-sky-950">
      <Card className="w-full max-w-xl border-white/60 bg-white/90 shadow-[0_24px_80px_-42px_rgba(14,116,144,0.45)] dark:border-white/10 dark:bg-zinc-950/85">
        <CardHeader>
          <CardTitle>Welcome to Learning Tree AU</CardTitle>
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
            <Button onClick={next}>{index === steps.length - 1 ? "Enter Learning Tree" : "Continue"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
