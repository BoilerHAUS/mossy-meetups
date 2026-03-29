import { type ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
  position?: "top" | "bottom";
  maxWidth?: number;
}

export function Tooltip({ text, children, position = "top", maxWidth = 220 }: TooltipProps) {
  return (
    <span className="tt-wrap">
      {children}
      <span className="tt-bubble" role="tooltip">
        {text}
      </span>

      <style jsx>{`
        .tt-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .tt-bubble {
          position: absolute;
          ${position === "top" ? "bottom: calc(100% + 8px);" : "top: calc(100% + 8px);"}
          left: 50%;
          transform: translateX(-50%);
          max-width: ${maxWidth}px;
          white-space: normal;
          text-align: center;
          background: rgba(8, 18, 14, 0.96);
          color: #f3ebdc;
          font-family: var(--font-body, system-ui, sans-serif);
          font-size: 0.74rem;
          line-height: 1.45;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid rgba(215, 185, 127, 0.25);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease;
          z-index: 200;
        }

        /* Arrow */
        .tt-bubble::after {
          content: "";
          position: absolute;
          ${position === "top" ? "top: 100%;" : "bottom: 100%;"}
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          ${position === "top"
            ? "border-top-color: rgba(8, 18, 14, 0.96);"
            : "border-bottom-color: rgba(8, 18, 14, 0.96);"}
        }

        .tt-wrap:hover .tt-bubble,
        .tt-wrap:focus-within .tt-bubble {
          opacity: 1;
        }
      `}</style>
    </span>
  );
}
