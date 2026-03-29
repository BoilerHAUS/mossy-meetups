import Head from "next/head";
import Link from "next/link";

import { LogoMark } from "../components/Logo";

export default function ServerError() {
  return (
    <>
      <Head>
        <title>Server error — Mossy Meetups</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="shell">
        <div className="card">
          <div className="logo-wrap" aria-hidden="true">
            <LogoMark size={64} color="#f0a090" />
          </div>
          <p className="code">500</p>
          <h1>Campfire went out</h1>
          <p className="body">
            Something went wrong on our end. The issue has been noted — try again
            in a moment or head back to the dashboard.
          </p>
          <div className="actions">
            <button type="button" onClick={() => window.location.reload()}>
              Try again
            </button>
            <Link href="/" className="btn-ghost">
              Go home
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        .shell {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .card {
          width: 100%;
          max-width: 460px;
          text-align: center;
          border: 1px solid rgba(243, 235, 220, 0.12);
          background: rgba(13, 28, 23, 0.74);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 32px;
          padding: 48px 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .logo-wrap {
          margin-bottom: 8px;
          filter: drop-shadow(0 0 20px rgba(240, 160, 144, 0.3));
        }

        .code {
          font-family: var(--font-display, Georgia, serif);
          font-size: 5rem;
          font-weight: 700;
          line-height: 1;
          color: rgba(240, 160, 144, 0.2);
          margin: 0;
          letter-spacing: -0.04em;
        }

        h1 {
          font-family: var(--font-display, Georgia, serif);
          font-size: 1.8rem;
          margin: 0;
          color: #f3ebdc;
          line-height: 1.15;
        }

        .body {
          color: #a09a8e;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
          max-width: 320px;
        }

        .actions {
          display: flex;
          gap: 12px;
          margin-top: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        button {
          font: inherit;
          border: 0;
          border-radius: 999px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #d7b97f, #b98545);
          color: #10231d;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.95rem;
          transition: opacity 0.15s;
        }

        button:hover {
          opacity: 0.9;
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          padding: 14px 28px;
          border: 1px solid rgba(243, 235, 220, 0.2);
          border-radius: 999px;
          color: #c9c2b3;
          text-decoration: none;
          font-size: 0.95rem;
          transition: border-color 0.15s, color 0.15s;
        }

        .btn-ghost:hover {
          border-color: rgba(243, 235, 220, 0.4);
          color: #f3ebdc;
        }
      `}</style>
    </>
  );
}
