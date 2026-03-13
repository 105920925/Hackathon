import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { useAppStore } from "./store/useAppStore";
import { LandingPage } from "./pages/LandingPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { TreePage } from "./pages/TreePage";
import { LearnPage } from "./pages/LearnPage";
import { ModulePlayerPage } from "./pages/ModulePlayerPage";
import { BudgetPage } from "./pages/BudgetPage";
import { BorrowingPage } from "./pages/BorrowingPage";
import { TaxesPage } from "./pages/TaxesPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";

function Protected({ children }: { children: ReactElement }) {
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);
  if (!hasOnboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route
        path="/app"
        element={
          <Protected>
            <AppShell />
          </Protected>
        }
      >
        <Route index element={<Navigate to="tree" replace />} />
        <Route path="tree" element={<TreePage />} />
        <Route path="garden" element={<Navigate to="/app/tree" replace />} />
        <Route path="learn" element={<LearnPage />} />
        <Route path="learn/:moduleId" element={<ModulePlayerPage />} />
        <Route path="budget" element={<BudgetPage />} />
        <Route path="borrowing" element={<BorrowingPage />} />
        <Route path="taxes" element={<TaxesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
