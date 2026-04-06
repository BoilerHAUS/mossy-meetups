import Link from "next/link";
import { useEffect, useState } from "react";

export interface MonthEvent {
  id: string;
  title: string;
  groupName: string;
  arrivalDate: string;
}

interface MonthViewProps {
  events: MonthEvent[];
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function addDays(date: Date, count: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function startOfCalendarGrid(monthStart: Date) {
  const day = monthStart.getDay();
  return addDays(monthStart, -day);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { month: "long", year: "numeric" }).format(date);
}

export function MonthView({ events }: MonthViewProps) {
  const [today, setToday] = useState<Date | null>(null);
  const [monthStart, setMonthStart] = useState(() => startOfMonth(new Date()));

  useEffect(() => {
    const current = new Date();
    current.setHours(0, 0, 0, 0);
    setToday(current);
    setMonthStart(startOfMonth(current));
  }, []);

  const gridStart = startOfCalendarGrid(monthStart);
  const days = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));

  function eventsForDay(day: Date) {
    return events.filter((event) => sameDay(new Date(event.arrivalDate), day));
  }

  return (
    <div className="mv-root">
      <div className="mv-nav">
        <button type="button" className="mv-arrow" onClick={() => setMonthStart((current) => addMonths(current, -1))}>
          ←
        </button>
        <span className="mv-label">{formatMonthLabel(monthStart)}</span>
        <button type="button" className="mv-arrow" onClick={() => setMonthStart((current) => addMonths(current, 1))}>
          →
        </button>
      </div>

      <div className="mv-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mv-grid">
        {days.map((day) => {
          const dayEvents = eventsForDay(day);
          const inMonth = day.getMonth() === monthStart.getMonth();
          const isToday = today ? sameDay(day, today) : false;

          return (
            <div
              key={day.toISOString()}
              className={[
                "mv-day",
                inMonth ? "" : "mv-day--muted",
                isToday ? "mv-day--today" : "",
              ].join(" ")}
            >
              <span className="mv-day-num">{day.getDate()}</span>
              <div className="mv-events">
                {dayEvents.slice(0, 3).map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`} className="mv-event">
                    <span className="mv-event-title">{event.title}</span>
                  </Link>
                ))}
                {dayEvents.length > 3 ? <span className="mv-more">+{dayEvents.length - 3} more</span> : null}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .mv-root {
          width: 100%;
        }

        .mv-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .mv-arrow {
          font-family: inherit;
          font-size: 1rem;
          background: var(--bg-input);
          border: 0;
          color: var(--text-muted);
          border-radius: 8px;
          padding: 4px 10px;
          cursor: pointer;
        }

        .mv-label {
          font-size: 0.95rem;
          color: var(--text);
          font-weight: 600;
        }

        .mv-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.68rem;
          color: var(--text-dim);
        }

        .mv-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 6px;
        }

        .mv-day {
          min-height: 116px;
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 8px;
          background: transparent;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .mv-day--muted {
          opacity: 0.45;
        }

        .mv-day--today {
          border-color: var(--border-focus);
          box-shadow: inset 0 0 0 1px var(--border-focus);
        }

        .mv-day-num {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text);
        }

        .mv-events {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-height: 0;
        }

        :global(a.mv-event) {
          display: block;
          text-decoration: none;
          border-radius: 8px;
          padding: 5px 7px;
          background: var(--border);
          border: 1px solid var(--border-strong);
        }

        .mv-event-title {
          display: block;
          font-size: 0.72rem;
          color: var(--text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mv-more {
          font-size: 0.7rem;
          color: var(--text-dim);
        }

        @media (max-width: 768px) {
          .mv-weekdays {
            font-size: 0.62rem;
          }

          .mv-day {
            min-height: 92px;
            padding: 6px;
          }

          .mv-event-title {
            font-size: 0.66rem;
          }
        }
      `}</style>
    </div>
  );
}
