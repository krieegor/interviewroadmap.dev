import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/config/site";
import { getTechConfig } from "@/config/tech";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isTech, techsWithContent, type Tech } from "@/lib/tech/config";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tech: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, tech: rawTech } = await params;
  if (!isLocale(rawLocale) || !isTech(rawTech)) return {};
  const dict = getDictionary(rawLocale);
  const techConfig = getTechConfig(rawTech, rawLocale);
  return {
    title: dict.sobre.title,
    description: `${dict.sobre.title} · ${techConfig.name}`,
    alternates: buildAlternates(rawLocale, `/${rawTech}/sobre`),
  };
}

export default async function SobrePage({
  params,
}: {
  params: Promise<{ locale: string; tech: string }>;
}) {
  const { locale: rawLocale, tech: rawTech } = await params;
  if (!isLocale(rawLocale) || !isTech(rawTech) || !techsWithContent.includes(rawTech)) notFound();
  const locale: Locale = rawLocale;
  const tech: Tech = rawTech;
  const dict = getDictionary(locale);
  const siteConfig = getSiteConfig(locale);
  const techConfig = getTechConfig(tech, locale);
  const { author } = siteConfig;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-[var(--color-text)]">{dict.sobre.title}</h1>

      <div className="prose-content mt-6">
        <p>
          {techConfig.name} {dict.sobre.intro1}
        </p>
        <p>{dict.sobre.intro2}</p>
        <p>{dict.sobre.intro3}</p>
      </div>

      <div className="mt-10 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-muted)]">
        <p>{dict.sobre.trademarkDisclaimer}</p>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{dict.sobre.authorTitle}</h2>
        {author.name ? (
          <div className="mt-3 flex flex-col gap-4 text-sm text-[var(--color-text-muted)] sm:flex-row sm:items-center">
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                width={80}
                height={80}
                className="h-20 w-20 shrink-0 rounded-full border border-[var(--color-border)] object-cover"
              />
            ) : null}
            <div>
              <p className="font-medium text-[var(--color-text)]">{author.name}</p>
              {author.bio ? <p className="mt-1">{author.bio}</p> : null}
              <div className="mt-2 flex flex-wrap gap-4">
                {author.linkedin ? (
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    {dict.sobre.linkedin}
                  </a>
                ) : null}
                {author.github ? (
                  <a
                    href={author.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    {dict.sobre.github}
                  </a>
                ) : null}
                {author.website ? (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-accent)] hover:underline"
                  >
                    {dict.sobre.personalSite}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">{dict.sobre.authorPlaceholder}</p>
        )}
      </div>
    </div>
  );
}
