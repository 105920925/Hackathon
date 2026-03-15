import { BookOpen, GitBranch, Goal, HandCoins, UserCircle2, Wallet } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useAppStore } from "../../store/useAppStore";

const navItems = [
  { to: "/app/tree", label: "Learning Tree", icon: GitBranch },
  { to: "/app/learn", label: "Learn", icon: BookOpen },
  { to: "/app/savings", label: "Goals", icon: Goal },
  { to: "/app/budget", label: "Budget", icon: Wallet },
  { to: "/app/borrowing", label: "Borrowing", icon: HandCoins },
  { to: "/app/profile", label: "Profile", icon: UserCircle2 },
];

export function AppShell() {
  const darkMode = useAppStore((state) => state.darkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <Link to="/app/tree" className="inline-flex items-center gap-2 text-lg font-semibold">
            <GitBranch className="h-5 w-5 text-emerald-500" /> CashCraft
          </Link>
          <Button variant="outline" size="sm" onClick={toggleDarkMode}>
            {darkMode ? "Light mode" : "Dark mode"}
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr] md:px-6">
        <aside className="hidden md:block">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                      isActive ? "bg-emerald-500 text-white" : "hover:bg-muted",
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-6 border-t border-border bg-background/95 p-2 backdrop-blur md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => cn("rounded-lg p-2", isActive && "bg-emerald-500 text-white")}>
              <div className="flex flex-col items-center text-[10px]">
                <Icon className="mb-0.5 h-4 w-4" />
                {item.label}
              </div>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
