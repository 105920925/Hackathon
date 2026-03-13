export function calculateWeeklySavings(targetAmount: number, timelineWeeks: number) {
  if (timelineWeeks <= 0) return 0;
  return targetAmount / timelineWeeks;
}

export function calculateSimpleInterest(principal: number, ratePercent: number, years: number) {
  const rate = ratePercent / 100;
  return principal * rate * years;
}

export function calculateMonthlyRepayment(principal: number, annualRatePercent: number, years: number) {
  const monthlyRate = annualRatePercent / 100 / 12;
  const months = years * 12;
  if (months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

export function getRepaymentSchedule(principal: number, annualRatePercent: number, years: number) {
  const payment = calculateMonthlyRepayment(principal, annualRatePercent, years);
  const monthlyRate = annualRatePercent / 100 / 12;
  const months = years * 12;
  let balance = principal;

  return Array.from({ length: months }).map((_, index) => {
    const interest = balance * monthlyRate;
    const principalPaid = payment - interest;
    balance = Math.max(0, balance - principalPaid);

    return {
      month: index + 1,
      balance: Math.round(balance),
      interest: Math.round(interest),
      payment: Math.round(payment),
    };
  });
}

export function estimateTeenTaxAnnual(incomeAnnual: number) {
  // Simplified educational estimate only.
  if (incomeAnnual <= 18200) return 0;
  if (incomeAnnual <= 45000) return (incomeAnnual - 18200) * 0.16;
  return (45000 - 18200) * 0.16 + (incomeAnnual - 45000) * 0.3;
}
