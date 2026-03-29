import { signIn } from "next-auth/react";
import Head from "next/head";
import { FormEvent, useState } from "react";

import { LogoMark } from "../components/Logo";

type FormState = "idle" | "loading" | "sent" | "error";

export default function Login() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");

    const result = await signIn("email", {
      email: email.trim().toLowerCase(),
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.error) {
      setState("error");
    } else {
      setState("sent");
    }
  }

  return (
    <>
      <Head>
        <title>Sign in — Mossy Meetups</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="shell">
        <div className="hero">
          {/* Left: sign-in form */}
          <div className="form-col">
            <p className="eyebrow">Mossy Meetups</p>
            <h1>Sign in</h1>
            <p className="tagline">Plan together. Camp together. Mossy vibes.</p>

            {state === "sent" ? (
              <div className="sent">
                <p>Check your email — a magic link is on its way to <strong>{email}</strong>.</p>
                <p className="hint">Click the link in the email to sign in. You can close this tab.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
                {state === "error" ? (
                  <p className="error" role="alert">Something went wrong. Please try again.</p>
                ) : null}
                <button type="submit" disabled={state === "loading"}>
                  {state === "loading" ? "Sending link..." : "Send magic link"}
                </button>
              </form>
            )}
          </div>

          {/* Right: logo hero */}
          <div className="logo-col" aria-hidden="true">
            <div className="logo-glow">
              <LogoMark size={160} color="#d7b97f" />
            </div>
            <p className="logo-text">Mossy<br />Meetups</p>
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

        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          width: 100%;
          max-width: 820px;
          border: 1px solid rgba(243, 235, 220, 0.12);
          background: rgba(13, 28, 23, 0.74);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 32px;
          overflow: hidden;
        }

        /* ── Left: form ── */
        .form-col {
          padding: 48px 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.78rem;
          color: #d7b97f;
          margin: 0 0 12px;
        }

        h1 {
          font-family: var(--font-display, Georgia, serif);
          margin: 0 0 8px;
          font-size: 2.6rem;
          line-height: 1.05;
          color: #f3ebdc;
        }

        .tagline {
          color: #8a847a;
          font-size: 0.9rem;
          margin: 0 0 32px;
          font-style: italic;
        }

        form {
          display: grid;
          gap: 14px;
        }

        label {
          display: grid;
          gap: 8px;
          font-size: 0.95rem;
          color: #e6dfd0;
        }

        input {
          font: inherit;
          width: 100%;
          border: 1px solid rgba(243, 235, 220, 0.14);
          border-radius: 16px;
          background: rgba(5, 11, 9, 0.5);
          color: #f3ebdc;
          padding: 12px 14px;
        }

        input:focus {
          outline: 2px solid rgba(215, 185, 127, 0.5);
          outline-offset: 2px;
        }

        button {
          font: inherit;
          border: 0;
          border-radius: 999px;
          padding: 14px 18px;
          background: linear-gradient(135deg, #d7b97f, #b98545);
          color: #10231d;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.15s;
        }

        button:hover:not(:disabled) {
          opacity: 0.9;
        }

        button:disabled {
          cursor: wait;
          opacity: 0.7;
        }

        .sent {
          color: #d4d0c7;
          line-height: 1.6;
        }

        .sent strong {
          color: #f3ebdc;
        }

        .hint {
          font-size: 0.9rem;
          color: #a09a8e;
          margin-top: 8px;
        }

        .error {
          color: #f0a090;
          font-size: 0.9rem;
          margin: 0;
        }

        /* ── Right: logo hero ── */
        .logo-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
          background: linear-gradient(145deg, rgba(106, 154, 79, 0.18), rgba(46, 125, 50, 0.08));
          border-left: 1px solid rgba(243, 235, 220, 0.08);
          padding: 48px 32px;
        }

        .logo-glow {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 32px rgba(215, 185, 127, 0.45));
        }

        .logo-text {
          font-family: var(--font-display, Georgia, serif);
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.1;
          text-align: center;
          color: rgba(243, 235, 220, 0.55);
          margin: 0;
          letter-spacing: -0.02em;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .hero {
            grid-template-columns: 1fr;
            max-width: 440px;
          }

          .logo-col {
            display: none;
          }

          .form-col {
            padding: 36px 28px;
          }
        }
      `}</style>
    </>
  );
}
