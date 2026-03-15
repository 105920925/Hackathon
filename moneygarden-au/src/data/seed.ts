import type { AppState } from "../types";

const today = new Date().toISOString();

export const seedState: AppState = {
  hasOnboarded: false,
  onboarding: {
    ageRange: "16-17",
    goal: "car",
    incomeStyle: "casual-job",
    confidence: "just-starting",
  },
  profile: {
    firstName: "Ava",
    preferredName: "Ava",
    dateOfBirth: "2009-08-14",
    stateOrTerritory: "NSW",
    ageRange: "16-17",
    schoolYear: "Year 11-12",
    goal: "car",
    incomeStyle: "casual-job",
    confidence: "just-starting",
  },
  xp: 180,
  streak: 4,
  modules: {
    "saving-bank-accounts": { completed: true, score: 94, highestStep: 3, completedAt: today },
    "interest-rates-loans": { completed: false, score: 68, highestStep: 2 },
    "taxes-employment": { completed: false, score: 0, highestStep: 0 },
    "stock-market-basics": { completed: false, score: 0, highestStep: 0 },
    "wise-spending": { completed: false, score: 0, highestStep: 0 },
  },
  savingsGoals: [
    {
      id: "goal-laptop",
      title: "Laptop Upgrade Fund",
      targetAmount: 1800,
      currentAmount: 950,
      timelineWeeks: 20,
      createdAt: "2026-01-20T00:00:00.000Z",
    },
    {
      id: "goal-emergency",
      title: "Mini Emergency Buffer",
      targetAmount: 500,
      currentAmount: 500,
      timelineWeeks: 12,
      completedAt: "2026-02-24T00:00:00.000Z",
      createdAt: "2026-01-28T00:00:00.000Z",
    },
  ],
  savingsLog: [
    { id: "log-1", goalId: "goal-laptop", date: "2026-02-01", amount: 60 },
    { id: "log-2", goalId: "goal-laptop", date: "2026-02-08", amount: 80 },
    { id: "log-3", goalId: "goal-laptop", date: "2026-02-15", amount: 110 },
    { id: "log-4", goalId: "goal-emergency", date: "2026-02-22", amount: 120 },
  ],
  badges: [
    { id: "first-branch", label: "First Branch", description: "Completed your first learning module." },
    { id: "streak-3", label: "3-Day Streak", description: "Returned to learn 3 days in a row." },
  ],
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
