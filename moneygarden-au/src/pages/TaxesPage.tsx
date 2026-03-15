import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAppStore } from "../store/useAppStore";
import { estimateTeenTaxAnnual } from "../lib/finance";
import { formatAUD } from "../lib/utils";

export function TaxesPage() {
  const paychecks = useAppStore((state) => state.paychecks);
  const [weeklyHours, setWeeklyHours] = useState("14");
  const [hourlyRate, setHourlyRate] = useState("24");

  const annualGross = Number(weeklyHours || 0) * Number(hourlyRate || 0) * 52;
  const estimatedTax = useMemo(() => estimateTeenTaxAnnual(annualGross), [annualGross]);

  const selectedPay = paychecks[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Taxes Basics (Australia)</h1>
        <p className="text-sm text-muted-foreground">TFN, payslip breakdown, withholding concept, and simple teen estimator.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Payslip Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-border p-4">
            <p className="font-semibold">{selectedPay.employer}</p>
            <p className="text-muted-foreground">{selectedPay.period}</p>
            <p>Gross pay: <span className="font-semibold">{formatAUD(selectedPay.gross)}</span></p>
            <p>Tax withheld: <span className="font-semibold">{formatAUD(selectedPay.taxWithheld)}</span></p>
            <p>Super contribution: <span className="font-semibold">{formatAUD(selectedPay.superAmount)}</span></p>
            <p>Net pay (banked): <span className="font-semibold text-emerald-600">{formatAUD(selectedPay.net)}</span></p>
          </div>
          <div className="space-y-2 rounded-xl border border-border p-4">
            <p className="font-medium">Where did my money go?</p>
            <p>Gross is total before deductions.</p>
            <p>Withholding tax is a pay-as-you-go estimate.</p>
            <p>Super is generally for retirement and not immediate spend money.</p>
            <p>TFN helps employers apply the right withholding settings.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teen Casual Job Estimator (Very Simplified)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="block text-sm">
              Weekly hours
              <input type="number" value={weeklyHours} onChange={(e) => setWeeklyHours(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3" />
            </label>
            <label className="block text-sm">
              Hourly rate (AUD)
              <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-border bg-background px-3" />
            </label>
            <p className="text-xs text-muted-foreground">Penalty rates, offsets, HELP debt, and Medicare levy details are not fully modeled here.</p>
          </div>
          <div className="space-y-2 rounded-xl bg-muted p-4 text-sm">
            <p>Estimated annual gross: <span className="font-semibold">{formatAUD(annualGross)}</span></p>
            <p>Estimated annual tax: <span className="font-semibold">{formatAUD(estimatedTax)}</span></p>
            <p>Estimated weekly tax set-aside: <span className="font-semibold">{formatAUD(estimatedTax / 52)}</span></p>
            <p className="pt-2 text-xs">Educational only. Not tax, legal, or financial advice.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
