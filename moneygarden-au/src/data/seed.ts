import type { AppState } from "../types";

export const seedState: AppState = {
  hasOnboarded: false,
  onboarding: {
    ageRange: "16-17",
    goal: "car",
    incomeStyle: "casual-job",
    confidence: "just-starting",
  },
  xp: 180,
  streak: 4,
  modules: {
    "saving-goals-101": { completed: true, score: 92, highestStep: 3, completedAt: new Date().toISOString() },
    "paycheck-rule": { completed: false, score: 65, highestStep: 2 },
    "needs-vs-wants": { completed: false, score: 0, highestStep: 0 },
    "interest-rates": { completed: false, score: 0, highestStep: 0 },
    "borrowing-basics": { completed: false, score: 0, highestStep: 0 },
    "big-purchase-planning": { completed: false, score: 0, highestStep: 0 },
    "taxes-australia": { completed: false, score: 0, highestStep: 0 },
    "scams-safety": { completed: false, score: 0, highestStep: 0 },
  },
  savingsGoal: {
    title: "First Car Fund",
    targetAmount: 3500,
    currentAmount: 620,
    timelineWeeks: 40,
  },
  savingsLog: [
    { date: "2026-02-01", amount: 60 },
    { date: "2026-02-08", amount: 80 },
    { date: "2026-02-15", amount: 95 },
    { date: "2026-02-22", amount: 70 },
  ],
  badges: [
    { id: "first-seed", label: "First Seed", description: "Completed your first module." },
    { id: "streak-3", label: "3-Day Streak", description: "Returned to learn 3 days in a row." },
  ],
  inventory: ["Sprout Pot", "Sunflower Patch"],
  paychecks: [
    {
      id: "pay-1",
      employer: "Coastal Cafe",
      gross: 410,
      taxWithheld: 34,
      superAmount: 45,
      net: 376,
      period: "Fortnight ending 2026-02-14",
    },
    {
      id: "pay-2",
      employer: "Coastal Cafe",
      gross: 380,
      taxWithheld: 30,
      superAmount: 42,
      net: 350,
      period: "Fortnight ending 2026-02-28",
    },
  ],
  budget: [
    { name: "Transport", amount: 35 },
    { name: "Food", amount: 70 },
    { name: "Subscriptions", amount: 18 },
    { name: "Savings", amount: 90 },
    { name: "Fun", amount: 55 },
  ],
  darkMode: false,
};

