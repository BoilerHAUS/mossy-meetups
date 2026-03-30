import Link from "next/link";
import { useEffect, useState } from "react";

interface WeatherPreview {
  condition: string;
  temperatureC: number;
}

export interface WeekEvent {
  id: string;
  title: string;
  groupName: string;
  arrivalDate: string;
  location: string | null;
}

interface WeekViewProps {
  events: WeekEvent[];
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, count: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatRangeLabel(start: Date) {
  const end = addDays(start, 6);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const fmt = (date: Date) => new Intl.DateTimeFormat("en-CA", opts).format(date);
  if (start.getFullYear() !== end.getFullYear()) {
    return `${fmt(start)}, ${start.getFullYear()} – ${fmt(end)}, ${end.getFullYear()}`;
  }
  return `${fmt(start)} – ${fmt(end)}, ${end.getFullYear()}`;
}

function formatDayNum(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric" }).format(date);
}

function formatEventTime(iso: string) {
  return new Intl.DateTimeFormat("en-CA", { timeStyle: "short" }).format(new Date(iso));
}

function weatherEmoji(condition: string) {
  switch (condition) {
    case "sunny":
      return "☀";
    case "partly-cloudy":
      return "⛅";
    case "cloudy":
    case "foggy":
      return "☁";
    case "rainy":
      return "🌧";
    case "stormy":
      return "⛈";
    case "snowy":
      return "❄";
    default:
      return "•";
  }
}

function WeatherGlyph({ location, arrivalDate }: { location: string | null; arrivalDate: string }) {
  const [weather, setWeather] = useState<WeatherPreview | null>(null);

  useEffect(() => {
    if (!location) return;

    const params = new URLSearchParams({
      location,
      date: arrivalDate.slice(0, 10),
    });

    fetch(`/api/weather?${params}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (json?.success && Array.isArray(json.data) && json.data[0]) {
          setWeather({
            condition: json.data[0].condition,
            temperatureC: json.data[0].temperatureC,
          });
        }
      })
      .catch(() => null);
  }, [location, arrivalDate]);

  if (!weather) return null;

  return (
    <span
      className="wv-weather"
      title={`${weather.condition} · ${weather.temperatureC}°C`}
      aria-label={`${weather.condition} ${weather.temperatureC} degrees Celsius`}
    >
      {weatherEmoji(weather.condition)}
      <style jsx>{`
        .wv-weather {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 999px;
          background: rgba(243, 235, 220, 0.08);
          font-size: 0.78rem;
          flex-shrink: 0;
        }
      `}</style>
    </span>
  );
}

export function WeekView({ events }: WeekViewProps) {
  const [today, setToday] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState(() => startOfDay(new Date()));
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  useEffect(() => {
    const currentDay = startOfDay(new Date());
    setToday(currentDay);
    setStartDate(currentDay);
    setActiveDayIndex(0);
  }, []);

  const days = Array.from({ length: 7 }, (_, index) => addDays(startDate, index));
  const rangeLabel = formatRangeLabel(startDate);
  const isTodayWindow = today ? sameDay(startDate, today) : false;

  function previousWindow() {
    setStartDate((current) => startOfDay(addDays(current, -7)));
    setActiveDayIndex(0);
  }

  function nextWindow() {
    setStartDate((current) => startOfDay(addDays(current, 7)));
    setActiveDayIndex(0);
  }

  function jumpToToday() {
    if (!today) return;
    setStartDate(today);
    setActiveDayIndex(0);
  }

  function eventsForDay(day: Date) {
    return events.filter((event) => sameDay(new Date(event.arrivalDate), day));
  }

  return (
    <div className="wv-root">
      <div className="wv-nav">
        <div className="wv-nav-left">
          <button type="button" className="wv-arrow" onClick={previousWindow} aria-label="Previous 7 days">
            ←
          </button>
          <span className="wv-label">{rangeLabel}</span>
          <button type="button" className="wv-arrow" onClick={nextWindow} aria-label="Next 7 days">
            →
          </button>
        </div>
        {!isTodayWindow ? (
          <button type="button" className="wv-today-btn" onClick={jumpToToday}>
            Today
          </button>
        ) : null}
      </div>

      <div className="wv-grid">
        {days.map((day) => {
          const dayEvents = eventsForDay(day);
          const isToday = today ? sameDay(day, today) : false;

          return (
            <div key={day.toISOString()} className={`wv-col ${isToday ? "wv-col--today" : ""}`}>
              <div className="wv-col-header">
                <span className="wv-day-name">{DAY_NAMES[day.getDay()]}</span>
                <span className={`wv-day-num ${isToday ? "wv-day-num--today" : ""}`}>
                  {formatDayNum(day)}
                </span>
              </div>
              <div className="wv-events">
                {dayEvents.length === 0 ? (
                  <div className="wv-empty" />
                ) : (
                  dayEvents.map((event) => (
                    <Link key={event.id} href={`/events/${event.id}`} className="wv-event">
                      <div className="wv-event-top">
                        <span className="wv-event-title">{event.title}</span>
                        <WeatherGlyph location={event.location} arrivalDate={event.arrivalDate} />
                      </div>
                      <span suppressHydrationWarning className="wv-event-meta">
                        {formatEventTime(event.arrivalDate)}
                      </span>
                      <span className="wv-event-group">{event.groupName}</span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="wv-mobile">
        <div className="wv-day-tabs">
          {days.map((day, index) => {
            const isToday = today ? sameDay(day, today) : false;
            const hasEvents = eventsForDay(day).length > 0;

            return (
              <button
                key={day.toISOString()}
                type="button"
                className={[
                  "wv-day-tab",
                  activeDayIndex === index ? "wv-day-tab--active" : "",
                  isToday ? "wv-day-tab--today" : "",
                ].join(" ")}
                onClick={() => setActiveDayIndex(index)}
              >
                <span className="wv-tab-name">{DAY_NAMES[day.getDay()]}</span>
                <span className="wv-tab-num">{day.getDate()}</span>
                {hasEvents ? <span className="wv-tab-dot" /> : null}
              </button>
            );
          })}
        </div>

        <div className="wv-mobile-day">
          <p className="wv-mobile-day-label">{formatDayNum(days[activeDayIndex])}</p>
          {eventsForDay(days[activeDayIndex]).length === 0 ? (
            <p className="wv-mobile-empty">No events this day</p>
          ) : (
            eventsForDay(days[activeDayIndex]).map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="wv-mobile-event">
                <div className="wv-event-top">
                  <span className="wv-event-title">{event.title}</span>
                  <WeatherGlyph location={event.location} arrivalDate={event.arrivalDate} />
                </div>
                <span className="wv-event-meta">
                  {formatEventTime(event.arrivalDate)} · {event.groupName}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .wv-root {
          width: 100%;
        }

        .wv-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .wv-nav-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .wv-arrow {
          font-family: inherit;
          font-size: 1rem;
          background: rgba(243, 235, 220, 0.07);
          border: 0;
          color: #c9c2b3;
          border-radius: 8px;
          padding: 4px 10px;
          cursor: pointer;
        }

        .wv-arrow:hover {
          background: rgba(243, 235, 220, 0.12);
          color: #f3ebdc;
        }

        .wv-label {
          font-size: 0.9rem;
          color: #d4d0c7;
          font-weight: 600;
        }

        .wv-today-btn {
          font-family: inherit;
          font-size: 0.82rem;
          background: transparent;
          border: 1px solid rgba(243, 235, 220, 0.2);
          color: #c9c2b3;
          border-radius: 999px;
          padding: 4px 12px;
          cursor: pointer;
        }

        .wv-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 6px;
          min-height: 200px;
        }

        .wv-col {
          border: 1px solid rgba(243, 235, 220, 0.08);
          border-radius: 14px;
          overflow: hidden;
        }

        .wv-col--today {
          border-color: rgba(215, 185, 127, 0.3);
        }

        .wv-col-header {
          padding: 8px 8px 6px;
          border-bottom: 1px solid rgba(243, 235, 220, 0.07);
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .wv-day-name {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #8a847a;
        }

        .wv-day-num {
          font-size: 0.78rem;
          color: #c9c2b3;
        }

        .wv-day-num--today {
          color: #d7b97f;
          font-weight: 700;
        }

        .wv-events {
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-height: 80px;
        }

        .wv-empty {
          height: 80px;
        }

        :global(a.wv-event),
        :global(a.wv-mobile-event) {
          display: block;
          background: rgba(215, 185, 127, 0.1);
          border: 1px solid rgba(215, 185, 127, 0.2);
          border-radius: 10px;
          padding: 8px 10px;
          text-decoration: none;
          transition: background 0.15s;
        }

        :global(a.wv-event:hover),
        :global(a.wv-mobile-event:hover) {
          background: rgba(215, 185, 127, 0.18);
        }

        .wv-event-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .wv-event-title {
          display: block;
          font-size: 0.75rem;
          color: #f4dcb0;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .wv-event-meta {
          display: block;
          font-size: 0.68rem;
          color: #8a847a;
          margin-top: 2px;
        }

        .wv-event-group {
          display: block;
          font-size: 0.65rem;
          color: #d7b97f;
          margin-top: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .wv-mobile {
          display: none;
        }

        .wv-day-tabs {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 12px;
        }

        .wv-day-tab {
          font-family: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 6px 2px;
          border-radius: 10px;
          border: 0;
          background: transparent;
          color: #c9c2b3;
          cursor: pointer;
          position: relative;
        }

        .wv-day-tab--active {
          background: rgba(215, 185, 127, 0.15);
          color: #f4dcb0;
        }

        .wv-day-tab--today .wv-tab-num {
          color: #d7b97f;
          font-weight: 700;
        }

        .wv-tab-name {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .wv-tab-num {
          font-size: 0.9rem;
        }

        .wv-tab-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #d7b97f;
          position: absolute;
          bottom: 4px;
        }

        .wv-mobile-day-label {
          font-size: 0.88rem;
          color: #d7b97f;
          margin: 0 0 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .wv-mobile-empty {
          font-size: 0.9rem;
          color: #8a847a;
          margin: 0;
        }

        :global(a.wv-mobile-event) {
          margin-bottom: 8px;
        }

        :global(a.wv-mobile-event) .wv-event-title {
          font-size: 0.95rem;
          white-space: normal;
        }

        :global(a.wv-mobile-event) .wv-event-meta {
          font-size: 0.82rem;
          margin-top: 4px;
        }

        @media (max-width: 768px) {
          .wv-grid {
            display: none;
          }

          .wv-mobile {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
