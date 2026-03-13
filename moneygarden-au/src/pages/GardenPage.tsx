import { useMemo, useState } from "react";
import { Flower2, Flame, Plus, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { GardenCanvas } from "../components/garden/GardenCanvas";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useAppStore } from "../store/useAppStore";
import { calculateWeeklySavings } from "../lib/finance";
import { getGardenLevel, getNextLevelXP } from "../lib/game";
import { formatAUD } from "../lib/utils";
import { seedState } from "../data/seed";
import { useShallow } from "zustand/react/shallow";

export function GardenPage() {
  const [amount, setAmount] = useState("50");
  const [message, setMessage] = useState("");
  const [activeItem, setActiveItem] = useState("");

  const { xp, streak, savingsGoal, inventory, logSavings } = useAppStore(
    useShallow((state) => ({
      xp: state.xp ?? seedState.xp,
      streak: state.streak ?? seedState.streak,
      savingsGoal: state.savingsGoal ?? seedState.savingsGoal,
      inventory: state.inventory ?? seedState.inventory,
      logSavings: state.logSavings,
    })),
  );
  const safeGoal = {
    ...seedState.savingsGoal,
    ...savingsGoal,
    targetAmount: Number.isFinite(savingsGoal?.targetAmount) ? savingsGoal.targetAmount : seedState.savingsGoal.targetAmount,
    currentAmount: Number.isFinite(savingsGoal?.currentAmount) ? savingsGoal.currentAmount : seedState.savingsGoal.currentAmount,
    timelineWeeks: Number.isFinite(savingsGoal?.timelineWeeks) ? savingsGoal.timelineWeeks : seedState.savingsGoal.timelineWeeks,
  };

  const level = getGardenLevel(xp);
  const nextXP = getNextLevelXP(xp);
  const weeklyTarget = useMemo(
    () => calculateWeeklySavings(Math.max(0, safeGoal.targetAmount - safeGoal.currentAmount), safeGoal.timelineWeeks),
    [safeGoal.currentAmount, safeGoal.targetAmount, safeGoal.timelineWeeks],
  );

  const onLog = () => {
    const result = logSavings(Number(amount));
    setMessage(result.message);
    if (result.ok) setAmount("50");
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Garden Level</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-emerald-600">{level}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">XP</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-sky-600">{xp}</p>
            <p className="text-xs text-muted-foreground">{Math.max(0, nextXP - xp)} XP to next level</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Streak</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <p className="text-3xl font-black">{streak} days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Next Unlock</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <p className="font-semibold">{nextXP - xp <= 0 ? "Maxed" : `${nextXP - xp} XP away`}</p>
          </CardContent>
        </Card>
      </section>

      <GardenCanvas
        currentSavings={safeGoal.currentAmount}
        targetSavings={safeGoal.targetAmount}
        unlockedItems={inventory}
        onInspectItem={setActiveItem}
      />

      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Water Your Plant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Log a savings deposit to grow your garden and earn XP.</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-muted-foreground">$</span>
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background pl-7 pr-3 text-sm"
                />
              </div>
              <Button onClick={onLog} className="inline-flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
            {message && <p className="text-sm text-emerald-600">{message}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goal Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              Goal: <span className="font-semibold">{safeGoal.title}</span>
            </p>
            <p>
              Progress: <span className="font-semibold">{formatAUD(safeGoal.currentAmount)}</span> / {formatAUD(safeGoal.targetAmount)}
            </p>
            <p>
              Suggested weekly savings: <span className="font-semibold">{formatAUD(weeklyTarget)}</span>
            </p>
            <p className="text-xs text-muted-foreground">Educational guidance only, not personal financial advice.</p>
          </CardContent>
        </Card>
      </motion.section>

      <Dialog open={Boolean(activeItem)} onOpenChange={(open) => !open && setActiveItem("")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flower2 className="h-5 w-5 text-emerald-500" /> {activeItem}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            You unlocked this by building better money habits. Keep completing modules and logging savings to expand your garden.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
