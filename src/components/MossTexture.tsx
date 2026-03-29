interface MossTextureProps {
  variant?: "edge" | "divider" | "footer";
  className?: string;
}

/**
 * Organic SVG moss/lichen texture for decorative use on edges, dividers, and footers.
 */
export function MossTexture({ variant = "divider", className }: MossTextureProps) {
  if (variant === "edge") {
    // Vertical squiggly moss for sidebar edge
    return (
      <svg
        viewBox="0 0 12 220"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="none"
        className={className}
      >
        <path
          d="M6,0 C9,12 3,22 6,34 C9,46 3,56 6,68 C9,80 3,90 6,102 C9,114 3,124 6,136 C9,148 3,158 6,170 C9,182 3,192 6,204 C9,216 5,220 6,220"
          fill="none"
          stroke="rgba(106,154,79,0.4)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Small frond blobs */}
        {[16, 40, 64, 88, 112, 136, 160, 184].map((y, i) => (
          <ellipse
            key={y}
            cx={i % 2 === 0 ? 9 : 3}
            cy={y}
            rx="3"
            ry="5"
            fill="rgba(106,154,79,0.25)"
            transform={`rotate(${i % 2 === 0 ? 15 : -15} ${i % 2 === 0 ? 9 : 3} ${y})`}
          />
        ))}
      </svg>
    );
  }

  if (variant === "footer") {
    // Wide horizontal moss strip for page/sidebar footer
    return (
      <svg
        viewBox="0 0 300 40"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="none"
        className={className}
      >
        {/* Ground line */}
        <path
          d="M0,30 Q30,20 60,28 Q90,36 120,24 Q150,14 180,26 Q210,36 240,22 Q270,12 300,28"
          fill="none"
          stroke="rgba(106,154,79,0.3)"
          strokeWidth="1.5"
        />
        {/* Moss clumps */}
        {[10, 45, 80, 130, 165, 200, 245, 275].map((x, i) => {
          const height = 8 + (i % 3) * 4;
          const width = 12 + (i % 4) * 5;
          return (
            <ellipse
              key={x}
              cx={x}
              cy={30 - height / 2}
              rx={width / 2}
              ry={height / 2}
              fill={`rgba(106,154,79,${0.15 + (i % 3) * 0.07})`}
            />
          );
        })}
        {/* Small fronds */}
        {[20, 55, 95, 140, 180, 215, 255].map((x, i) => (
          <ellipse
            key={x}
            cx={x}
            cy={22 - (i % 3) * 3}
            rx="3"
            ry="5"
            fill="rgba(106,154,79,0.22)"
            transform={`rotate(${-20 + i * 8} ${x} ${22 - (i % 3) * 3})`}
          />
        ))}
      </svg>
    );
  }

  // divider variant — horizontal line with moss bumps
  return (
    <svg
      viewBox="0 0 400 14"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
      className={className}
    >
      <path
        d="M0,7 Q40,3 80,7 Q120,11 160,7 Q200,3 240,7 Q280,11 320,7 Q360,3 400,7"
        fill="none"
        stroke="rgba(106,154,79,0.25)"
        strokeWidth="1.5"
      />
      {[30, 90, 150, 210, 270, 340].map((x, i) => (
        <ellipse
          key={x}
          cx={x}
          cy={5 + (i % 2) * 2}
          rx={5 + (i % 3)}
          ry="3"
          fill={`rgba(106,154,79,${0.15 + (i % 2) * 0.1})`}
        />
      ))}
    </svg>
  );
}
