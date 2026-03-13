import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useMemo } from "react";
import { formatAUD } from "../../lib/utils";

type Props = {
  currentSavings: number;
  targetSavings: number;
  unlockedItems: string[];
  onInspectItem: (item: string) => void;
};

export function GardenCanvas({ currentSavings, targetSavings, unlockedItems, onInspectItem }: Props) {
  const safeCurrent = Number.isFinite(currentSavings) ? currentSavings : 0;
  const safeTarget = Number.isFinite(targetSavings) && targetSavings > 0 ? targetSavings : 1;
  const progress = Math.min(1, Math.max(0, safeCurrent / safeTarget));
  const plantScale = 0.5 + progress * 0.9;

  const flowers = useMemo(() => {
    const count = Math.max(2, Math.round(progress * 9));
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: 12 + i * 9,
      delay: i * 0.06,
    }));
  }, [progress]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-100 via-lime-50 to-sky-100 p-6 dark:border-emerald-900/40 dark:from-emerald-950 dark:via-zinc-900 dark:to-sky-950">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Savings Water Level</p>
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          {formatAUD(safeCurrent)} / {formatAUD(safeTarget)}
        </p>
      </div>

      <div className="relative h-64">
        <motion.div
          className="absolute bottom-0 left-1/2 h-44 w-6 -translate-x-1/2 rounded-full bg-emerald-700"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: plantScale }}
          transition={{ duration: 0.7 }}
          style={{ transformOrigin: "bottom center" }}
        />

        <motion.div
          className="absolute bottom-[158px] left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-emerald-500"
          initial={{ scale: 0 }}
          animate={{ scale: plantScale }}
          transition={{ type: "spring", stiffness: 110, damping: 12 }}
        />

        {flowers.map((flower) => (
          <motion.div
            key={flower.id}
            className="absolute bottom-8"
            style={{ left: `${flower.left}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: flower.delay, duration: 0.3 }}
          >
            <div className="h-5 w-5 rounded-full bg-pink-400 shadow" />
          </motion.div>
        ))}
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {unlockedItems.map((item) => (
          <button
            key={item}
            onClick={() => onInspectItem(item)}
            className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-left text-sm font-medium hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/70"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
