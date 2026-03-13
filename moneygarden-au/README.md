# MoneyGarden AU

Production-ready MVP web app for Australian teens (13-19) to build financial responsibility through gamified learning.

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- shadcn/ui-style components (Button/Card/Dialog/Tabs)
- lucide-react icons
- recharts
- Zustand + localStorage persistence

## Run Locally
1. Open terminal in `moneygarden-au`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Open the local URL shown by Vite.

## Included Features
- Landing/marketing page with CTA and product visuals
- Multi-step onboarding flow
- Full app layout with responsive sidebar + mobile bottom nav
- Garden dashboard with animated growth and unlockable items
- Learn hub with filters (`New`, `Popular`, `Quick 5-min`)
- Interactive module player with:
  - quizzes
  - sliders
  - scenarios
  - drag-and-drop matching
- Budget tool with editable categories + pie chart
- Borrowing simulator with repayment calculator + chart + scenario game
- Taxes basics page with AU-friendly payslip explainer + simplified teen estimator
- Profile/progress page with streaks, badges, module completion, dark mode toggle
- Reset progress and export summary JSON
- LocalStorage persistence for progress, XP, modules, savings, badges, and settings
- AU context (AUD formatting, TFN, payslip, super basics, withholding, Medicare levy mention)

## Educational Disclaimer
This app is educational only and does **not** provide financial, tax, or legal advice.

## Seed Demo Data
Seed data lives in:
- `src/data/seed.ts`

It includes:
- mock profile + onboarding defaults
- sample paychecks
- starter goals + savings log
- starter module progress
- initial badges and inventory

## Where to Edit Module Content
- Module definitions and interactive steps:
  - `src/data/modules.ts`
- Module rendering engine:
  - `src/components/modules/ModuleStepRenderer.tsx`
- Module player logic (XP + completion flow):
  - `src/pages/ModulePlayerPage.tsx`

## Core Structure
- `src/pages/*` - all screens
- `src/components/*` - UI and feature components
- `src/store/useAppStore.ts` - global state + persistence
- `src/lib/finance.ts` - calculators and estimators
- `src/lib/game.ts` - XP levels and unlock logic
- `src/lib/utils.ts` - AUD formatter and export helper
- `src/data/*` - seed content + learning modules
