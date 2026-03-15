import {
  BadgeDollarSign,
  CandlestickChart,
  Landmark,
  ReceiptText,
  ShoppingBag,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { ModuleIcon } from "../../types";

const iconMap: Record<ModuleIcon, LucideIcon> = {
  Landmark,
  BadgeDollarSign,
  ReceiptText,
  CandlestickChart,
  ShoppingBag,
};

export function ModuleIconGlyph({ icon, ...props }: { icon: ModuleIcon } & LucideProps) {
  const Icon = iconMap[icon];
  return <Icon {...props} />;
}
