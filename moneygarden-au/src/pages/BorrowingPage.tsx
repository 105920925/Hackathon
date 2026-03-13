import { useMemo, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { calculateMonthlyRepayment, getRepaymentSchedule } from "../lib/finance";
import { formatAUD } from "../lib/utils";
import { Button } from "../components/ui/button";

const scenarioOptions = [
  {
    label: "Buy now with BNPL + late fees risk",
    result: "Higher stress and stacked repayments can reduce your savings momentum.",
  },
  {
    label: "Save for 10 weeks then buy",
    result: "Lowest cost path. Keeps flexibility and avoids debt surprises.",
  },
  {
    label: "Credit card minimum payments",
    result: "Can become expensive if repayments drag on.",
  },
];

export function BorrowingPage() {
  const [principal, setPrincipal] = useState(1800);
  const [rate, setRate] = useState(13);
  const [years, setYears] = useState(2);
  const [picked, setPicked] = useState<number | null>(null);

  const monthly = useMemo(() => calculateMonthlyRepayment(principal, rate, years), [principal, rate, years]);
  const schedule = useMemo(() => getRepaymentSchedule(principal, rate, years), [principal, rate, years]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Borrowing & Big Purchases</h1>
        <p className="text-sm text-muted-foreground">Understand interest, repayments, and BNPL tradeoffs in an AU context.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Repayment Calculator (Simplified)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="block space-y-1 text-sm">
              Principal ($AUD)
              <input type="number" className="h-10 w-full rounded-xl border border-border bg-background px-3" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
            </label>
            <label className="block space-y-1 text-sm">
              Interest Rate (% p.a.)
              <input type="number" className="h-10 w-full rounded-xl border border-border bg-background px-3" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
            </label>
            <label className="block space-y-1 text-sm">
              Term (years)
              <input type="number" className="h-10 w-full rounded-xl border border-border bg-background px-3" value={years} onChange={(e) => setYears(Number(e.target.value))} />
            </label>
            <p className="rounded-xl bg-muted p-3 text-sm">
              Estimated monthly repayment: <span className="font-semibold">{formatAUD(monthly)}</span>
            </p>
            <p className="text-xs text-muted-foreground">Estimator is simplified and educational only, not lender advice.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Balance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={schedule.filter((_, i) => i % 2 === 0)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatAUD(Number(value))} />
                  <Line type="monotone" dataKey="balance" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scenario Game: Choose Your Path</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {scenarioOptions.map((option, idx) => (
            <Button key={option.label} variant={picked === idx ? "secondary" : "outline"} className="w-full justify-start" onClick={() => setPicked(idx)}>
              {option.label}
            </Button>
          ))}
          {picked !== null && <p className="rounded-xl bg-emerald-50 p-3 text-sm dark:bg-emerald-950/40">{scenarioOptions[picked].result}</p>}
          <p className="text-xs text-muted-foreground">BNPL may look easy, but missed payments and late fees can add pressure quickly.</p>
        </CardContent>
      </Card>
    </div>
  );
}
