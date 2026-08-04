import type { MetadataRoute } from "next";
import { getAllChapters } from "@/lib/content/chapters";
import { getAllQuestions } from "@/lib/content/questions";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { getAllTerms } from "@/lib/content/glossary";
import { siteConfig } from "@/config/site";
import { locales } from "@/lib/i18n/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const [chapters, questions, caseStudies, terms] = await Promise.all([
      getAllChapters(locale),
      getAllQuestions(locale),
      getAllCaseStudies(locale),
      getAllTerms(locale),
    ]);

    const staticRoutes = [
      "",
      "/livro",
      "/perguntas",
      "/glossario",
      "/casos",
      "/simulador",
      "/sobre",
    ].map((path) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      lastModified: new Date(),
    }));

    const chapterRoutes = chapters.map((chapter) => ({
      url: `${siteConfig.url}/${locale}/livro/${chapter.slug}`,
      lastModified: new Date(),
    }));

    const questionRoutes = questions.map((question) => ({
      url: `${siteConfig.url}/${locale}/perguntas/${question.slug}`,
      lastModified: new Date(),
    }));

    const caseStudyRoutes = caseStudies.map((caseStudy) => ({
      url: `${siteConfig.url}/${locale}/casos/${caseStudy.slug}`,
      lastModified: new Date(),
    }));

    const termRoutes = terms.map((term) => ({
      url: `${siteConfig.url}/${locale}/glossario/${term.slug}`,
      lastModified: new Date(),
    }));

    entries.push(
      ...staticRoutes,
      ...chapterRoutes,
      ...questionRoutes,
      ...caseStudyRoutes,
      ...termRoutes,
    );
  }

  entries.push({ url: siteConfig.url, lastModified: new Date() });

  return entries;
}
