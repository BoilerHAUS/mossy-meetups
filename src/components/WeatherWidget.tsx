import { useEffect, useState } from "react";
import type { WeatherData } from "../pages/api/weather";

interface WeatherWidgetProps {
  location: string;
  arrivalDate: string; // ISO string
}

function isoToYMD(iso: string): string {
  return iso.slice(0, 10);
}

// ── Animated SVG icons ──────────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="wx-icon wx-sun" aria-hidden="true">
      <circle cx="20" cy="20" r="8" fill="#f0c864" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="20" y1="5" x2="20" y2="10"
          stroke="#f0c864" strokeWidth="2.5" strokeLinecap="round"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
      <style jsx>{`
        .wx-sun { animation: wx-spin 12s linear infinite; }
        @keyframes wx-spin { to { transform: rotate(360deg); } }
      `}</style>
    </svg>
  );
}

function PartlyCloudyIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="wx-icon" aria-hidden="true">
      {/* Sun behind */}
      <circle cx="14" cy="17" r="6" fill="#f0c864" className="wx-sun-part" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line
          key={deg}
          x1="14" y1="7" x2="14" y2="10"
          stroke="#f0c864" strokeWidth="2" strokeLinecap="round"
          transform={`rotate(${deg} 14 17)`}
          className="wx-sun-part"
        />
      ))}
      {/* Cloud */}
      <ellipse cx="24" cy="24" rx="10" ry="7" fill="rgba(200,200,210,0.85)" />
      <ellipse cx="18" cy="26" rx="7" ry="5" fill="rgba(200,200,210,0.85)" />
      <ellipse cx="28" cy="25" rx="6" ry="5" fill="rgba(200,200,210,0.85)" />
      <style jsx>{`
        .wx-sun-part { animation: wx-pulse 3s ease-in-out infinite; }
        @keyframes wx-pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
      `}</style>
    </svg>
  );
}

function CloudyIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="wx-icon" aria-hidden="true">
      <ellipse cx="20" cy="22" rx="13" ry="9" fill="rgba(180,180,195,0.9)" />
      <ellipse cx="13" cy="25" rx="8" ry="6" fill="rgba(180,180,195,0.9)" />
      <ellipse cx="28" cy="25" rx="7" ry="6" fill="rgba(180,180,195,0.9)" />
      <ellipse cx="20" cy="18" rx="8" ry="7" fill="rgba(180,180,195,0.9)" />
      <style jsx>{`
        .wx-icon { animation: wx-float 4s ease-in-out infinite; }
        @keyframes wx-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
      `}</style>
    </svg>
  );
}

function RainyIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="wx-icon" aria-hidden="true">
      <ellipse cx="20" cy="16" rx="12" ry="8" fill="rgba(150,160,185,0.9)" />
      <ellipse cx="13" cy="19" rx="7" ry="5" fill="rgba(150,160,185,0.9)" />
      <ellipse cx="28" cy="19" rx="6" ry="5" fill="rgba(150,160,185,0.9)" />
      {/* Rain drops */}
      <line x1="14" y1="27" x2="12" y2="33" stroke="#7ab8d4" strokeWidth="2" strokeLinecap="round" className="drop d1" />
      <line x1="20" y1="27" x2="18" y2="33" stroke="#7ab8d4" strokeWidth="2" strokeLinecap="round" className="drop d2" />
      <line x1="26" y1="27" x2="24" y2="33" stroke="#7ab8d4" strokeWidth="2" strokeLinecap="round" className="drop d3" />
      <style jsx>{`
        .drop { animation: wx-rain 1s linear infinite; }
        .d1 { animation-delay: 0s; }
        .d2 { animation-delay: 0.33s; }
        .d3 { animation-delay: 0.66s; }
        @keyframes wx-rain { 0%{opacity:0;transform:translateY(-4px)} 40%{opacity:1} 100%{opacity:0;transform:translateY(4px)} }
      `}</style>
    </svg>
  );
}

function StormyIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="wx-icon" aria-hidden="true">
      <ellipse cx="20" cy="14" rx="13" ry="8" fill="rgba(100,100,120,0.9)" />
      <ellipse cx="13" cy="17" rx="8" ry="6" fill="rgba(100,100,120,0.9)" />
      <ellipse cx="28" cy="17" rx="7" ry="6" fill="rgba(100,100,120,0.9)" />
      {/* Lightning bolt */}
      <polyline points="22,22 17,30 21,30 18,38" fill="none" stroke="#f0c864" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" className="bolt" />
      <style jsx>{`
        .bolt { animation: wx-flash 2s ease-in-out infinite; }
        @keyframes wx-flash { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </svg>
  );
}

function SnowyIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="wx-icon" aria-hidden="true">
      <ellipse cx="20" cy="15" rx="12" ry="7" fill="rgba(200,210,230,0.9)" />
      <ellipse cx="13" cy="18" rx="7" ry="5" fill="rgba(200,210,230,0.9)" />
      <ellipse cx="28" cy="18" rx="6" ry="5" fill="rgba(200,210,230,0.9)" />
      {/* Snowflakes */}
      {[14, 20, 26].map((x, i) => (
        <text key={x} x={x} y="34" fontSize="7" fill="#b8d0f0" textAnchor="middle" className={`flake f${i}`}>❄</text>
      ))}
      <style jsx>{`
        .flake { animation: wx-snow 1.8s ease-in-out infinite; }
        .f0 { animation-delay: 0s; }
        .f1 { animation-delay: 0.6s; }
        .f2 { animation-delay: 1.2s; }
        @keyframes wx-snow { 0%{opacity:0;transform:translateY(-3px)} 50%{opacity:1} 100%{opacity:0;transform:translateY(5px)} }
      `}</style>
    </svg>
  );
}

function FoggyIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="wx-icon" aria-hidden="true">
      {[12, 20, 28].map((y, i) => (
        <line key={y} x1="6" y1={y} x2="34" y2={y} stroke="rgba(180,180,190,0.7)" strokeWidth="3" strokeLinecap="round" className={`fog-line fl${i}`} />
      ))}
      <style jsx>{`
        .fog-line { animation: wx-fog 2.5s ease-in-out infinite; }
        .fl0 { animation-delay: 0s; }
        .fl1 { animation-delay: 0.5s; }
        .fl2 { animation-delay: 1s; }
        @keyframes wx-fog { 0%,100%{opacity:0.5;transform:translateX(0)} 50%{opacity:1;transform:translateX(3px)} }
      `}</style>
    </svg>
  );
}

function WeatherIcon({ condition }: { condition: WeatherData["condition"] }) {
  switch (condition) {
    case "sunny": return <SunIcon />;
    case "partly-cloudy": return <PartlyCloudyIcon />;
    case "cloudy": return <CloudyIcon />;
    case "rainy": return <RainyIcon />;
    case "stormy": return <StormyIcon />;
    case "snowy": return <SnowyIcon />;
    case "foggy": return <FoggyIcon />;
    default: return null;
  }
}

export function WeatherWidget({ location, arrivalDate }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location || !arrivalDate) {
      setLoading(false);
      return;
    }

    const date = isoToYMD(arrivalDate);
    const params = new URLSearchParams({ location, date });

    fetch(`/api/weather?${params}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json?.success && json.data) setWeather(json.data);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [location, arrivalDate]);

  if (loading) {
    return (
      <div className="wx-root wx-loading" aria-label="Loading weather">
        <div className="wx-skeleton" />
        <style jsx>{`
          .wx-root { display: flex; align-items: center; gap: 6px; }
          .wx-skeleton { width: 60px; height: 20px; border-radius: 6px; background: rgba(243,235,220,0.07); animation: wx-shimmer 1.5s ease-in-out infinite; }
          @keyframes wx-shimmer { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        `}</style>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="wx-root" title={`${weather.description} · ${weather.temperatureF}°F / ${weather.temperatureC}°C`}>
      <div className="wx-icon-wrap">
        <WeatherIcon condition={weather.condition} />
      </div>
      <div className="wx-text">
        <span className="wx-temp">{weather.temperatureF}°F</span>
        <span className="wx-desc">{weather.description}</span>
      </div>

      <style jsx>{`
        .wx-root {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .wx-icon-wrap {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }

        :global(.wx-icon) {
          width: 100%;
          height: 100%;
          display: block;
        }

        .wx-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .wx-temp {
          font-size: 0.82rem;
          font-weight: 700;
          color: #f4dcb0;
          line-height: 1;
        }

        .wx-desc {
          font-size: 0.7rem;
          color: #8a847a;
          line-height: 1;
        }
      `}</style>
    </div>
  );
}
