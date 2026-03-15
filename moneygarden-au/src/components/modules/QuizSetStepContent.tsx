import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import type { QuizSetStep } from "../../types";
import { Button } from "../ui/button";

type Props = {
  step: QuizSetStep;
  onStatusChange: (status: { ready: boolean; score: number }) => void;
};

type AnswerState = {
  selectedIndex: number | null;
  submitted: boolean;
};

export function QuizSetStepContent({ step, onStatusChange }: Props) {
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(
    Object.fromEntries(step.questions.map((question) => [question.id, { selectedIndex: null, submitted: false }])),
  );

  const score = useMemo(() => {
    const submittedQuestions = step.questions.filter((question) => answers[question.id]?.submitted);
    if (submittedQuestions.length === 0) return 0;
    const correct = submittedQuestions.filter((question) => answers[question.id]?.selectedIndex === question.correctIndex).length;
    return Math.round((correct / step.questions.length) * 100);
  }, [answers, step.questions]);

  useEffect(() => {
    const ready = step.questions.every((question) => {
      const state = answers[question.id];
      return state?.submitted && state.selectedIndex === question.correctIndex;
    });
    onStatusChange({ ready, score });
  }, [answers, onStatusChange, score, step.questions]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{step.intro}</p>
      <div className="space-y-4">
        {step.questions.map((question, index) => {
          const state = answers[question.id];
          const isCorrect = state?.submitted && state.selectedIndex === question.correctIndex;
          const isWrong = state?.submitted && state.selectedIndex !== question.correctIndex;

          return (
            <div key={question.id} className="rounded-[28px] border border-border bg-background/85 p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Question {index + 1}</p>
                  <p className="mt-2 font-semibold">{question.prompt}</p>
                </div>
                {state?.submitted ? (
                  <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${isCorrect ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200" : "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200"}`}>
                    {isCorrect ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    {isCorrect ? "Correct" : "Try again"}
                  </div>
                ) : null}
              </div>

              <div className="mt-4 space-y-2">
                {question.options.map((option, optionIndex) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: { selectedIndex: optionIndex, submitted: false },
                      }))
                    }
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      state?.selectedIndex === optionIndex ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20" : "border-border hover:border-emerald-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      [question.id]: {
                        selectedIndex: prev[question.id]?.selectedIndex ?? null,
                        submitted: true,
                      },
                    }))
                  }
                  disabled={state?.selectedIndex === null}
                >
                  Check answer
                </Button>
                {isWrong ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: { selectedIndex: null, submitted: false },
                      }))
                    }
                  >
                    <RotateCcw className="h-4 w-4" /> Retry
                  </Button>
                ) : null}
              </div>

              {state?.submitted ? (
                <div className={`mt-4 rounded-2xl p-3 text-sm ${isCorrect ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-100" : "bg-amber-50 text-amber-900 dark:bg-amber-950/20 dark:text-amber-100"}`}>
                  {question.explanation}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">Review the feedback and get each answer correct to finish this quiz.</p>
    </div>
  );
}
