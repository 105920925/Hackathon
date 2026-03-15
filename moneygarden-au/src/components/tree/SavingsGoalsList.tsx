import { useState } from "react";
import { Plus } from "lucide-react";
import type { SavingsGoal } from "../../types";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SavingsGoalCard } from "./SavingsGoalCard";

type GoalPayload = {
  title: string;
  targetAmount: number;
  timelineWeeks: number;
};

type Props = {
  savingsGoals: SavingsGoal[];
  onAddGoal: (payload: GoalPayload) => void;
  onUpdateGoal: (goalId: string, payload: GoalPayload) => void;
  onRemoveGoal: (goalId: string) => void;
  onDeposit: (goalId: string, amount: number) => { ok: boolean; message: string };
};

export function SavingsGoalsList({ savingsGoals, onAddGoal, onUpdateGoal, onRemoveGoal, onDeposit }: Props) {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("500");
  const [timelineWeeks, setTimelineWeeks] = useState("10");

  const addGoal = () => {
    const parsedTargetAmount = Number(targetAmount);
    const parsedTimelineWeeks = Number(timelineWeeks);
    if (!title.trim() || parsedTargetAmount <= 0 || parsedTimelineWeeks <= 0) return;
    onAddGoal({ title: title.trim(), targetAmount: parsedTargetAmount, timelineWeeks: parsedTimelineWeeks });
    setTitle("");
    setTargetAmount("500");
    setTimelineWeeks("10");
  };

  return (
    <div className="space-y-4">
      <Card className="border-white/60 bg-white/85 shadow-sm dark:border-white/10 dark:bg-zinc-950/70">
        <CardHeader>
          <CardTitle>Create a savings goal</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
            placeholder="New goal title"
          />
          <input
            type="number"
            value={targetAmount}
            onChange={(event) => setTargetAmount(event.target.value)}
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
            placeholder="Target in AUD"
          />
          <input
            type="number"
            value={timelineWeeks}
            onChange={(event) => setTimelineWeeks(event.target.value)}
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
            placeholder="Weeks"
          />
          <Button onClick={addGoal} className="h-11 inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add goal
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {savingsGoals.map((goal) => (
          <SavingsGoalCard key={goal.id} goal={goal} onDeposit={onDeposit} onSave={onUpdateGoal} onRemove={onRemoveGoal} />
        ))}
      </div>
    </div>
  );
}
