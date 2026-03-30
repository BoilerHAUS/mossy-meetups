interface CalendarExportButtonProps {
  href: string;
  label?: string;
  fullWidth?: boolean;
}

export function CalendarExportButton({
  href,
  label = "Add to calendar",
  fullWidth = false,
}: CalendarExportButtonProps) {
  return (
    <>
      <a
        href={href}
        download
        className={`calendar-export-btn${fullWidth ? " calendar-export-btn--full" : ""}`}
      >
        {label}
      </a>

      <style jsx>{`
        .calendar-export-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 36px;
          padding: 0 14px;
          border-radius: 999px;
          border: 1px solid rgba(215, 185, 127, 0.24);
          background:
            linear-gradient(135deg, rgba(215, 185, 127, 0.16), rgba(185, 133, 69, 0.06)),
            rgba(9, 18, 15, 0.74);
          color: #f5e6cb;
          font-size: 0.82rem;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: transform 0.15s, border-color 0.15s, background 0.15s, color 0.15s;
        }

        .calendar-export-btn:hover {
          transform: translateY(-1px);
          border-color: rgba(215, 185, 127, 0.48);
          background:
            linear-gradient(135deg, rgba(215, 185, 127, 0.28), rgba(185, 133, 69, 0.14)),
            rgba(11, 22, 17, 0.88);
          color: #fff2d7;
        }

        .calendar-export-btn--full {
          width: 100%;
        }
      `}</style>
    </>
  );
}
