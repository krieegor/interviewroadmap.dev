import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col items-center justify-center px-4 text-center antialiased">
        <div className="mx-auto flex max-w-xl flex-col items-center py-24">
          <p className="text-sm font-medium text-[var(--color-accent)]">Erro 404 · Error 404</p>
          <h1 className="mt-3 text-2xl font-semibold text-[var(--color-text)]">
            Página não encontrada · Page not found
          </h1>
          <p className="mt-3 text-[var(--color-text-muted)]">
            O conteúdo que você procura pode ter sido movido ou não existe.
            <br />
            The content you&apos;re looking for may have moved or doesn&apos;t exist.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/pt"
              className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white"
            >
              Português
            </Link>
            <Link
              href="/en"
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
