import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import type { ReactNode } from "react";

import { GroupSidebar, type SidebarGroup } from "./GroupSidebar";
import { LogoWordmark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { MossTexture } from "./MossTexture";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  groups?: SidebarGroup[];
}

export function AppShell({ children, title, groups }: AppShellProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pageTitle = title ? `${title} — Mossy Meetups` : "Mossy Meetups";

  function handleSignOut() {
    signOut({ callbackUrl: "/login" });
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="shell">
        {/* Top nav */}
        <nav className="nav" role="navigation" aria-label="Main navigation">
          <Link href="/" className="nav-brand" aria-label="Mossy Meetups home">
            <LogoWordmark size="sm" />
          </Link>

          <div className="nav-right">
            <Link href="/camp-guide" className="nav-link" title="Field Manual">
              📖
            </Link>
            <Link href="/faq" className="nav-link" title="FAQ & How-To">
              ❓
            </Link>
            {session?.user?.name ? (
              <Link href="/profile" className="nav-user">
                {session.user.name}
              </Link>
            ) : null}
            <ThemeToggle />
            <button
              type="button"
              onClick={handleSignOut}
              className="nav-signout"
            >
              Sign out
            </button>
          </div>
        </nav>

        {/* Body: sidebar + content */}
        <div className="body">
          {groups !== undefined ? (
            <div className="sidebar-wrap">
              <GroupSidebar groups={groups} />
            </div>
          ) : null}

          <main className="main" id="main-content">{children}</main>
        </div>

        {/* Page footer moss strip */}
        <footer className="page-footer" aria-hidden="true">
          <MossTexture variant="footer" />
        </footer>
      </div>

      <style jsx>{`
        .shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* ── Top nav ── */
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 58px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-nav);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 50;
          flex-shrink: 0;
          box-shadow: var(--shadow-nav);
        }

        .nav-brand {
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-link {
          font-size: 1rem;
          text-decoration: none;
          opacity: 0.65;
          transition: opacity 0.15s;
          line-height: 1;
          display: flex;
          align-items: center;
        }

        .nav-link:hover {
          opacity: 1;
        }

        .nav-user {
          font-size: 0.88rem;
          color: var(--text-muted);
          text-decoration: none;
        }

        .nav-user:hover {
          color: var(--text);
        }

        .nav-signout {
          font-family: inherit;
          font-size: 0.88rem;
          background: transparent;
          border: 1px solid var(--border-strong);
          color: var(--text-muted);
          padding: 5px 12px;
          border-radius: var(--radius-pill);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }

        .nav-signout:hover {
          border-color: var(--accent);
          color: var(--text);
        }

        /* ── Body layout ── */
        .body {
          display: flex;
          flex: 1;
          min-height: 0;
        }

        .sidebar-wrap {
          display: flex;
        }

        .main {
          flex: 1;
          min-width: 0;
          padding: 32px 28px 64px;
        }

        /* ── Page footer moss ── */
        .page-footer {
          height: 48px;
          overflow: hidden;
          opacity: 0.55;
          flex-shrink: 0;
          padding: 0 8px;
        }

        @media (max-width: 768px) {
          .sidebar-wrap {
            display: none;
          }

          .main {
            padding: 24px 16px 48px;
          }
        }
      `}</style>
    </>
  );
}
