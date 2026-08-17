import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n/config";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLdScript } from "@/components/seo/JsonLdScript";

export type BreadcrumbEntry = { label: string; href: string };

export function Breadcrumbs({
  items,
  locale,
  ariaLabel,
}: {
  items: BreadcrumbEntry[];
  locale: Locale;
  ariaLabel: string;
}) {
  const siteConfig = getSiteConfig(locale);
  const jsonLd = buildBreadcrumbJsonLd(
    items.map((item) => ({ name: item.label, url: `${siteConfig.url}${item.href}` })),
  );

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <nav aria-label={ariaLabel} className="mb-6 text-xs text-[var(--color-text-muted)]">
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {isLast ? (
                  <span aria-current="page" className="font-medium text-[var(--color-text)]">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-[var(--color-accent)] hover:underline">
                    {item.label}
                  </Link>
                )}
                {!isLast ? <span aria-hidden="true">/</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
