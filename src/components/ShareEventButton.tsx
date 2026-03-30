import { useEffect, useState } from "react";

import { getEventShareUrl } from "../lib/event-view";

interface ShareEventButtonProps {
  eventId: string;
  eventTitle: string;
  fullWidth?: boolean;
}

type ShareFeedback = "idle" | "copied" | "shared" | "error";

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "absolute";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(input);

  if (!copied) {
    throw new Error("Copy failed");
  }
}

export function ShareEventButton({
  eventId,
  eventTitle,
  fullWidth = false,
}: ShareEventButtonProps) {
  const [feedback, setFeedback] = useState<ShareFeedback>("idle");

  useEffect(() => {
    if (feedback === "idle") return;

    const timeoutId = window.setTimeout(() => {
      setFeedback("idle");
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  async function handleShare() {
    const url = getEventShareUrl(window.location.origin, eventId);

    if (navigator.share) {
      try {
        await navigator.share({
          title: eventTitle,
          text: `Join me at ${eventTitle}`,
          url,
        });
        setFeedback("shared");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await copyText(url);
      setFeedback("copied");
    } catch (_error) {
      setFeedback("error");
      window.prompt("Copy this event link:", url);
    }
  }

  const label =
    feedback === "copied"
      ? "Link copied"
      : feedback === "shared"
      ? "Shared"
      : feedback === "error"
      ? "Copy link"
      : "Share";

  return (
    <>
      <button
        type="button"
        className={`share-btn${fullWidth ? " share-btn--full" : ""}`}
        onClick={() => {
          void handleShare();
        }}
        aria-label={`Share ${eventTitle}`}
      >
        {label}
      </button>

      <style jsx>{`
        .share-btn {
          min-height: 36px;
          padding: 0 14px;
          border-radius: 999px;
          border: 1px solid rgba(215, 185, 127, 0.24);
          background: rgba(255, 255, 255, 0.04);
          color: #f5e6cb;
          font-size: 0.82rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: transform 0.15s, border-color 0.15s, background 0.15s, color 0.15s;
        }

        .share-btn:hover {
          transform: translateY(-1px);
          border-color: rgba(215, 185, 127, 0.46);
          background:
            linear-gradient(135deg, rgba(215, 185, 127, 0.16), rgba(185, 133, 69, 0.06)),
            rgba(9, 18, 15, 0.74);
          color: #fff2d7;
        }

        .share-btn--full {
          width: 100%;
          justify-content: center;
        }
      `}</style>
    </>
  );
}
