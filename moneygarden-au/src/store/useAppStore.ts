import { create } from "zustand";
import { persist } from "zustand/middleware";
import { seedState } from "../data/seed";
import { moduleMap, modules } from "../data/modules";
import type { AppState, OnboardingData, SavingsGoal, SavingsGoalDraft, SavingsLogEntry, UserProfile } from "../types";

type Store = AppState & {
  completeProfileSetup: (payload: UserProfile) => void;
  updateProfile: (payload: UserProfile) => void;
  addXp: (amount: number) => void;
  addSavingsGoal: (payload: SavingsGoalDraft) => void;
  updateSavingsGoal: (goalId: string, payload: SavingsGoalDraft) => void;
  removeSavingsGoal: (goalId: string) => void;
  logSavings: (goalId: string, amount: number) => { ok: boolean; message: string };
  completeModule: (moduleId: string, score: number, completedSteps: number) => void;
  setModuleProgress: (moduleId: string, highestStep: number, score: number) => void;
  updateBudgetValue: (category: string, amount: number) => void;
  toggleDarkMode: () => void;
  resetProgress: () => void;
};

type LegacyState = Partial<AppState> & {
  savingsGoal?: {
    targetAmount?: number;
    currentAmount?: number;
    timelineWeeks?: number;
    title?: string;
  };
  savingsLog?: Array<{ date?: string; amount?: number; goalId?: string; id?: string }>;
};

const safeNumber = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

function normalizeGoal(goal: Partial<SavingsGoal>, fallback: SavingsGoal): SavingsGoal {
  const currentAmount = safeNumber(goal.currentAmount, fallback.currentAmount);
  const targetAmount = Math.max(1, safeNumber(goal.targetAmount, fallback.targetAmount));

  return {
    id: typeof goal.id === "string" && goal.id.trim() ? goal.id : fallback.id,
    title: typeof goal.title === "string" && goal.title.trim() ? goal.title : fallback.title,
    currentAmount: Math.min(currentAmount, targetAmount),
    targetAmount,
    timelineWeeks: Math.max(1, safeNumber(goal.timelineWeeks, fallback.timelineWeeks)),
    createdAt: typeof goal.createdAt === "string" ? goal.createdAt : fallback.createdAt,
    completedAt:
      Math.min(currentAmount, targetAmount) >= targetAmount
        ? typeof goal.completedAt === "string"
          ? goal.completedAt
          : new Date().toISOString()
        : undefined,
  };
}

function normalizeSavingsGoals(state?: LegacyState) {
  const fallbackGoals = seedState.savingsGoals;

  if (Array.isArray(state?.savingsGoals) && state.savingsGoals.length > 0) {
    return state.savingsGoals.map((goal, index) => normalizeGoal(goal, fallbackGoals[index] ?? fallbackGoals[0]));
  }

  if (state?.savingsGoal) {
    // Migrate the previous single-goal model into the new multi-goal array without dropping user progress.
    return [
      normalizeGoal(
        {
          id: "legacy-goal",
          createdAt: new Date().toISOString(),
          ...state.savingsGoal,
        },
        fallbackGoals[0],
      ),
    ];
  }

  return fallbackGoals;
}

function normalizeSavingsLog(state: LegacyState | undefined, savingsGoals: SavingsGoal[]): SavingsLogEntry[] {
  const fallbackGoalId = savingsGoals[0]?.id ?? seedState.savingsGoals[0].id;

  if (!Array.isArray(state?.savingsLog)) return seedState.savingsLog;

  return state.savingsLog
    .map((entry, index) => ({
      id: typeof entry.id === "string" && entry.id.trim() ? entry.id : `log-${index + 1}`,
      goalId: typeof entry.goalId === "string" && entry.goalId.trim() ? entry.goalId : fallbackGoalId,
      date: typeof entry.date === "string" ? entry.date : new Date().toISOString().slice(0, 10),
      amount: safeNumber(entry.amount, 0),
    }))
    .filter((entry) => entry.amount > 0);
}

function normalizeState(state?: LegacyState): AppState {
  const savingsGoals = normalizeSavingsGoals(state);
  const rawGoal = (state?.onboarding as { goal?: string } | undefined)?.goal;
  const savedGoal =
    rawGoal === "holiday"
      ? "travel"
      : rawGoal === "car" || rawGoal === "phone" || rawGoal === "travel" || rawGoal === "emergency"
        ? rawGoal
        : undefined;

  return {
    ...seedState,
    ...state,
    onboarding: {
      ...seedState.onboarding,
      ...(state?.onboarding ?? {}),
      goal: savedGoal ?? seedState.onboarding.goal,
    },
    profile: {
      ...seedState.profile,
      ...(state?.profile ?? {}),
      ageRange:
        (state?.profile as Partial<UserProfile> | undefined)?.ageRange ??
        (state?.onboarding as Partial<OnboardingData> | undefined)?.ageRange ??
        seedState.profile.ageRange,
      goal:
        (state?.profile as Partial<UserProfile> | undefined)?.goal ??
        savedGoal ??
        seedState.profile.goal,
      incomeStyle:
        (state?.profile as Partial<UserProfile> | undefined)?.incomeStyle ??
        (state?.onboarding as Partial<OnboardingData> | undefined)?.incomeStyle ??
        seedState.profile.incomeStyle,
      confidence:
        (state?.profile as Partial<UserProfile> | undefined)?.confidence ??
        (state?.onboarding as Partial<OnboardingData> | undefined)?.confidence ??
        seedState.profile.confidence,
    },
    modules: {
      ...seedState.modules,
      ...(state?.modules ?? {}),
    },
    savingsGoals,
    savingsLog: normalizeSavingsLog(state, savingsGoals),
    badges: Array.isArray(state?.badges) ? state.badges : seedState.badges,
    paychecks: Array.isArray(state?.paychecks) ? state.paychecks : seedState.paychecks,
    budget: Array.isArray(state?.budget) ? state.budget : seedState.budget,
  };
}

function syncGoalCompletion(goal: SavingsGoal) {
  // Leaves are awarded from completed goals, so completion state must stay in sync with the saved amount.
  const completed = goal.currentAmount >= goal.targetAmount;
  return {
    ...goal,
    currentAmount: Math.min(goal.currentAmount, goal.targetAmount),
    completedAt: completed ? goal.completedAt ?? new Date().toISOString() : undefined,
  };
}

export const useAppStore = create<Store>()(
  persist(
    (set) => ({
      ...seedState,
      completeProfileSetup: (payload) =>
        set(() => ({
          profile: payload,
          onboarding: {
            ageRange: payload.ageRange,
            goal: payload.goal,
            incomeStyle: payload.incomeStyle,
            confidence: payload.confidence,
          },
          hasOnboarded: true,
        })),
      updateProfile: (payload) =>
        set(() => ({
          profile: payload,
          onboarding: {
            ageRange: payload.ageRange,
            goal: payload.goal,
            incomeStyle: payload.incomeStyle,
            confidence: payload.confidence,
          },
        })),
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      addSavingsGoal: (payload) =>
        set((state) => ({
          savingsGoals: [
            ...state.savingsGoals,
            {
              id: createId("goal"),
              createdAt: new Date().toISOString(),
              title: payload.title.trim(),
              targetAmount: Math.max(1, payload.targetAmount),
              currentAmount: 0,
              timelineWeeks: Math.max(1, payload.timelineWeeks),
            },
          ],
        })),
      updateSavingsGoal: (goalId, payload) =>
        set((state) => ({
          savingsGoals: state.savingsGoals.map((goal) =>
            goal.id === goalId
              ? syncGoalCompletion({
                  ...goal,
                  title: payload.title.trim(),
                  targetAmount: Math.max(1, payload.targetAmount),
                  timelineWeeks: Math.max(1, payload.timelineWeeks),
                  currentAmount: Math.min(goal.currentAmount, Math.max(1, payload.targetAmount)),
                })
              : goal,
          ),
        })),
      removeSavingsGoal: (goalId) =>
        set((state) => ({
          savingsGoals: state.savingsGoals.filter((goal) => goal.id !== goalId),
          savingsLog: state.savingsLog.filter((entry) => entry.goalId !== goalId),
        })),
      logSavings: (goalId, amount) => {
        if (Number.isNaN(amount) || amount <= 0) return { ok: false, message: "Enter an amount above A$0." };

        let message = "Deposit added to your savings goal.";

        set((state) => {
          const targetGoal = state.savingsGoals.find((goal) => goal.id === goalId);
          if (!targetGoal) {
            message = "Choose a savings goal first.";
            return state;
          }

          const beforeComplete = Boolean(targetGoal.completedAt);

          const savingsGoals = state.savingsGoals.map((goal) => {
            if (goal.id !== goalId) return goal;

            const updatedGoal = syncGoalCompletion({
              ...goal,
              currentAmount: goal.currentAmount + amount,
            });

            if (!beforeComplete && updatedGoal.completedAt) {
              message = "Goal complete. A new leaf has been added to your Learning Tree.";
            }

            return updatedGoal;
          });

          return {
            savingsGoals,
            savingsLog: [
              {
                id: createId("log"),
                goalId,
                date: new Date().toISOString().slice(0, 10),
                amount,
              },
              ...state.savingsLog,
            ].slice(0, 40),
            xp: state.xp + 12,
          };
        });

        return { ok: true, message };
      },
      setModuleProgress: (moduleId, highestStep, score) =>
        set((state) => ({
          modules: {
            ...state.modules,
            [moduleId]: {
              ...state.modules[moduleId],
              completed: state.modules[moduleId]?.completed ?? false,
              highestStep: Math.max(highestStep, state.modules[moduleId]?.highestStep ?? 0),
              score: Math.max(score, state.modules[moduleId]?.score ?? 0),
            },
          },
        })),
      completeModule: (moduleId, score, completedSteps) =>
        set((state) => {
          const module = moduleMap[moduleId];
          const current = state.modules[moduleId] ?? { completed: false, highestStep: 0, score: 0 };
          const justCompleted = !current.completed;
          const earnedXp = justCompleted ? module?.xpBonus ?? 20 : 0;
          const modulesState = {
            ...state.modules,
            [moduleId]: {
              completed: true,
              highestStep: completedSteps,
              score: Math.max(score, current.score),
              completedAt: new Date().toISOString(),
            },
          };
          const completedCount = modules.filter((item) => modulesState[item.id]?.completed).length;
          const badges = [...state.badges];

          if (justCompleted && !badges.find((badge) => badge.id === `module-${moduleId}`)) {
            badges.push({
              id: `module-${moduleId}`,
              label: "Branch Growth",
              description: `Unlocked ${module?.branchLabel.toLowerCase() ?? "a new branch"} on your Learning Tree.`,
            });
          }

          // The final canopy badge is derived from all learning modules, not XP or savings goals.
          if (completedCount === modules.length && !badges.find((badge) => badge.id === "canopy-complete")) {
            badges.push({
              id: "canopy-complete",
              label: "Canopy Complete",
              description: "Finished every learning module and unlocked the full tree canopy.",
            });
          }

          return {
            xp: state.xp + earnedXp,
            badges,
            modules: modulesState,
          };
        }),
      updateBudgetValue: (category, amount) =>
        set((state) => ({
          budget: state.budget.map((item) => (item.name === category ? { ...item, amount: Math.max(0, amount) } : item)),
        })),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      resetProgress: () => set(() => ({ ...seedState, hasOnboarded: true })),
    }),
    {
      name: "moneygarden-au-state",
      version: 2,
      merge: (persistedState, currentState) => {
        const merged = {
          ...(currentState as Store),
          ...(persistedState as Partial<Store>),
        };

        return {
          ...merged,
          ...normalizeState(merged),
        } as Store;
      },
    },
  ),
);
