interface LogoProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Mossy Meetups logo mark — a stylised pinecone with waveform scales.
 * The outer silhouette is a teardrop/cone shape; each "scale" row doubles
 * as an audio-waveform bar so the music + nature themes are united.
 */
export function LogoMark({ size = 40, color = "currentColor", className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Pinecone body — tapered oval */}
      <ellipse cx="20" cy="21" rx="13" ry="17" fill={color} opacity="0.12" />

      {/* Waveform-scale rows — 5 rows of arcs that evoke both pine scales and sound waves */}
      {/* Row 1 (tip) */}
      <path d="M20 6 C17 9 23 9 20 6Z" fill={color} opacity="0.9" />

      {/* Row 2 */}
      <path d="M15 11 C12 15 17 16 20 14 C23 16 28 15 25 11 C23 13 17 13 15 11Z" fill={color} opacity="0.85" />

      {/* Row 3 */}
      <path d="M11 17 C8 22 14 23 20 21 C26 23 32 22 29 17 C26 20 14 20 11 17Z" fill={color} opacity="0.8" />

      {/* Row 4 */}
      <path d="M10 24 C8 29 14 31 20 29 C26 31 32 29 30 24 C27 27 13 27 10 24Z" fill={color} opacity="0.75" />

      {/* Row 5 (base) */}
      <path d="M12 31 C10 36 15 38 20 36 C25 38 30 36 28 31 C25 34 15 34 12 31Z" fill={color} opacity="0.65" />

      {/* Stem */}
      <rect x="18.5" y="38" width="3" height="7" rx="1.5" fill={color} opacity="0.6" />

      {/* Subtle waveform highlight bars on row 3 (center) */}
      <rect x="14" y="18" width="2" height="4" rx="1" fill={color} opacity="0.5" />
      <rect x="18" y="17" width="2" height="6" rx="1" fill={color} opacity="0.5" />
      <rect x="22" y="17" width="2" height="6" rx="1" fill={color} opacity="0.5" />
      <rect x="26" y="18" width="2" height="4" rx="1" fill={color} opacity="0.5" />
    </svg>
  );
}

interface LogoWordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LogoWordmark({ size = "md", className }: LogoWordmarkProps) {
  const scales = { sm: 0.7, md: 1, lg: 1.4 };
  const s = scales[size];
  const iconSize = Math.round(32 * s);
  const fontSize = `${s * 1.05}rem`;

  return (
    <span className={`wordmark ${className ?? ""}`}>
      <LogoMark size={iconSize} color="var(--accent)" />
      <span className="name">Mossy Meetups</span>
      <style jsx>{`
        .wordmark {
          display: inline-flex;
          align-items: center;
          gap: ${Math.round(8 * s)}px;
          text-decoration: none;
        }

        .name {
          font-family: var(--font-display);
          font-size: ${fontSize};
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.01em;
          line-height: 1;
        }
      `}</style>
    </span>
  );
}
