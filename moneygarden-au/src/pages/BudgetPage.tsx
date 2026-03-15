import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAppStore } from "../store/useAppStore";
import { formatAUD } from "../lib/utils";

const colors = ["#22c55e", "#0ea5e9", "#f59e0b", "#a855f7", "#ef4444", "#14b8a6"];

export function BudgetPage() {
  const [newCategoryName, setNewCategoryName] = useState("");
  const budget = useAppStore((state) => state.budget);
  const addBudgetCategory = useAppStore((state) => state.addBudgetCategory);
  const updateBudgetCategory = useAppStore((state) => state.updateBudgetCategory);
  const removeBudgetCategory = useAppStore((state) => state.removeBudgetCategory);
  const chartData = useMemo(() => budget.filter((item) => item.amount > 0), [budget]);

  const total = useMemo(() => budget.reduce((acc, item) => acc + item.amount, 0), [budget]);
  const largestCategory = useMemo(
    () =>
      budget.reduce(
        (largest, item) => (item.amount > largest.amount ? item : largest),
        budget[0] ?? { id: "empty", name: "No category yet", amount: 0 },
      ),
    [budget],
  );
  const largestCategoryShare = total ? (largestCategory.amount / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Budget Builder</h1>
        <p className="text-sm text-muted-foreground">Build your own weekly budget with categories that match your real life.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Categories (AUD)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-dashed border-border p-3">
              <p className="mb-3 text-sm font-medium">Add a category</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={newCategoryName}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                  placeholder="Example: Rent, Gym, School supplies"
                  className="h-10 flex-1 rounded-xl border border-border bg-background px-3"
                />
                <Button
                  type="button"
                  onClick={() => {
                    const result = addBudgetCategory(newCategoryName);
                    if (result.ok) setNewCategoryName("");
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add category
                </Button>
              </div>
            </div>

            {budget.length === 0 ? (
              <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                Add your first budget category to start building your plan.
              </div>
            ) : (
              budget.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border/70 p-3">
                  <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr_auto] md:items-end">
                    <label className="block space-y-1">
                      <span className="text-sm font-medium">Category name</span>
                      <input
                        value={item.name}
                        onChange={(event) =>
                          updateBudgetCategory(item.id, { name: event.target.value })
                        }
                        className="h-10 w-full rounded-xl border border-border bg-background px-3"
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="text-sm font-medium">Weekly amount</span>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-muted-foreground">$</span>
                        <input
                          value={item.amount === 0 ? "" : item.amount}
                          type="number"
                          onChange={(event) =>
                            updateBudgetCategory(item.id, {
                              amount: event.target.value === "" ? 0 : Number(event.target.value),
                            })
                          }
                          className="h-10 w-full rounded-xl border border-border bg-background pl-7 pr-3"
                        />
                      </div>
                    </label>

                    <Button
                      type="button"
                      variant="outline"
                      className="md:mb-0"
                      onClick={() => removeBudgetCategory(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
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
                  <Pie data={chartData} dataKey="amount" nameKey="name" outerRadius={90} innerRadius={50}>
                    {chartData.map((entry, index) => (
                      <Cell key={entry.id} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatAUD(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {chartData.length === 0 && (
              <p className="mb-2 text-sm text-muted-foreground">
                Add amounts to your categories to see the chart fill in.
              </p>
            )}
            <p className="text-sm text-muted-foreground">Total weekly budget: {formatAUD(total)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Smart Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Largest category: <span className="font-semibold">{largestCategory.name}</span>
            {total > 0 ? ` (${largestCategoryShare.toFixed(1)}%)` : ""}
          </p>
          <p>
            {budget.length < 3
              ? "Try splitting your budget into a few clear categories so it is easier to spot where your money goes."
              : largestCategoryShare > 45
                ? "One category is taking a big share of the budget. Double-check that it still matches your priorities."
                : "Your budget looks reasonably balanced across categories."}
          </p>
          <p>Check subscriptions monthly and cancel anything you forgot about.</p>
          <p className="text-xs text-muted-foreground">Educational budgeting guidance only, not financial advice.</p>
        </CardContent>
      </Card>
    </div>
  );
}
