import { create } from "zustand";
import { persist } from "zustand/middleware";
import { seedState } from "../data/seed";
import { moduleMap } from "../data/modules";
import { getGardenLevel, getUnlocksForLevel } from "../lib/game";
import type { AppState, OnboardingData } from "../types";

type Store = AppState & {
  completeOnboarding: (payload: OnboardingData) => void;
  addXp: (amount: number) => void;
  logSavings: (amount: number) => { ok: boolean; message: string };
  updateSavingsGoal: (targetAmount: number, timelineWeeks: number, title: string) => void;
  completeModule: (moduleId: string, score: number, completedSteps: number) => void;
  setModuleProgress: (moduleId: string, highestStep: number, score: number) => void;
  updateBudgetValue: (category: string, amount: number) => void;
  toggleDarkMode: () => void;
  resetProgress: () => void;
};

const ensureInventory = (xp: number) => getUnlocksForLevel(getGardenLevel(xp));

const safeNumber = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const normalizeSavingsGoal = (state?: Partial<AppState>) => ({
  ...seedState.savingsGoal,
  ...(state?.savingsGoal ?? {}),
  targetAmount: safeNumber(state?.savingsGoal?.targetAmount, seedState.savingsGoal.targetAmount),
  currentAmount: safeNumber(state?.savingsGoal?.currentAmount, seedState.savingsGoal.currentAmount),
  timelineWeeks: safeNumber(state?.savingsGoal?.timelineWeeks, seedState.savingsGoal.timelineWeeks),
  title:
    typeof state?.savingsGoal?.title === "string" && state.savingsGoal.title.trim()
      ? state.savingsGoal.title
      : seedState.savingsGoal.title,
});

const normalizeState = (state?: Partial<AppState>): AppState => ({
  ...seedState,
  ...state,
  onboarding: {
    ...seedState.onboarding,
    ...(state?.onboarding ?? {}),
  },
  savingsGoal: normalizeSavingsGoal(state),
  modules: {
    ...seedState.modules,
    ...(state?.modules ?? {}),
  },
  badges: Array.isArray(state?.badges) ? state.badges : seedState.badges,
  inventory: Array.isArray(state?.inventory) ? state.inventory : seedState.inventory,
  paychecks: Array.isArray(state?.paychecks) ? state.paychecks : seedState.paychecks,
  budget: Array.isArray(state?.budget) ? state.budget : seedState.budget,
  savingsLog: Array.isArray(state?.savingsLog) ? state.savingsLog : seedState.savingsLog,
});

export const useAppStore = create<Store>()(
  persist(
    (set) => ({
      ...seedState,
      completeOnboarding: (payload) => set(() => ({ onboarding: payload, hasOnboarded: true })),
      addXp: (amount) =>
        set((state) => {
          const xp = state.xp + amount;
          return { xp, inventory: ensureInventory(xp) };
        }),
      logSavings: (amount) => {
        if (Number.isNaN(amount) || amount <= 0) return { ok: false, message: "Enter an amount above $0." };
        set((state) => ({
          savingsGoal: {
            ...state.savingsGoal,
            currentAmount: Math.min(state.savingsGoal.currentAmount + amount, state.savingsGoal.targetAmount),
          },
          savingsLog: [{ date: new Date().toISOString().slice(0, 10), amount }, ...state.savingsLog].slice(0, 20),
          xp: state.xp + 12,
          inventory: ensureInventory(state.xp + 12),
        }));
        return { ok: true, message: "Nice work. Your plant got a growth boost." };
      },
      updateSavingsGoal: (targetAmount, timelineWeeks, title) =>
        set((state) => ({
          savingsGoal: {
            ...state.savingsGoal,
            title,
            targetAmount,
            timelineWeeks,
            currentAmount: Math.min(state.savingsGoal.currentAmount, targetAmount),
          },
        })),
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
          const earnedXp = module ? module.xpBonus : 20;
          const xp = state.xp + (justCompleted ? earnedXp : 0);
          const badges = [...state.badges];

          if (justCompleted && !badges.find((b) => b.id === `module-${moduleId}`)) {
            badges.push({
              id: `module-${moduleId}`,
              label: "Module Complete",
              description: `Finished ${module?.title ?? "a module"}.`,
            });
          }

          return {
            xp,
            inventory: ensureInventory(xp),
            badges,
            modules: {
              ...state.modules,
              [moduleId]: {
                completed: true,
                highestStep: completedSteps,
                score: Math.max(score, current.score),
                completedAt: new Date().toISOString(),
              },
            },
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
      version: 1,
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
