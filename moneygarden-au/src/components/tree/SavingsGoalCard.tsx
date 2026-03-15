import { useMemo, useState } from "react";
import { CheckCircle2, Leaf, Pencil, PiggyBank, Trash2 } from "lucide-react";
import type { SavingsGoal } from "../../types";
import { calculateWeeklySavings } from "../../lib/finance";
import { formatAUD } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

type Props = {
  goal: SavingsGoal;
  onDeposit: (goalId: string, amount: number) => { ok: boolean; message: string };
  onSave: (goalId: string, payload: { title: string; targetAmount: number; timelineWeeks: number }) => void;
  onRemove: (goalId: string) => void;
};

export function SavingsGoalCard({ goal, onDeposit, onSave, onRemove }: Props) {
  const [amount, setAmount] = useState("50");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(goal.title);
  const [targetAmount, setTargetAmount] = useState(String(goal.targetAmount));
  const [timelineWeeks, setTimelineWeeks] = useState(String(goal.timelineWeeks));

  const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  const weeklyTarget = useMemo(
    () => calculateWeeklySavings(Math.max(0, goal.targetAmount - goal.currentAmount), goal.timelineWeeks),
    [goal.currentAmount, goal.targetAmount, goal.timelineWeeks],
  );

  const deposit = () => {
    const result = onDeposit(goal.id, Number(amount));
    setMessage(result.message);
    if (result.ok) setAmount("50");
  };

  const save = () => {
    const parsedTargetAmount = Number(targetAmount);
    const parsedTimelineWeeks = Number(timelineWeeks);
    if (!title.trim() || parsedTargetAmount <= 0 || parsedTimelineWeeks <= 0) return;
    onSave(goal.id, { title: title.trim(), targetAmount: parsedTargetAmount, timelineWeeks: parsedTimelineWeeks });
    setEditing(false);
  };

  return (
    <Card className="border-white/60 bg-white/85 shadow-sm dark:border-white/10 dark:bg-zinc-950/70">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-sky-500" />
              <p className="font-semibold">{goal.title}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatAUD(goal.currentAmount)} of {formatAUD(goal.targetAmount)} saved
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="rounded-full p-2 text-muted-foreground transition hover:bg-muted" onClick={() => setEditing((value) => !value)} aria-label="Edit savings goal">
              <Pencil className="h-4 w-4" />
            </button>
            <button type="button" className="rounded-full p-2 text-muted-foreground transition hover:bg-muted" onClick={() => onRemove(goal.id)} aria-label="Remove savings goal">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="h-2 rounded-full bg-muted">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
          <p>Timeline: <span className="font-semibold text-foreground">{goal.timelineWeeks} weeks</span></p>
          <p>Suggested weekly save: <span className="font-semibold text-foreground">{formatAUD(weeklyTarget)}</span></p>
        </div>

        {goal.completedAt ? (
          <div className="rounded-2xl bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              Goal complete
            </div>
            <p className="mt-1">This goal has already added a reward leaf to your Learning Tree.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-muted-foreground">A$</span>
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background pl-8 pr-3 text-sm"
                  inputMode="decimal"
                />
              </div>
              <Button onClick={deposit} className="inline-flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Add savings
              </Button>
            </div>
            {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          </div>
        )}

        {editing ? (
          <div className="grid gap-2 rounded-2xl border border-border bg-muted/40 p-3">
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="h-10 rounded-xl border border-border bg-background px-3 text-sm" />
            <div className="grid gap-2 md:grid-cols-2">
              <input
                type="number"
                value={targetAmount}
                onChange={(event) => setTargetAmount(event.target.value)}
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
              />
              <input
                type="number"
                value={timelineWeeks}
                onChange={(event) => setTimelineWeeks(event.target.value)}
                className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={save}>Save goal</Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
