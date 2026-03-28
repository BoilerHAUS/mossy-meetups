import { signIn } from "next-auth/react";
import Head from "next/head";
import { FormEvent, useState } from "react";

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
      </Head>
      <main className="shell">
        <div className="card">
          <p className="eyebrow">Mossy Meetups</p>
          <h1>Sign in</h1>

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
                <p className="error">Something went wrong. Please try again.</p>
              ) : null}
              <button type="submit" disabled={state === "loading"}>
                {state === "loading" ? "Sending link..." : "Send magic link"}
              </button>
            </form>
          )}
        </div>
      </main>
      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          background: radial-gradient(circle at top, rgba(245, 201, 120, 0.22), transparent 30%),
            linear-gradient(180deg, #10231d 0%, #0a1512 55%, #07100d 100%);
          color: #f3ebdc;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        :global(*) {
          box-sizing: border-box;
        }

        .shell {
          width: 100%;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card {
          width: 100%;
          max-width: 420px;
          border: 1px solid rgba(243, 235, 220, 0.12);
          background: rgba(13, 28, 23, 0.74);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          padding: 36px;
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.78rem;
          color: #d7b97f;
          margin: 0 0 12px;
        }

        h1 {
          margin: 0 0 28px;
          font-size: 2rem;
          line-height: 1.1;
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
      `}</style>
    </>
  );
}
