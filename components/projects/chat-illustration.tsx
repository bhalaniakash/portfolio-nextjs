// Drawn for the portfolio from the app's real features (two-person thread,
// text and file messages). It is labelled as an illustration wherever shown.
export function ChatIllustration({ title }: { title: string }) {
  return (
    <svg viewBox="0 0 800 450" role="img" aria-label={title} className="size-full">
      <defs>
        <linearGradient id="chat-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#17172a" />
          <stop offset="1" stopColor="#0f0f1a" />
        </linearGradient>
        <linearGradient id="chat-out" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8b78ff" />
          <stop offset="1" stopColor="#6d7cff" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#chat-bg)" />
      <g stroke="rgb(255 255 255 / 0.05)">
        {Array.from({ length: 19 }, (_, i) => (
          <line key={`v${i}`} x1={i * 44} y1="0" x2={i * 44} y2="450" />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 44} x2="800" y2={i * 44} />
        ))}
      </g>

      <g transform="translate(150 40)">
        <rect width="500" height="370" rx="18" fill="#12121c" stroke="rgb(255 255 255 / 0.12)" />
        <rect width="500" height="58" rx="18" fill="#191926" />
        <rect y="40" width="500" height="18" fill="#191926" />
        <circle cx="34" cy="29" r="13" fill="#2a2a40" />
        <rect x="58" y="20" width="110" height="9" rx="4.5" fill="#ecebf3" opacity="0.85" />
        <circle cx="62" cy="40" r="3.5" fill="#6ee7b7" />
        <rect x="70" y="36" width="52" height="7" rx="3.5" fill="#a3a2b8" opacity="0.6" />

        <rect x="24" y="84" width="230" height="44" rx="14" fill="#232334" />
        <rect x="42" y="98" width="170" height="8" rx="4" fill="#ecebf3" opacity="0.7" />
        <rect x="42" y="112" width="110" height="8" rx="4" fill="#ecebf3" opacity="0.45" />

        <rect x="236" y="146" width="240" height="44" rx="14" fill="url(#chat-out)" />
        <rect x="254" y="160" width="180" height="8" rx="4" fill="#ffffff" opacity="0.9" />
        <rect x="254" y="174" width="120" height="8" rx="4" fill="#ffffff" opacity="0.65" />

        <g transform="translate(24 208)">
          <rect width="250" height="60" rx="14" fill="#232334" />
          <rect x="14" y="12" width="36" height="36" rx="8" fill="#2f2f48" />
          <path d="M26 20h9l6 6v14a2 2 0 0 1-2 2H26a2 2 0 0 1-2-2V22a2 2 0 0 1 2-2Z" fill="none" stroke="#a594ff" strokeWidth="2" />
          <rect x="62" y="18" width="120" height="8" rx="4" fill="#ecebf3" opacity="0.75" />
          <rect x="62" y="33" width="64" height="7" rx="3.5" fill="#a3a2b8" opacity="0.55" />
        </g>

        <rect x="300" y="286" width="176" height="36" rx="12" fill="url(#chat-out)" opacity="0.92" />
        <rect x="318" y="300" width="120" height="8" rx="4" fill="#ffffff" opacity="0.85" />

        <rect x="16" y="334" width="468" height="0.75" fill="rgb(255 255 255 / 0.08)" />
        <rect x="24" y="342" width="380" height="18" rx="9" fill="#1c1c29" />
        <circle cx="462" cy="351" r="12" fill="#a594ff" />
        <path d="M457 351h10m-4-4 4 4-4 4" stroke="#0a0a0f" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
