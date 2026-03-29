import { Component, type ReactNode } from "react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { hasError: true, message };
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="error-boundary">
          <div className="icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2>Something went wrong</h2>
          <p className="msg">{this.state.message}</p>
          <div className="actions">
            <button type="button" onClick={() => this.setState({ hasError: false, message: "" })}>
              Try again
            </button>
            <Link href="/">Go home</Link>
          </div>
          <style jsx>{`
            .error-boundary {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 16px;
              padding: 48px 24px;
              text-align: center;
              color: var(--text);
            }

            .icon {
              color: var(--accent);
              opacity: 0.7;
            }

            h2 {
              margin: 0;
              font-family: var(--font-display);
              font-size: 1.4rem;
            }

            .msg {
              margin: 0;
              color: var(--text-muted);
              font-size: 0.9rem;
              max-width: 380px;
            }

            .actions {
              display: flex;
              gap: 12px;
              margin-top: 8px;
            }

            button {
              font: inherit;
              border: 0;
              border-radius: var(--radius-pill);
              padding: 10px 20px;
              background: linear-gradient(135deg, var(--accent), #b98545);
              color: var(--accent-text);
              font-weight: 700;
              cursor: pointer;
            }

            .actions :global(a) {
              display: inline-flex;
              align-items: center;
              padding: 10px 20px;
              border: 1px solid var(--border-strong);
              border-radius: var(--radius-pill);
              color: var(--text-muted);
              text-decoration: none;
              font-size: 0.95rem;
            }

            .actions :global(a:hover) {
              color: var(--text);
              border-color: var(--accent);
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}
