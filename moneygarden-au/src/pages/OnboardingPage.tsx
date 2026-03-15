import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, MapPinned, Sparkles, UserCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useAppStore } from "../store/useAppStore";
import type { AustralianState, UserProfile } from "../types";

const states: AustralianState[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

const initialProfile: UserProfile = {
  firstName: "",
  preferredName: "",
  dateOfBirth: "",
  stateOrTerritory: "NSW",
  ageRange: "16-17",
  schoolYear: "Year 11-12",
  goal: "car",
  incomeStyle: "casual-job",
  confidence: "just-starting",
};

function getAgeRangeFromDob(dateOfBirth: string): UserProfile["ageRange"] | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const beforeBirthday = now.getMonth() < dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate());
  if (beforeBirthday) age -= 1;
  if (age <= 15) return "13-15";
  if (age <= 17) return "16-17";
  return "18-19";
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const completeProfileSetup = useAppStore((state) => state.completeProfileSetup);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [showErrors, setShowErrors] = useState(false);

  const validation = useMemo(() => {
    const errors: string[] = [];
    if (!profile.preferredName.trim()) errors.push("Preferred name is required.");
    if (!profile.dateOfBirth) errors.push("Date of birth is required.");
    const derivedAge = getAgeRangeFromDob(profile.dateOfBirth);
    if (!derivedAge) errors.push("Date of birth must be valid.");
    return { valid: errors.length === 0, errors, derivedAge };
  }, [profile.dateOfBirth, profile.preferredName]);

  const submit = () => {
    setShowErrors(true);
    if (!validation.valid || !validation.derivedAge) return;
    completeProfileSetup({
      ...profile,
      ageRange: validation.derivedAge,
      firstName: profile.firstName.trim(),
      preferredName: profile.preferredName.trim(),
    });
    navigate("/app/tree");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.18),transparent_24%),linear-gradient(135deg,#f8fffb,#eef7ff)] p-4 dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.16),transparent_24%),linear-gradient(135deg,#07111d,#0d1726)]">
      <Card className="w-full max-w-4xl border-white/60 bg-white/90 shadow-[0_30px_90px_-48px_rgba(14,116,144,0.55)] dark:border-white/10 dark:bg-zinc-950/85">
        <CardHeader className="border-b border-dashed border-border pb-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
                <UserCircle2 className="h-4 w-4" />
                Profile Setup
              </div>
              <CardTitle className="mt-3 text-3xl font-black tracking-tight">Set up your CashCraft profile</CardTitle>
              <CardDescription className="mt-2">
                This replaces the old onboarding slides. Your profile helps personalise examples, state-specific notes, and the tone of the learning experience.
              </CardDescription>
            </div>
            <div className="rounded-[28px] border border-border bg-muted/40 p-4 text-sm">
              <p className="font-semibold">Privacy note</p>
              <p className="mt-2 text-muted-foreground">Profile data stays in your local saved app state. Keep it simple and do not enter anything sensitive beyond what the app asks for.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 py-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <section className="rounded-[28px] border border-border bg-background/70 p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <h2 className="font-semibold">About you</h2>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  <span>First name</span>
                  <input
                    value={profile.firstName}
                    onChange={(event) => setProfile((prev) => ({ ...prev, firstName: event.target.value }))}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3"
                    placeholder="Optional"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>Preferred name</span>
                  <input
                    value={profile.preferredName}
                    onChange={(event) => setProfile((prev) => ({ ...prev, preferredName: event.target.value }))}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3"
                    placeholder="What should we call you?"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>Date of birth</span>
                  <input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(event) => setProfile((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>School year / stage</span>
                  <select
                    value={profile.schoolYear}
                    onChange={(event) => setProfile((prev) => ({ ...prev, schoolYear: event.target.value as UserProfile["schoolYear"] }))}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3"
                  >
                    <option>Year 7-8</option>
                    <option>Year 9-10</option>
                    <option>Year 11-12</option>
                    <option>Finished school</option>
                    <option>TAFE / Uni</option>
                  </select>
                </label>
              </div>
            </section>

            <section className="rounded-[28px] border border-border bg-background/70 p-5">
              <div className="flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-sky-600" />
                <h2 className="font-semibold">Location & learning context</h2>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  <span>State or territory</span>
                  <select
                    value={profile.stateOrTerritory}
                    onChange={(event) => setProfile((prev) => ({ ...prev, stateOrTerritory: event.target.value as AustralianState }))}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3"
                  >
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>Main money goal</span>
                  <select
                    value={profile.goal}
                    onChange={(event) => setProfile((prev) => ({ ...prev, goal: event.target.value as UserProfile["goal"] }))}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3"
                  >
                    <option value="car">Car</option>
                    <option value="phone">Phone</option>
                    <option value="travel">Travel</option>
                    <option value="emergency">Emergency fund</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>Income style</span>
                  <select
                    value={profile.incomeStyle}
                    onChange={(event) => setProfile((prev) => ({ ...prev, incomeStyle: event.target.value as UserProfile["incomeStyle"] }))}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3"
                  >
                    <option value="casual-job">Casual job</option>
                    <option value="allowance">Allowance</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>Money confidence</span>
                  <select
                    value={profile.confidence}
                    onChange={(event) => setProfile((prev) => ({ ...prev, confidence: event.target.value as UserProfile["confidence"] }))}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3"
                  >
                    <option value="just-starting">Just starting</option>
                    <option value="getting-there">Getting there</option>
                    <option value="pretty-confident">Pretty confident</option>
                  </select>
                </label>
              </div>
            </section>
          </div>

          <div className="space-y-5">
            <section className="rounded-[28px] border border-border bg-[linear-gradient(135deg,rgba(34,197,94,0.08),rgba(56,189,248,0.08))] p-5">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-emerald-600" />
                <h2 className="font-semibold">What this changes</h2>
              </div>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>Your preferred name can be used in profile and learning screens.</p>
                <p>Your state or territory lets the app show national content by default and state-specific notes only where they actually matter.</p>
                <p>Your age/stage, goal, and confidence help examples feel more relevant without changing the core financial lessons.</p>
              </div>
            </section>

            <section className="rounded-[28px] border border-border bg-background/70 p-5">
              <h2 className="font-semibold">Profile preview</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl bg-muted/40 p-3">
                  <p className="text-muted-foreground">Display name</p>
                  <p className="font-semibold">{profile.preferredName.trim() || "Not set yet"}</p>
                </div>
                <div className="rounded-2xl bg-muted/40 p-3">
                  <p className="text-muted-foreground">State / territory</p>
                  <p className="font-semibold">{profile.stateOrTerritory}</p>
                </div>
                <div className="rounded-2xl bg-muted/40 p-3">
                  <p className="text-muted-foreground">Derived age range</p>
                  <p className="font-semibold">{validation.derivedAge ?? "Waiting for valid date of birth"}</p>
                </div>
              </div>
            </section>

            {showErrors && !validation.valid ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-100">
                {validation.errors.join(" ")}
              </div>
            ) : null}

            <div className="flex justify-end">
              <Button onClick={submit} size="lg">
                Save profile and enter the app
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
