import Head from "next/head";
import Link from "next/link";

import { LogoMark } from "../components/Logo";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page not found — Mossy Meetups</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="shell">
        <div className="card">
          <div className="logo-wrap" aria-hidden="true">
            <LogoMark size={64} color="#d7b97f" />
          </div>
          <p className="code">404</p>
          <h1>Lost in the woods?</h1>
          <p className="body">
            This trail doesn&apos;t lead anywhere. The page you&apos;re looking for
            may have moved or never existed.
          </p>
          <Link href="/" className="btn">
            Head back to camp
          </Link>
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
          filter: drop-shadow(0 0 20px rgba(215, 185, 127, 0.35));
        }

        .code {
          font-family: var(--font-display, Georgia, serif);
          font-size: 5rem;
          font-weight: 700;
          line-height: 1;
          color: rgba(215, 185, 127, 0.25);
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

        .btn {
          display: inline-block;
          margin-top: 12px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #d7b97f, #b98545);
          color: #10231d;
          font-weight: 700;
          border-radius: 999px;
          text-decoration: none;
          font-size: 0.95rem;
          transition: opacity 0.15s;
        }

        .btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </>
  );
}
