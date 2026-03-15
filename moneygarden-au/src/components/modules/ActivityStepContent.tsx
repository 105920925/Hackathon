import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronRight, Sparkles, Wallet } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ActivityStep } from "../../types";
import { Button } from "../ui/button";

type Status = {
  ready: boolean;
  score: number;
};

type Props = {
  step: ActivityStep;
  onStatusChange: (status: Status) => void;
};

const currency = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 2,
});

export function ActivityStepContent({ step, onStatusChange }: Props) {
  switch (step.activityType) {
    case "saving-studio":
      return <SavingStudio step={step} onStatusChange={onStatusChange} />;
    case "borrowing-studio":
      return <BorrowingStudio step={step} onStatusChange={onStatusChange} />;
    case "employment-studio":
      return <EmploymentStudio step={step} onStatusChange={onStatusChange} />;
    case "market-studio":
      return <MarketStudio step={step} onStatusChange={onStatusChange} />;
    case "spending-studio":
      return <SpendingStudio step={step} onStatusChange={onStatusChange} />;
    default:
      return null;
  }
}

function SavingStudio({
  step,
  onStatusChange,
}: {
  step: Extract<ActivityStep, { activityType: "saving-studio" }>;
  onStatusChange: (status: Status) => void;
}) {
  const [selectedAccount, setSelectedAccount] = useState(step.data.accounts[0]?.id ?? "");
  const [weekIndex, setWeekIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const matchScore = step.data.scenarios.reduce((sum, scenario) => sum + (answers[scenario.id] === scenario.bestAccountId ? 1 : 0), 0);
    const ready = Object.keys(answers).length === step.data.scenarios.length;
    const score = Math.round((((selectedAccount ? 1 : 0) + (weekIndex >= step.data.weeks.length - 1 ? 1 : 0) + matchScore / step.data.scenarios.length) / 3) * 100);
    onStatusChange({ ready, score });
  }, [answers, onStatusChange, selectedAccount, step.data.scenarios, step.data.weeks.length, weekIndex]);

  return (
    <div className="space-y-5">
      <div className="rounded-[30px] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] p-5 shadow-sm dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_28%),linear-gradient(135deg,rgba(17,24,39,0.95),rgba(15,23,42,0.92))]">
        <p className="text-sm text-muted-foreground">{step.intro}</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="rounded-[32px] border border-border bg-background/90 p-5 shadow-sm">
            <p className="text-sm font-semibold">Choose your account setup</p>
            <div className="mt-4 grid gap-3">
              {step.data.accounts.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => setSelectedAccount(account.id)}
                  className={`rounded-[28px] border p-4 text-left ${selectedAccount === account.id ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20" : "border-border bg-background"}`}
                >
                  <p className="font-semibold">{account.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{account.purpose}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {account.features.map((feature) => (
                      <span key={feature} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{feature}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-[32px] border border-border bg-background/90 p-5 shadow-sm">
            <p className="text-sm font-semibold">Savings runway demo</p>
            <div className="mt-4 flex items-end gap-2">
              {step.data.weeks.map((amount, index) => (
                <button key={amount} type="button" onClick={() => setWeekIndex(index)} className="flex-1">
                  <div className={`rounded-t-2xl ${index <= weekIndex ? "bg-gradient-to-t from-emerald-500 to-sky-400" : "bg-muted"}`} style={{ height: `${Math.max(60, amount / 4)}px` }} />
                  <p className="mt-2 text-center text-xs text-muted-foreground">W{index + 1}</p>
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Projected savings after week {weekIndex + 1}: {currency.format(step.data.weeks[weekIndex])}</p>
          </div>
          <div className="rounded-[32px] border border-border bg-background/90 p-5 shadow-sm">
            <p className="text-sm font-semibold">Match the account to the scenario</p>
            <div className="mt-4 space-y-3">
              {step.data.scenarios.map((scenario) => (
                <div key={scenario.id} className="rounded-[26px] border border-border p-4">
                  <p className="font-semibold">{scenario.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{scenario.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {step.data.accounts.map((account) => (
                      <Button key={account.id} type="button" variant={answers[scenario.id] === account.id ? "default" : "outline"} onClick={() => setAnswers((prev) => ({ ...prev, [scenario.id]: account.id }))}>
                        {account.name}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BorrowingStudio({
  step,
  onStatusChange,
}: {
  step: Extract<ActivityStep, { activityType: "borrowing-studio" }>;
  onStatusChange: (status: Status) => void;
}) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const scenario = step.data.scenarios[scenarioIndex];

  useEffect(() => {
    const correct = step.data.scenarios.reduce((sum, current) => sum + (current.options.find((option) => option.best)?.id === answers[current.id] ? 1 : 0), 0);
    const ready = Object.keys(answers).length === step.data.scenarios.length;
    const score = Math.round((correct / step.data.scenarios.length) * 100);
    onStatusChange({ ready, score });
  }, [answers, onStatusChange, step.data.scenarios]);

  return (
    <div className="space-y-5">
      <div className="rounded-[30px] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] p-5 shadow-sm dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28%),linear-gradient(135deg,rgba(17,24,39,0.95),rgba(15,23,42,0.92))]">
        <p className="text-sm text-muted-foreground">{step.intro}</p>
      </div>
      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-4">
          <div className="rounded-[32px] border border-border bg-background/90 p-5 shadow-sm">
            <p className="text-sm font-semibold">Beginner glossary</p>
            <div className="mt-4 grid gap-2">
              {Object.entries(step.data.glossary).map(([term, explanation]) => (
                <details key={term} className="rounded-2xl border border-border bg-background px-4 py-3">
                  <summary className="cursor-pointer text-sm font-semibold">{term}</summary>
                  <p className="mt-2 text-sm text-muted-foreground">{explanation}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-[32px] border border-border bg-background/90 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{scenario.label}</p>
              <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Scenario {scenarioIndex + 1}/{step.data.scenarios.length}</div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MetricCard label="Amount needed" value={currency.format(scenario.amount)} />
              <MetricCard label="Term" value={`${scenario.termMonths} months`} />
            </div>
            <div className="mt-4 grid gap-3">
              {scenario.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [scenario.id]: option.id }))}
                  className={`rounded-[28px] border p-4 text-left ${answers[scenario.id] === option.id ? "border-sky-300 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/20" : "border-border bg-background"}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{option.label}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {option.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm font-semibold">{currency.format(option.totalCost)} total</p>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">Approx. {currency.format(option.monthly)} per month. {option.explanation}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => setScenarioIndex((prev) => Math.max(0, prev - 1))} disabled={scenarioIndex === 0}>Previous</Button>
              <Button type="button" onClick={() => setScenarioIndex((prev) => Math.min(step.data.scenarios.length - 1, prev + 1))} disabled={scenarioIndex === step.data.scenarios.length - 1 || !answers[scenario.id]}>Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmploymentStudio({
  step,
  onStatusChange,
}: {
  step: Extract<ActivityStep, { activityType: "employment-studio" }>;
  onStatusChange: (status: Status) => void;
}) {
  const [selectedField, setSelectedField] = useState(step.data.fields[0]?.id ?? "");
  const [hours, setHours] = useState(String(step.data.calculatorDefaults.hours));
  const [rate, setRate] = useState(String(step.data.calculatorDefaults.rate));
  const [questIndex, setQuestIndex] = useState(0);
  const [questAnswers, setQuestAnswers] = useState<Record<string, boolean>>({});

  const selectedExplanation = step.data.fields.find((field) => field.id === selectedField) ?? step.data.fields[0];
  const questScene = step.data.questScenes[questIndex];

  const calculator = useMemo(() => {
    const parsedHours = Number(hours);
    const parsedRate = Number(rate);
    const grossWeekly = Number.isFinite(parsedHours) && Number.isFinite(parsedRate) ? parsedHours * parsedRate : 0;
    const annual = grossWeekly * 52;
    const underThreshold = annual <= step.data.threshold;
    const roughWithholding = underThreshold ? 0 : Math.round((annual - step.data.threshold) * 0.16);
    const estimatedWeeklyWithholding = roughWithholding / 52;
    const takeHome = Math.max(grossWeekly - estimatedWeeklyWithholding, 0);
    return { grossWeekly, annual, underThreshold, roughWithholding, takeHome };
  }, [hours, rate, step.data.threshold]);

  useEffect(() => {
    const answeredCount = Object.keys(questAnswers).length;
    const correctAnswers = Object.values(questAnswers).filter(Boolean).length;
    const ready = Boolean(selectedField) && calculator.grossWeekly > 0 && answeredCount === step.data.questScenes.length;
    const score = Math.round(
      ((Boolean(selectedField) ? 1 : 0) + (calculator.grossWeekly > 0 ? 1 : 0) + correctAnswers / step.data.questScenes.length) /
        3 *
        100,
    );
    onStatusChange({ ready, score });
  }, [calculator.grossWeekly, onStatusChange, questAnswers, selectedField, step.data.questScenes.length]);

  return (
    <div className="space-y-5">
      <div className="rounded-[30px] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] p-5 shadow-sm dark:bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_30%),linear-gradient(135deg,rgba(17,24,39,0.95),rgba(15,23,42,0.92))]">
        <p className="text-sm text-muted-foreground">{step.intro}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-border/70 bg-[#fffdfa] p-5 shadow-sm dark:bg-zinc-950/70">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-dashed border-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-300">Demo Australian Payslip</p>
              <h4 className="mt-2 text-2xl font-black">{step.data.employerName}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{step.data.employerTagline}</p>
              <p className="mt-1 text-xs text-muted-foreground">ABN {step.data.abn}</p>
            </div>
            <div className="rounded-3xl border border-border bg-background/80 px-4 py-3 text-sm">
              <p className="font-semibold">{step.data.employeeName}</p>
              <p className="text-muted-foreground">{step.data.role}</p>
              <p className="mt-1 text-xs text-muted-foreground">{step.data.payPeriod}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {[
              { title: "Header details", category: "header" as const },
              { title: "Earnings", category: "earnings" as const },
              { title: "Deductions", category: "deductions" as const },
              { title: "Superannuation", category: "super" as const },
              { title: "Totals", category: "totals" as const },
            ].map((section) => (
              <div key={section.category}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{section.title}</p>
                <div className="overflow-hidden rounded-3xl border border-border">
                  {step.data.fields
                    .filter((field) => field.category === section.category)
                    .map((field, index) => (
                      <button
                        key={field.id}
                        type="button"
                        onClick={() => setSelectedField(field.id)}
                        className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition ${
                          selectedField === field.id ? "bg-orange-50 dark:bg-orange-950/20" : "bg-background/80"
                        } ${index !== 0 ? "border-t border-border" : ""}`}
                      >
                        <span className="text-sm font-medium">{field.label}</span>
                        <span className="text-sm font-semibold">{field.value}</span>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[32px] border border-orange-200 bg-orange-50/80 p-5 dark:border-orange-900 dark:bg-orange-950/20">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-800 dark:text-orange-200">Explain this payslip</p>
            <h5 className="mt-2 text-lg font-bold">{selectedExplanation.label}</h5>
            <p className="mt-3 text-sm leading-6 text-orange-900/80 dark:text-orange-100/90">{selectedExplanation.explanation}</p>
            <div className="mt-4 rounded-2xl bg-white/80 p-3 text-sm text-muted-foreground dark:bg-black/10">
              Watch out: gross pay is not the same as what lands in your bank account. Net pay is the after-withholding amount.
            </div>
          </div>

          <div className="rounded-[32px] border border-border bg-background/90 p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-emerald-600" />
              <p className="font-semibold">Tax & take-home estimator</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">
                <span>Hours per week</span>
                <input
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-muted/40 px-4 py-3 outline-none focus:border-emerald-300"
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                <span>Hourly rate</span>
                <div className="flex items-center rounded-2xl border border-border bg-muted/40 px-4">
                  <span className="text-sm text-muted-foreground">A$</span>
                  <input
                    type="number"
                    min="0"
                    value={rate}
                    onChange={(event) => setRate(event.target.value)}
                    className="w-full bg-transparent px-3 py-3 outline-none"
                  />
                </div>
              </label>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MetricCard label="Estimated weekly gross" value={currency.format(calculator.grossWeekly)} />
              <MetricCard label="Estimated annual income" value={currency.format(calculator.annual)} />
              <MetricCard label="Likely threshold position" value={calculator.underThreshold ? "Under A$18,200" : "Over A$18,200"} />
              <MetricCard label="Estimated weekly take-home" value={currency.format(calculator.takeHome)} />
            </div>
            <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-100">
              {calculator.underThreshold
                ? "This learner-friendly estimate suggests you are likely under the tax-free threshold, so income tax may be low or nil. Payroll withholding can still happen depending on your setup."
                : `This learner-friendly estimate suggests you may be over the tax-free threshold. A rough extra tax estimate is ${currency.format(calculator.roughWithholding)} per year. It is educational only, not official advice.`}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-border bg-background/90 p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">TFN Quest</p>
            <h5 className="mt-2 text-lg font-bold">{questScene.title}</h5>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{questScene.description}</p>
          </div>
          <div className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
            Stop {questIndex + 1} of {step.data.questScenes.length}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {questScene.options.map((option) => {
            const answered = questAnswers[questScene.id] !== undefined;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setQuestAnswers((prev) => ({ ...prev, [questScene.id]: option.correct }))}
                className={`rounded-[28px] border p-4 text-left transition ${
                  answered && option.correct
                    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/20"
                    : "border-border bg-background hover:border-sky-200"
                }`}
              >
                <p className="font-semibold">{option.label}</p>
                <p className="mt-2 text-sm text-muted-foreground">{option.outcome}</p>
                {answered && option.correct ? (
                  <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Best move
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setQuestIndex((prev) => Math.max(0, prev - 1))} disabled={questIndex === 0}>
            Previous stop
          </Button>
          <Button
            type="button"
            onClick={() => setQuestIndex((prev) => Math.min(step.data.questScenes.length - 1, prev + 1))}
            disabled={questIndex === step.data.questScenes.length - 1 || questAnswers[questScene.id] === undefined}
          >
            Next stop <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function MarketStudio({
  step,
  onStatusChange,
}: {
  step: Extract<ActivityStep, { activityType: "market-studio" }>;
  onStatusChange: (status: Status) => void;
}) {
  const [companyId, setCompanyId] = useState(step.data.companies[0]?.id ?? "");
  const [shares, setShares] = useState(5);
  const [eventIndex, setEventIndex] = useState(0);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [range, setRange] = useState<"1D" | "1W" | "1M" | "1Y">("1M");

  const company = step.data.companies.find((item) => item.id === companyId) ?? step.data.companies[0];
  const activeEvent = company.events[eventIndex];
  const costBase = shares * company.purchasePrice;
  const currentValue = shares * activeEvent.price;
  const gain = currentValue - costBase;
  const gainPct = costBase === 0 ? 0 : (gain / costBase) * 100;
  const chartData = useMemo(() => buildMarketSeries(company.events, range), [company.events, range]);

  useEffect(() => {
    const ready = eventIndex >= 2 && timelineIndex === step.data.timeline.length - 1;
    const score = Math.round(
      ((((eventIndex + 1) / company.events.length) + (timelineIndex + 1) / step.data.timeline.length) / 2) * 100,
    );
    onStatusChange({ ready, score });
  }, [company.events.length, eventIndex, onStatusChange, step.data.timeline.length, timelineIndex]);

  return (
    <div className="space-y-5">
      <div className="rounded-[30px] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] p-5 shadow-sm dark:bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_28%),linear-gradient(135deg,rgba(17,24,39,0.95),rgba(15,23,42,0.92))]">
        <p className="text-sm text-muted-foreground">{step.intro}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-4">
          <div className="rounded-[32px] border border-border bg-background/90 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">Demo share market</p>
            <div className="mt-4 grid gap-2">
              {step.data.companies.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setCompanyId(item.id);
                    setEventIndex(0);
                  }}
                  className={`rounded-[26px] border p-4 text-left transition ${
                    companyId === item.id ? "border-violet-300 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/20" : "border-border bg-background"
                  }`}
                >
                  <p className="font-semibold">{item.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.sector}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-border bg-background/90 p-5 shadow-sm">
            <p className="text-sm font-semibold">From Lemonade Stand to ASX</p>
            <div className="mt-4 space-y-2">
              {step.data.timeline.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTimelineIndex(index)}
                  className={`flex w-full items-center gap-3 rounded-[24px] border p-3 text-left transition ${
                    timelineIndex === index ? "border-sky-300 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/20" : "border-border bg-background"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${item.accent}`} />
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.body}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[32px] border border-border bg-[linear-gradient(135deg,rgba(244,114,182,0.08),rgba(168,85,247,0.08))] p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">Portfolio demo</p>
                <h5 className="mt-2 text-xl font-black">{company.name}</h5>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">{company.id.toUpperCase()} · {company.sector}</p>
                <p className="mt-2 text-sm text-muted-foreground">{company.blurb}</p>
              </div>
              <label className="space-y-2 text-sm font-medium">
                <span>Number of shares</span>
                <input
                  type="number"
                  min="1"
                  max="25"
                  value={shares}
                  onChange={(event) => setShares(Math.max(1, Number(event.target.value) || 1))}
                  className="w-28 rounded-2xl border border-border bg-background/80 px-4 py-2 outline-none"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MetricCard label="Buy price" value={currency.format(company.purchasePrice)} />
              <MetricCard label="Current price" value={currency.format(activeEvent.price)} />
              <MetricCard label="Gain / loss" value={`${gain >= 0 ? "+" : ""}${currency.format(gain)} (${gain >= 0 ? "+" : ""}${gainPct.toFixed(1)}%)`} />
            </div>

            <div className="mt-4 rounded-[28px] border border-border bg-background/80 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Market event {eventIndex + 1}</p>
                  <p className="mt-1 font-semibold">{activeEvent.headline}</p>
                </div>
                <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                  Demo only
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{activeEvent.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["1D", "1W", "1M", "1Y"] as const).map((item) => (
                  <Button key={item} type="button" variant={range === item ? "default" : "outline"} size="sm" onClick={() => setRange(item)}>
                    {item}
                  </Button>
                ))}
              </div>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id={`market-fill-${company.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.55} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.18} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis domain={["dataMin - 0.2", "dataMax + 0.2"]} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => currency.format(Number(value))} />
                    <Area type="monotone" dataKey="price" stroke="#8b5cf6" strokeWidth={3} fill={`url(#market-fill-${company.id})`} />
                    {chartData.filter((point) => point.marker).map((point) => (
                      <ReferenceDot key={point.label} x={point.label} y={point.price} r={5} fill="#0ea5e9" stroke="white" />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 rounded-2xl bg-violet-50 p-4 text-sm text-violet-900 dark:bg-violet-950/20 dark:text-violet-100">
                Why the price changed: {activeEvent.reason}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <MetricCard label="Holdings" value={`${shares} shares`} />
                <MetricCard label="Average buy price" value={currency.format(company.purchasePrice)} />
                <MetricCard label="Portfolio value" value={currency.format(currentValue)} />
              </div>
              <div className="mt-4 rounded-2xl border border-border bg-background/70 p-4 text-sm text-muted-foreground">
                Transaction summary: Bought {shares} simulated shares of {company.id.toUpperCase()} at {currency.format(company.purchasePrice)} each. This is educational only, not real investing advice.
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => setEventIndex((prev) => Math.max(0, prev - 1))} disabled={eventIndex === 0}>
                  Previous event
                </Button>
                <Button type="button" onClick={() => setEventIndex((prev) => Math.min(company.events.length - 1, prev + 1))} disabled={eventIndex === company.events.length - 1}>
                  Next event <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Prices can go up or down. This portfolio is educational only and not investing advice.</p>
          </div>

          <div className="rounded-[32px] border border-border bg-background/90 p-5 shadow-sm">
            <p className="text-sm font-semibold">{step.data.timeline[timelineIndex].title}</p>
            <div className={`mt-4 rounded-[28px] bg-gradient-to-br ${step.data.timeline[timelineIndex].accent} p-6 text-white`}>
              <Sparkles className="h-6 w-6" />
              <p className="mt-4 text-sm leading-6 text-white/90">{step.data.timeline[timelineIndex].body}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => setTimelineIndex((prev) => Math.max(0, prev - 1))} disabled={timelineIndex === 0}>
                Previous stage
              </Button>
              <Button type="button" onClick={() => setTimelineIndex((prev) => Math.min(step.data.timeline.length - 1, prev + 1))} disabled={timelineIndex === step.data.timeline.length - 1}>
                Next stage <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpendingStudio({
  step,
  onStatusChange,
}: {
  step: Extract<ActivityStep, { activityType: "spending-studio" }>;
  onStatusChange: (status: Status) => void;
}) {
  const [decisions, setDecisions] = useState<Record<string, "buyNow" | "wait24" | "compare" | "skip">>({});
  const [roundIndex, setRoundIndex] = useState(0);
  const [valueAnswers, setValueAnswers] = useState<Record<string, string>>({});

  const currentRound = step.data.rounds[roundIndex];
  const spent = step.data.feedItems.reduce((total, item) => {
    const action = decisions[item.id];
    if (!action) return total;
    if (action === "buyNow") return total + item.price;
    if (action === "compare") return total + (item.comparePrice ?? item.price);
    return total;
  }, 0);
  const balanceLeft = step.data.startingBalance - spent;
  const savedTowardGoal = step.data.savingsGoal.current + Math.max(balanceLeft, 0);

  useEffect(() => {
    const feedAnswered = Object.keys(decisions).length === step.data.feedItems.length;
    const valueAnswered = Object.keys(valueAnswers).length === step.data.rounds.length;
    const smartFeedChoices = step.data.feedItems.reduce((sum, item) => {
      const action = decisions[item.id];
      if (!action) return sum;
      const smart = item.planned
        ? action === "compare" || action === "buyNow"
        : action === "wait24" || action === "skip" || action === "compare";
      return sum + (smart ? 1 : 0);
    }, 0);
    const smartValueChoices = step.data.rounds.reduce((sum, round) => {
      const best = round.options.find((option) => option.bestValue);
      return sum + (valueAnswers[round.id] === best?.id ? 1 : 0);
    }, 0);
    const score = Math.round(
      ((smartFeedChoices / step.data.feedItems.length) + (smartValueChoices / step.data.rounds.length)) / 2 * 100,
    );
    onStatusChange({ ready: feedAnswered && valueAnswered, score });
  }, [decisions, onStatusChange, step.data.feedItems, step.data.rounds, valueAnswers]);

  return (
    <div className="space-y-5">
      <div className="rounded-[30px] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] p-5 shadow-sm dark:bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.18),transparent_28%),linear-gradient(135deg,rgba(17,24,39,0.95),rgba(15,23,42,0.92))]">
        <p className="text-sm text-muted-foreground">{step.intro}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.04fr_0.96fr]">
        <div className="space-y-4">
          <div className="rounded-[32px] border border-border bg-background/90 p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700 dark:text-rose-300">Impulse Challenge</p>
                <h5 className="mt-2 text-lg font-bold">Your fake social shopping feed</h5>
              </div>
              <div className="rounded-3xl border border-border bg-muted/40 px-4 py-3 text-sm">
                <p className="font-semibold">Current balance: {currency.format(balanceLeft)}</p>
                <p className="text-muted-foreground">{step.data.savingsGoal.title}: {currency.format(savedTowardGoal)} / {currency.format(step.data.savingsGoal.target)}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {step.data.feedItems.map((item) => {
                const decision = decisions[item.id];
                return (
                  <div key={item.id} className="rounded-[28px] border border-border bg-background p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="rounded-full bg-muted px-3 py-1.5 text-sm font-semibold">{currency.format(item.price)}</div>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                      <p>Why it is tempting: {item.reason}</p>
                      <p>Urgency level: {item.urgency}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[
                        { key: "buyNow", label: "Buy now" },
                        { key: "wait24", label: "Wait 24 hours" },
                        { key: "compare", label: "Compare prices" },
                        { key: "skip", label: "Skip" },
                      ].map((action) => (
                        <Button
                          key={action.key}
                          type="button"
                          variant={decision === action.key ? "default" : "outline"}
                          onClick={() => setDecisions((prev) => ({ ...prev, [item.id]: action.key as typeof decision }))}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                    {decision ? (
                      <div className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm text-rose-900 dark:bg-rose-950/20 dark:text-rose-100">
                        {item.outcomes[decision]}
                        {decision === "compare" && item.comparePrice ? ` You found a better price at ${currency.format(item.comparePrice)}.` : ""}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[32px] border border-border bg-background/90 p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Value Hunter</p>
                <h5 className="mt-2 text-lg font-bold">{currentRound.item}</h5>
              </div>
              <div className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                Round {roundIndex + 1} of {step.data.rounds.length}
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {currentRound.options.map((option) => {
                const finalTotal = option.price + option.shipping - option.discount;
                const selected = valueAnswers[currentRound.id] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setValueAnswers((prev) => ({ ...prev, [currentRound.id]: option.id }))}
                    className={`rounded-[28px] border p-4 text-left transition ${
                      selected ? "border-sky-300 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/20" : "border-border bg-background"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{option.store}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{option.condition}</p>
                      </div>
                      <p className="text-sm font-semibold">{currency.format(finalTotal)} final</p>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                      <p>Base price: {currency.format(option.price)}</p>
                      <p>Shipping: {currency.format(option.shipping)}</p>
                      <p>Discount: -{currency.format(option.discount)}</p>
                      <p>Condition: {option.condition}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {valueAnswers[currentRound.id] ? (
              <div className={`mt-4 rounded-2xl p-4 text-sm ${currentRound.options.find((option) => option.id === valueAnswers[currentRound.id])?.bestValue ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-100" : "bg-amber-50 text-amber-900 dark:bg-amber-950/20 dark:text-amber-100"}`}>
                {currentRound.options.find((option) => option.id === valueAnswers[currentRound.id])?.explanation}
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => setRoundIndex((prev) => Math.max(0, prev - 1))} disabled={roundIndex === 0}>
                Previous round
              </Button>
              <Button type="button" onClick={() => setRoundIndex((prev) => Math.min(step.data.rounds.length - 1, prev + 1))} disabled={roundIndex === step.data.rounds.length - 1 || !valueAnswers[currentRound.id]}>
                Next round <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-[32px] border border-border bg-background/90 p-5 shadow-sm">
            <p className="text-sm font-semibold">Decision summary</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MetricCard label="Spent in feed" value={currency.format(spent)} />
              <MetricCard label="Balance left" value={currency.format(balanceLeft)} />
              <MetricCard label="Savings goal progress" value={`${currency.format(savedTowardGoal)} / ${currency.format(step.data.savingsGoal.target)}`} />
              <MetricCard label="Feed decisions made" value={`${Object.keys(decisions).length}/${step.data.feedItems.length}`} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Best value is not always the cheapest sticker price, and the smartest feed move is not always buy now. This step is about slowing down long enough to compare the real cost.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-black">{value}</p>
    </div>
  );
}

function buildMarketSeries(
  events: Array<{ headline: string; price: number }>,
  range: "1D" | "1W" | "1M" | "1Y",
) {
  const lengths = { "1D": 6, "1W": 7, "1M": 8, "1Y": 12 } as const;
  const totalPoints = lengths[range];
  return Array.from({ length: totalPoints }, (_, index) => {
    const event = events[Math.min(events.length - 1, Math.floor((index / Math.max(totalPoints - 1, 1)) * (events.length - 1)))];
    return {
      label: range === "1Y" ? `M${index + 1}` : `${index + 1}`,
      price: Number((event.price + Math.sin(index * 0.9) * 0.18).toFixed(2)),
      marker: index === Math.floor((totalPoints - 1) / 2) || index === totalPoints - 1,
      headline: event.headline,
    };
  });
}
