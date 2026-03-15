export type Difficulty = "Beginner" | "Intermediate";

export type ModuleFilter = "New" | "Popular" | "Quick 5-min";

export type AustralianState = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";

export type ModuleIcon =
  | "Landmark"
  | "BadgeDollarSign"
  | "ReceiptText"
  | "CandlestickChart"
  | "ShoppingBag";

export type OnboardingData = {
  ageRange: "13-15" | "16-17" | "18-19";
  goal: "car" | "phone" | "travel" | "emergency";
  incomeStyle: "casual-job" | "allowance" | "mixed";
  confidence: "just-starting" | "getting-there" | "pretty-confident";
};

export type UserProfile = {
  firstName: string;
  preferredName: string;
  dateOfBirth: string;
  stateOrTerritory: AustralianState;
  ageRange: OnboardingData["ageRange"];
  schoolYear: "Year 7-8" | "Year 9-10" | "Year 11-12" | "Finished school" | "TAFE / Uni";
  goal: OnboardingData["goal"];
  incomeStyle: OnboardingData["incomeStyle"];
  confidence: OnboardingData["confidence"];
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

export type LessonCallout = {
  tone: "tip" | "watch-out" | "did-you-know" | "summary";
  title: string;
  body: string;
};

export type LessonVisualItem = {
  label: string;
  value: string;
  detail: string;
};

export type LessonComparisonCard = {
  title: string;
  body: string;
};

export type LessonGlossaryItem = {
  term: string;
  definition: string;
};

export type LessonSection = {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: LessonCallout;
  exampleTitle?: string;
  exampleItems?: string[];
  visualTitle?: string;
  visualItems?: LessonVisualItem[];
  comparisonTitle?: string;
  comparisonCards?: LessonComparisonCard[];
  recap?: string;
  glossary?: LessonGlossaryItem[];
};

export type LessonStep = StepBase & {
  type: "lesson";
  objective: string;
  intro: string;
  sections: LessonSection[];
  regionalNotes?: Partial<Record<AustralianState, string>>;
};

export type QuizSetQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type QuizSetStep = StepBase & {
  type: "quiz-set";
  intro: string;
  questions: QuizSetQuestion[];
};

export type EmploymentStudioData = {
  employerName: string;
  employerTagline: string;
  employeeName: string;
  role: string;
  payPeriod: string;
  abn: string;
  fields: Array<{
    id: string;
    label: string;
    value: string;
    explanation: string;
    category: "header" | "earnings" | "deductions" | "super" | "totals";
  }>;
  calculatorDefaults: {
    hours: number;
    rate: number;
  };
  threshold: number;
  questScenes: Array<{
    id: string;
    title: string;
    description: string;
    options: Array<{
      id: string;
      label: string;
      outcome: string;
      correct: boolean;
    }>;
  }>;
};

export type MarketStudioData = {
  companies: Array<{
    id: string;
    name: string;
    sector: string;
    blurb: string;
    purchasePrice: number;
    events: Array<{
      id: string;
      headline: string;
      summary: string;
      price: number;
      reason: string;
    }>;
  }>;
  timeline: Array<{
    id: string;
    title: string;
    body: string;
    accent: string;
  }>;
};

export type SpendingStudioData = {
  startingBalance: number;
  savingsGoal: {
    title: string;
    target: number;
    current: number;
  };
  feedItems: Array<{
    id: string;
    name: string;
    price: number;
    category: string;
    reason: string;
    urgency: string;
    planned: boolean;
    outcomes: {
      buyNow: string;
      wait24: string;
      compare: string;
      skip: string;
    };
    comparePrice?: number;
  }>;
  rounds: Array<{
    id: string;
    item: string;
    options: Array<{
      id: string;
      store: string;
      price: number;
      shipping: number;
      discount: number;
      condition: string;
      bestValue: boolean;
      explanation: string;
    }>;
  }>;
};

export type SavingStudioData = {
  accounts: Array<{
    id: string;
    name: string;
    purpose: string;
    features: string[];
  }>;
  scenarios: Array<{
    id: string;
    title: string;
    description: string;
    bestAccountId: string;
  }>;
  weeks: number[];
};

export type BorrowingStudioData = {
  glossary: Record<string, string>;
  scenarios: Array<{
    id: string;
    label: string;
    amount: number;
    termMonths: number;
    options: Array<{
      id: string;
      label: string;
      monthly: number;
      totalCost: number;
      tags: string[];
      best: boolean;
      explanation: string;
    }>;
  }>;
};

export type ActivityStep =
  | (StepBase & {
      type: "activity";
      activityType: "saving-studio";
      intro: string;
      data: SavingStudioData;
    })
  | (StepBase & {
      type: "activity";
      activityType: "borrowing-studio";
      intro: string;
      data: BorrowingStudioData;
    })
  | (StepBase & {
      type: "activity";
      activityType: "employment-studio";
      intro: string;
      data: EmploymentStudioData;
    })
  | (StepBase & {
      type: "activity";
      activityType: "market-studio";
      intro: string;
      data: MarketStudioData;
    })
  | (StepBase & {
      type: "activity";
      activityType: "spending-studio";
      intro: string;
      data: SpendingStudioData;
    });

export type ModuleStep = QuizStep | SliderStep | ScenarioStep | MatchStep | InfoStep | LessonStep | QuizSetStep | ActivityStep;

export type LearningModule = {
  id: string;
  moduleNumber: number;
  title: string;
  shortDescription: string;
  difficulty: Difficulty;
  minutes: number;
  filterTags: ModuleFilter[];
  themeColor: string;
  icon: ModuleIcon;
  steps: ModuleStep[];
  xpBonus: number;
  branchLabel: string;
};

export type ModuleProgress = {
  completed: boolean;
  score: number;
  highestStep: number;
  completedAt?: string;
};

export type SavingsGoal = {
  id: string;
  targetAmount: number;
  currentAmount: number;
  timelineWeeks: number;
  title: string;
  completedAt?: string;
  createdAt: string;
};

export type SavingsGoalDraft = {
  title: string;
  targetAmount: number;
  timelineWeeks: number;
};

export type SavingsLogEntry = {
  id: string;
  goalId: string;
  date: string;
  amount: number;
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
  profile: UserProfile;
  xp: number;
  streak: number;
  modules: Record<string, ModuleProgress>;
  savingsGoals: SavingsGoal[];
  savingsLog: SavingsLogEntry[];
  badges: Badge[];
  paychecks: Paycheck[];
  budget: BudgetCategory[];
  darkMode: boolean;
};
