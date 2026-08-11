"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col items-center justify-center px-4 text-center antialiased">
        <div className="mx-auto flex max-w-xl flex-col items-center py-24">
          <p className="text-sm font-medium text-[var(--color-accent)]">Algo deu errado · Something went wrong</p>
          <h1 className="mt-3 text-2xl font-semibold text-[var(--color-text)]">
            Não foi possível carregar esta página · This page couldn&apos;t be loaded
          </h1>
          <p className="mt-3 text-[var(--color-text-muted)]">
            Tente novamente. Se o problema continuar, volte pra home.
            <br />
            Try again. If the problem persists, go back to the homepage.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white"
            >
              Tentar de novo · Try again
            </button>
            <Link
              href="/pt/home"
              className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-accent)]"
            >
              Português
            </Link>
            <Link
              href="/en/home"
              className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-accent)]"
            >
              English
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
