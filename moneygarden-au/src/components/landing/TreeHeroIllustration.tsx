export function TreeHeroIllustration() {
  return (
    <svg viewBox="0 0 640 420" className="h-auto w-full">
      <defs>
        <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="hero-trunk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5a2b" />
          <stop offset="100%" stopColor="#5b3716" />
        </linearGradient>
        <linearGradient id="hero-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="640" height="420" rx="32" fill="url(#hero-bg)" />
      <ellipse cx="320" cy="352" rx="236" ry="42" fill="#86efac" opacity="0.35" />
      <circle cx="528" cy="88" r="42" fill="#fde68a" opacity="0.9" />
      <path d="M318 334 C300 286 302 222 316 154" stroke="url(#hero-trunk)" strokeWidth="26" strokeLinecap="round" fill="none" />
      <path d="M314 214 C248 188 206 140 176 92" stroke="#6b3f1f" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M320 188 C362 150 412 126 470 112" stroke="#6b3f1f" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M322 254 C380 238 430 210 478 178" stroke="#6b3f1f" strokeWidth="12" strokeLinecap="round" fill="none" />
      <circle cx="208" cy="104" r="34" fill="url(#hero-leaf)" opacity="0.88" />
      <circle cx="258" cy="90" r="40" fill="url(#hero-leaf)" opacity="0.9" />
      <circle cx="326" cy="98" r="46" fill="url(#hero-leaf)" opacity="0.9" />
      <circle cx="394" cy="116" r="40" fill="url(#hero-leaf)" opacity="0.88" />
      <circle cx="446" cy="156" r="34" fill="url(#hero-leaf)" opacity="0.84" />
      <circle cx="398" cy="202" r="26" fill="#10b981" opacity="0.88" />
      <circle cx="250" cy="172" r="22" fill="#10b981" opacity="0.86" />
      <rect x="88" y="88" width="190" height="102" rx="18" fill="#ffffff" opacity="0.82" />
      <text x="108" y="126" fontSize="24" fill="#065f46" fontWeight="700">4 / 5 branches grown</text>
      <text x="108" y="157" fontSize="16" fill="#0f766e">Complete modules to build your canopy</text>
      <rect x="390" y="270" width="144" height="78" rx="18" fill="#082f49" opacity="0.82" />
      <text x="416" y="307" fontSize="18" fill="#e0f2fe" fontWeight="700">+1 leaf reward</text>
      <text x="418" y="330" fontSize="14" fill="#7dd3fc">Savings goal completed</text>
    </svg>
  );
}
