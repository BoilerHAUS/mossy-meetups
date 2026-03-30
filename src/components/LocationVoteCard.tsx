import Link from "next/link";

export interface LocationVoteCardEvent {
  id: string;
  title: string;
  groupName: string | null;
  description: string | null;
  locationOptionCount: number;
}

interface LocationVoteCardProps {
  event: LocationVoteCardEvent;
}

export function LocationVoteCard({ event }: LocationVoteCardProps) {
  return (
    <div className="location-card">
      {event.groupName ? <p className="group-name">{event.groupName}</p> : null}
      <h3 className="title">{event.title}</h3>
      {event.description ? <p className="description">{event.description}</p> : null}

      <div className="footer">
        <div className="meta">
          <span className="location-badge">Needs a location</span>
          {event.locationOptionCount > 0 ? (
            <span className="hint">
              {event.locationOptionCount} location{event.locationOptionCount === 1 ? "" : "s"} to vote on
            </span>
          ) : null}
        </div>

        <Link href={`/events/${event.id}`} className="cta-link">
          Vote on location →
        </Link>
      </div>

      <style jsx>{`
        .location-card {
          border: 1px solid rgba(126, 200, 126, 0.18);
          background: rgba(13, 28, 23, 0.74);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 18px 20px;
          display: grid;
          gap: 8px;
        }

        .group-name {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #d7b97f;
          margin: 0;
        }

        .title {
          font-size: 1.05rem;
          margin: 0;
          color: #f3ebdc;
        }

        .description {
          font-size: 0.88rem;
          color: #c9c2b3;
          margin: 0;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 4px;
        }

        .meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }

        .location-badge {
          font-size: 0.72rem;
          padding: 3px 9px;
          border-radius: 999px;
          background: rgba(126, 200, 126, 0.16);
          color: #9ad99a;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .hint {
          font-size: 0.8rem;
          color: #8a847a;
        }

        :global(a.cta-link) {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          color: #10231d;
          text-decoration: none;
          font-weight: 700;
          background: linear-gradient(135deg, #d7b97f, #b98545);
          padding: 7px 14px;
          border-radius: 999px;
          flex-shrink: 0;
          transition: opacity 0.15s;
        }

        :global(a.cta-link:hover) {
          opacity: 0.88;
        }

        @media (max-width: 640px) {
          .footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
