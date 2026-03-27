/** Abstrakte Formen unten rechts (Pastell-Referenz) */
export function ServiceCardDecoration({ theme }: { theme: 0 | 1 | 2 | 3 }) {
  const stroke = "currentColor"
  return (
    <svg
      className="pointer-events-none absolute -bottom-6 -right-6 size-44 text-current opacity-[0.22] md:size-52"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {theme === 0 && (
        <>
          <circle cx="150" cy="140" r="48" stroke={stroke} strokeWidth="2" />
          <circle cx="120" cy="100" r="28" fill={stroke} opacity="0.35" />
          <rect
            x="40"
            y="60"
            width="56"
            height="56"
            rx="14"
            stroke={stroke}
            strokeWidth="2"
            opacity="0.6"
          />
        </>
      )}
      {theme === 1 && (
        <>
          <path
            d="M120 40 L180 100 L120 160 L60 100 Z"
            stroke={stroke}
            strokeWidth="2"
            opacity="0.5"
          />
          <circle cx="100" cy="130" r="42" stroke={stroke} strokeWidth="2" />
          <rect x="30" y="90" width="40" height="40" rx="10" fill={stroke} opacity="0.25" />
        </>
      )}
      {theme === 2 && (
        <>
          <ellipse cx="130" cy="120" rx="52" ry="36" stroke={stroke} strokeWidth="2" />
          <circle cx="90" cy="80" r="24" fill={stroke} opacity="0.3" />
          <path
            d="M50 150 Q90 110 130 150"
            stroke={stroke}
            strokeWidth="2"
            fill="none"
            opacity="0.45"
          />
        </>
      )}
      {theme === 3 && (
        <>
          <rect x="70" y="50" width="88" height="88" rx="22" stroke={stroke} strokeWidth="2" />
          <circle cx="110" cy="130" r="36" stroke={stroke} strokeWidth="2" opacity="0.55" />
          <rect x="35" y="115" width="48" height="48" rx="12" fill={stroke} opacity="0.2" />
        </>
      )}
    </svg>
  )
}
