export function LandingHeroIllustration() {
  return (
    <svg viewBox="0 0 640 420" className="h-auto w-full">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.24" />
        </linearGradient>
        <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="640" height="420" rx="32" fill="url(#bg)" />
      <ellipse cx="320" cy="350" rx="240" ry="40" fill="#86efac" opacity="0.55" />
      <circle cx="520" cy="84" r="44" fill="#fde68a" opacity="0.92" />
      <rect x="260" y="220" width="120" height="110" rx="16" fill="#78350f" />
      <rect x="270" y="230" width="100" height="90" rx="12" fill="#92400e" />
      <path d="M320 220v-78" stroke="#14532d" strokeWidth="10" strokeLinecap="round" />
      <path d="M320 170c-32-8-45-34-30-55 28 2 49 17 54 43" fill="url(#leaf)" />
      <path d="M320 150c30-12 51-40 36-63-34 2-54 22-61 49" fill="url(#leaf)" />
      <circle cx="274" cy="145" r="12" fill="#34d399" />
      <circle cx="368" cy="136" r="12" fill="#2dd4bf" />
      <rect x="96" y="105" width="165" height="96" rx="14" fill="#fff" opacity="0.8" />
      <text x="114" y="142" fontSize="22" fill="#065f46" fontWeight="700">+$64 saved</text>
      <text x="114" y="172" fontSize="14" fill="#0f766e">Your garden grew!</text>
      <circle cx="502" cy="286" r="36" fill="#f59e0b" opacity="0.9" />
      <text x="484" y="293" fontSize="24" fill="#fff" fontWeight="700">XP</text>
    </svg>
  );
}
