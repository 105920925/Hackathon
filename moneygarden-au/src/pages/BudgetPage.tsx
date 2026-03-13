import { useMemo } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAppStore } from "../store/useAppStore";
import { formatAUD } from "../lib/utils";

const colors = ["#22c55e", "#0ea5e9", "#f59e0b", "#a855f7", "#ef4444", "#14b8a6"];

export function BudgetPage() {
  const budget = useAppStore((state) => state.budget);
  const updateBudgetValue = useAppStore((state) => state.updateBudgetValue);

  const total = useMemo(() => budget.reduce((acc, item) => acc + item.amount, 0), [budget]);
  const savings = budget.find((item) => item.name === "Savings")?.amount ?? 0;
  const savingsRate = total ? (savings / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Budget Builder</h1>
        <p className="text-sm text-muted-foreground">Simple weekly budget for student life in Australia.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Categories (AUD)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {budget.map((item) => (
              <label key={item.name} className="block space-y-1">
                <span className="text-sm font-medium">{item.name}</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-muted-foreground">$</span>
                  <input
                    value={item.amount}
                    type="number"
                    onChange={(event) => updateBudgetValue(item.name, Number(event.target.value))}
                    className="h-10 w-full rounded-xl border border-border bg-background pl-7 pr-3"
                  />
                </div>
              </label>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Split</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={budget} dataKey="amount" nameKey="name" outerRadius={90} innerRadius={50}>
                    {budget.map((entry, index) => (
                      <Cell key={entry.name} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatAUD(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground">Total weekly budget: {formatAUD(total)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Smart Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Current savings share: <span className="font-semibold">{savingsRate.toFixed(1)}%</span></p>
          <p>{savingsRate < 20 ? "Try moving toward a 20% savings goal if possible." : "Nice work hitting a strong savings ratio."}</p>
          <p>Check subscriptions monthly and cancel anything you forgot about.</p>
          <p className="text-xs text-muted-foreground">Educational budgeting guidance only, not financial advice.</p>
        </CardContent>
      </Card>
    </div>
  );
}
