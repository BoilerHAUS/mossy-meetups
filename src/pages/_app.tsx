import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Fraunces, Inter } from "next/font/google";
import "../styles/globals.css";

import { ThemeProvider } from "../components/ThemeProvider";
import { ErrorBoundary } from "../components/ErrorBoundary";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <div className={`${fraunces.variable} ${inter.variable}`}>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}
