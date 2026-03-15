import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { calculateMonthlyRepayment, getRepaymentSchedule } from "../lib/finance";
import { formatAUD } from "../lib/utils";
import { Button } from "../components/ui/button";

const glossary = {
  BNPL: "Buy now, pay later. It spreads payments, but it can still put pressure on future paydays.",
  interest: "The extra cost charged on borrowed money.",
  fees: "Extra charges on top of the amount borrowed.",
  repayment: "The amount you pay back regularly.",
  overdue: "A payment that is late or missed.",
  "late fee": "An extra charge added because a payment was not made on time.",
  "loan term": "How long you have to pay the borrowing back.",
};

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
        <p className="text-sm text-muted-foreground">Understand interest, repayments, BNPL tradeoffs, and borrowing language in an Australian context.</p>
      </div>

      <Card className="border-white/60 bg-white/85 shadow-sm dark:border-white/10 dark:bg-zinc-950/70">
        <CardHeader>
          <CardTitle>Borrowing glossary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {Object.entries(glossary).map(([term, explanation]) => (
            <details key={term} className="rounded-2xl border border-border bg-background/80 p-3">
              <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold">
                <HelpCircle className="h-4 w-4 text-sky-500" />
                {term}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{explanation}</p>
            </details>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Repayment Calculator (Simplified)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="block space-y-1 text-sm">
              Principal ({formatAUD(principal)})
              <input type="range" min="300" max="4000" step="50" className="w-full accent-sky-500" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
            </label>
            <label className="block space-y-1 text-sm">
              Interest rate ({rate}% p.a.)
              <input type="range" min="2" max="22" step="1" className="w-full accent-sky-500" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
            </label>
            <label className="block space-y-1 text-sm">
              Loan term ({years} years)
              <input type="range" min="1" max="5" step="1" className="w-full accent-sky-500" value={years} onChange={(e) => setYears(Number(e.target.value))} />
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
                <AreaChart data={schedule.filter((_, i) => i % 2 === 0)}>
                  <defs>
                    <linearGradient id="borrowing-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatAUD(Number(value))} />
                  <Area type="monotone" dataKey="balance" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#borrowing-fill)" />
                </AreaChart>
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
