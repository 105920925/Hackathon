import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronRight, Lightbulb, Sparkles, ShieldAlert } from "lucide-react";
import type { LessonCallout, LessonStep } from "../../types";
import { Button } from "../ui/button";
import { useAppStore } from "../../store/useAppStore";

type Props = {
  step: LessonStep;
  onStatusChange: (status: { ready: boolean; score: number }) => void;
};

const calloutStyles: Record<LessonCallout["tone"], { icon: typeof Lightbulb; className: string }> = {
  tip: {
    icon: Lightbulb,
    className: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/20 dark:text-sky-100",
  },
  "watch-out": {
    icon: ShieldAlert,
    className: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-100",
  },
  "did-you-know": {
    icon: Sparkles,
    className: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900 dark:border-fuchsia-900 dark:bg-fuchsia-950/20 dark:text-fuchsia-100",
  },
  summary: {
    icon: BookOpen,
    className: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-100",
  },
};

export function LessonStepContent({ step, onStatusChange }: Props) {
  const stateOrTerritory = useAppStore((state) => state.profile.stateOrTerritory);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visited, setVisited] = useState<string[]>(() => [step.sections[0]?.id].filter(Boolean));

  const activeSection = step.sections[activeIndex];

  useEffect(() => {
    onStatusChange({
      ready: visited.length === step.sections.length,
      score: Math.round((visited.length / step.sections.length) * 100),
    });
  }, [onStatusChange, step.sections.length, visited.length]);

  const progressPct = useMemo(
    () => Math.round((visited.length / step.sections.length) * 100),
    [step.sections.length, visited.length],
  );

  const selectSection = (index: number) => {
    const section = step.sections[index];
    setActiveIndex(index);
    setVisited((prev) => (prev.includes(section.id) ? prev : [...prev, section.id]));
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[30px] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.95))] p-5 shadow-sm dark:bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(17,24,39,0.92))]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">Lesson Objective</p>
            <h4 className="mt-2 text-2xl font-black tracking-tight">{step.objective}</h4>
            <p className="mt-3 text-sm text-muted-foreground">{step.intro}</p>
          </div>
          <div className="min-w-44 rounded-3xl border border-border/70 bg-background/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Lesson progress</p>
            <p className="mt-2 text-3xl font-black">{progressPct}%</p>
            <div className="mt-3 h-2 rounded-full bg-muted">
              <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">View all sections to unlock the activity.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.34fr_0.66fr]">
        <div className="space-y-3">
          {step.sections.map((section, index) => {
            const isActive = index === activeIndex;
            const isVisited = visited.includes(section.id);
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => selectSection(index)}
                className={`w-full rounded-[26px] border p-4 text-left transition ${
                  isActive
                    ? "border-amber-300 bg-amber-50 shadow-sm dark:border-amber-900 dark:bg-amber-950/20"
                    : "border-border bg-background/80 hover:border-amber-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{section.eyebrow}</p>
                    <p className="mt-2 font-semibold">{section.title}</p>
                  </div>
                  <div className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${isVisited ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200" : "bg-muted text-muted-foreground"}`}>
                    {isVisited ? "Viewed" : `${index + 1}/${step.sections.length}`}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-[32px] border border-border/70 bg-background/90 p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-dashed border-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">{activeSection.eyebrow}</p>
              <h4 className="mt-2 text-2xl font-black tracking-tight">{activeSection.title}</h4>
            </div>
            <div className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              Section {activeIndex + 1} of {step.sections.length}
            </div>
          </div>

          <div className="mt-5 space-y-5">
            {step.regionalNotes?.[stateOrTerritory] ? (
              <div className="rounded-[28px] border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900 dark:border-sky-900 dark:bg-sky-950/20 dark:text-sky-100">
                <p className="font-semibold">State note for {stateOrTerritory}</p>
                <p className="mt-2">{step.regionalNotes[stateOrTerritory]}</p>
              </div>
            ) : null}
            <div className="space-y-3">
              {activeSection.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-6 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>

            {activeSection.visualItems?.length ? (
              <div>
                <p className="text-sm font-semibold">{activeSection.visualTitle}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {activeSection.visualItems.map((item) => (
                    <div key={`${item.label}-${item.value}`} className="rounded-3xl border border-border bg-muted/30 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                      <p className="mt-2 text-lg font-black">{item.value}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeSection.bullets?.length ? (
              <div>
                <p className="text-sm font-semibold">Key points</p>
                <div className="mt-3 space-y-2">
                  {activeSection.bullets.map((bullet) => (
                    <div key={bullet} className="rounded-2xl bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeSection.comparisonCards?.length ? (
              <div>
                <p className="text-sm font-semibold">{activeSection.comparisonTitle}</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {activeSection.comparisonCards.map((card) => (
                    <div key={card.title} className="rounded-3xl border border-border bg-background p-4">
                      <p className="font-semibold">{card.title}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{card.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeSection.exampleItems?.length ? (
              <div className="rounded-[28px] border border-border bg-[linear-gradient(135deg,rgba(56,189,248,0.08),rgba(14,165,233,0.03))] p-4">
                <p className="text-sm font-semibold">{activeSection.exampleTitle}</p>
                <div className="mt-3 space-y-2">
                  {activeSection.exampleItems.map((item) => (
                    <div key={item} className="rounded-2xl bg-background/80 px-4 py-3 text-sm text-muted-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeSection.callout ? (
              <Callout callout={activeSection.callout} />
            ) : null}

            {activeSection.glossary?.length ? (
              <div>
                <p className="text-sm font-semibold">Glossary</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {activeSection.glossary.map((item) => (
                    <div key={item.term} className="rounded-3xl border border-border bg-background p-4">
                      <p className="font-semibold">{item.term}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeSection.recap ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Mini recap</p>
                <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-200">{activeSection.recap}</p>
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-dashed border-border pt-4">
            <Button type="button" variant="outline" onClick={() => selectSection(Math.max(0, activeIndex - 1))} disabled={activeIndex === 0}>
              Previous section
            </Button>
            <Button type="button" onClick={() => selectSection(Math.min(step.sections.length - 1, activeIndex + 1))} disabled={activeIndex === step.sections.length - 1}>
              Next section <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Callout({ callout }: { callout: LessonCallout }) {
  const style = calloutStyles[callout.tone];
  const Icon = style.icon;

  return (
    <div className={`rounded-[28px] border p-4 ${style.className}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-white/70 p-2 dark:bg-black/10">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold">{callout.title}</p>
          <p className="mt-2 text-sm leading-6 opacity-90">{callout.body}</p>
        </div>
      </div>
    </div>
  );
}
