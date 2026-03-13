export type Difficulty = "Beginner" | "Intermediate";

export type ModuleFilter = "New" | "Popular" | "Quick 5-min";

export type OnboardingData = {
  ageRange: "13-15" | "16-17" | "18-19";
  goal: "car" | "phone" | "holiday" | "emergency";
  incomeStyle: "casual-job" | "allowance" | "mixed";
  confidence: "just-starting" | "getting-there" | "pretty-confident";
};

export type StepBase = {
  id: string;
  title: string;
  description: string;
  xp: number;
};

export type QuizStep = StepBase & {
  type: "quiz";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type SliderStep = StepBase & {
  type: "slider";
  prompt: string;
  min: number;
  max: number;
  unit?: string;
  recommended: number;
  explanation: string;
};

export type ScenarioStep = StepBase & {
  type: "scenario";
  prompt: string;
  choices: Array<{
    label: string;
    impact: string;
    score: number;
  }>;
};

export type MatchStep = StepBase & {
  type: "match";
  prompt: string;
  pairs: Array<{
    item: string;
    category: "Need" | "Want";
  }>;
};

export type InfoStep = StepBase & {
  type: "info";
  bullets: string[];
};

export type ModuleStep = QuizStep | SliderStep | ScenarioStep | MatchStep | InfoStep;

export type LearningModule = {
  id: string;
  title: string;
  shortDescription: string;
  difficulty: Difficulty;
  minutes: number;
  filterTags: ModuleFilter[];
  themeColor: string;
  steps: ModuleStep[];
  xpBonus: number;
};

export type ModuleProgress = {
  completed: boolean;
  score: number;
  highestStep: number;
  completedAt?: string;
};

export type SavingsGoal = {
  targetAmount: number;
  currentAmount: number;
  timelineWeeks: number;
  title: string;
};

export type Paycheck = {
  id: string;
  employer: string;
  gross: number;
  taxWithheld: number;
  superAmount: number;
  net: number;
  period: string;
};

export type BudgetCategory = {
  name: string;
  amount: number;
};

export type Badge = {
  id: string;
  label: string;
  description: string;
};

export type AppState = {
  hasOnboarded: boolean;
  onboarding: OnboardingData;
  xp: number;
  streak: number;
  modules: Record<string, ModuleProgress>;
  savingsGoal: SavingsGoal;
  savingsLog: Array<{ date: string; amount: number }>;
  badges: Badge[];
  inventory: string[];
  paychecks: Paycheck[];
  budget: BudgetCategory[];
  darkMode: boolean;
};
