import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChaptersByPart } from "@/lib/content/chapters";
import { getSiteConfig } from "@/config/site";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { formatTemplate } from "@/lib/i18n/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const dict = getDictionary(rawLocale);
  const siteConfig = getSiteConfig(rawLocale);
  return {
    title: dict.livroIndex.title,
    description: formatTemplate(dict.livroIndex.description, { siteName: siteConfig.name }),
  };
}

export default async function LivroPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const parts = await getChaptersByPart(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--color-text)]">{dict.livroIndex.title}</h1>
          <p className="mt-3 max-w-2xl text-[var(--color-text-muted)]">{dict.livroIndex.intro}</p>
        </div>
        {locale === "pt" ? (
          <a
            href="/livro.pdf"
            download="apache-kafka-entrevistas-java-senior.pdf"
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            {dict.livroIndex.downloadPdf}
          </a>
        ) : null}
      </div>

      {parts.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--color-text-muted)]">{dict.livroIndex.empty}</p>
      ) : (
        <div className="mt-10 flex flex-col gap-10">
          {parts.map((part) => (
            <section key={part.part}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                {part.part}
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {part.chapters.map((chapter) => (
                  <li key={chapter.slug}>
                    <Link
                      href={`/${locale}/livro/${chapter.slug}`}
                      className="block rounded-md border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-accent)]"
                    >
                      <span className="font-medium text-[var(--color-text)]">{chapter.title}</span>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {chapter.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
