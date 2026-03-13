import { modules } from "../data/modules";
import type { ModuleProgress, SavingsGoal } from "../types";

export type TreeProgressSnapshot = {
  completedModules: number;
  totalModules: number;
  completedGoals: number;
  totalGoals: number;
  branchProgress: number;
  branchSegments: boolean[];
  canopyComplete: boolean;
  activeGoalCount: number;
};

export function getTreeProgress(modulesState: Record<string, ModuleProgress>, savingsGoals: SavingsGoal[]): TreeProgressSnapshot {
  const completedModules = modules.filter((module) => modulesState[module.id]?.completed).length;
  const totalModules = modules.length;
  const completedGoals = savingsGoals.filter((goal) => Boolean(goal.completedAt)).length;

  return {
    completedModules,
    totalModules,
    completedGoals,
    totalGoals: savingsGoals.length,
    branchProgress: totalModules === 0 ? 0 : completedModules / totalModules,
    branchSegments: modules.map((module) => Boolean(modulesState[module.id]?.completed)),
    canopyComplete: totalModules > 0 && completedModules === totalModules,
    activeGoalCount: savingsGoals.filter((goal) => !goal.completedAt).length,
  };
}
