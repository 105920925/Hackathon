import { motion } from "framer-motion";
import { ArrowRight, Leaf, Sparkles, TrendingUp } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { LandingHeroIllustration } from "../components/landing/LandingHeroIllustration";
import { Button } from "../components/ui/button";
import { useAppStore } from "../store/useAppStore";

export function LandingPage() {
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);

  if (hasOnboarded) return <Navigate to="/app/garden" replace />;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.16),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.18),transparent_35%),linear-gradient(180deg,#f8fffb_0%,#f8fafc_55%,#eef6ff_100%)] px-4 py-8 text-zinc-900 dark:bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.22),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.24),transparent_35%),linear-gradient(180deg,#022c22_0%,#0f172a_55%,#020617_100%)] dark:text-zinc-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <p className="text-xl font-black tracking-tight">MoneyGarden AU</p>
          <Button asChild>
            <Link to="/onboarding">Start Learning</Link>
          </Button>
        </header>

        <section className="grid items-center gap-10 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="mb-4 text-4xl font-black leading-tight md:text-5xl">
              Grow smart money habits.
              <span className="block text-emerald-600 dark:text-emerald-400">Watch your garden bloom.</span>
            </h1>
            <p className="mb-6 text-base text-zinc-700 dark:text-zinc-300">
              Built for Aussie teens 13-19. Learn payslips, GST, TFN basics, saving goals, and borrowing choices through interactive mini-modules.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/onboarding" className="inline-flex items-center gap-2">
                  Start Learning <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/app/learn">Preview Modules</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-zinc-500">Educational only. Not financial advice.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <LandingHeroIllustration />
          </motion.div>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Leaf,
              title: "Garden Progress",
              body: "Savings logs and lesson completions unlock plants, blooms, and new garden items.",
            },
            {
              icon: TrendingUp,
              title: "AU Teen Money Skills",
              body: "Casual jobs, penalty rates context, payslips, super basics, and simple tax concepts.",
            },
            {
              icon: Sparkles,
              title: "Quick Interactive Lessons",
              body: "Drag-and-drop, scenarios, quizzes, and calculators that feel like a real product.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/80">
                <Icon className="mb-3 h-5 w-5 text-emerald-500" />
                <h3 className="mb-1 font-semibold">{item.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">{item.body}</p>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
