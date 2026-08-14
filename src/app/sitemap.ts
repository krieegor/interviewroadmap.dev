import type { MetadataRoute } from "next";
import { getAllChapters } from "@/lib/content/chapters";
import { getAllQuestions } from "@/lib/content/questions";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { getAllTerms } from "@/lib/content/glossary";
import { siteConfig } from "@/config/site";
import { locales } from "@/lib/i18n/config";
import { techs, techsWithContent } from "@/lib/tech/config";

// Necessário com `output: "export"` — sem isso o build trata a rota como potencialmente dinâmica.
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({ url: `${siteConfig.url}/${locale}/home`, lastModified: new Date() });

    for (const tech of techs) {
      // Trilhas "em construção" ficam fora do sitemap — a própria página delas já é `noindex`
      // (ver [locale]/[tech]/layout.tsx), então submetê-las aqui mandaria um sinal contraditório.
      if (!techsWithContent.includes(tech)) continue;

      entries.push({ url: `${siteConfig.url}/${locale}/${tech}`, lastModified: new Date() });

      const [chapters, questions, caseStudies, terms] = await Promise.all([
        getAllChapters(tech, locale),
        getAllQuestions(tech, locale),
        getAllCaseStudies(tech, locale),
        getAllTerms(tech, locale),
      ]);

      const staticRoutes = ["/livro", "/perguntas", "/glossario", "/casos", "/simulador", "/sobre"].map(
        (path) => ({
          url: `${siteConfig.url}/${locale}/${tech}${path}`,
          lastModified: new Date(),
        }),
      );

      const chapterRoutes = chapters.map((chapter) => ({
        url: `${siteConfig.url}/${locale}/${tech}/livro/${chapter.slug}`,
        lastModified: new Date(),
      }));

      const questionRoutes = questions.map((question) => ({
        url: `${siteConfig.url}/${locale}/${tech}/perguntas/${question.slug}`,
        lastModified: new Date(),
      }));

      const caseStudyRoutes = caseStudies.map((caseStudy) => ({
        url: `${siteConfig.url}/${locale}/${tech}/casos/${caseStudy.slug}`,
        lastModified: new Date(),
      }));

      const termRoutes = terms.map((term) => ({
        url: `${siteConfig.url}/${locale}/${tech}/glossario/${term.slug}`,
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
  }

  entries.push({ url: siteConfig.url, lastModified: new Date() });

  return entries;
}
