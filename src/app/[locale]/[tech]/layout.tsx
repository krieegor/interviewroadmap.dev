import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getTechConfig } from "@/config/tech";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isTech, techs, type Tech } from "@/lib/tech/config";

export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) return [];
  return techs.map((tech) => ({ tech }));
}

// `techs` é um conjunto fechado — ver nota em src/app/[locale]/layout.tsx.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tech: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, tech: rawTech } = await params;
  if (!isLocale(rawLocale) || !isTech(rawTech)) return {};
  const techConfig = getTechConfig(rawTech, rawLocale);

  return {
    title: techConfig.name,
    description: techConfig.description,
  };
}

// Não faz `await params` aqui — fazer isso no corpo do layout impede a pré-renderização estática
// das rotas abaixo dele (segmentos [slug] mais profundos ficam de fora do build). A Promise é
// repassada intacta pro TechChrome, que é quem de fato precisa dos valores resolvidos.
export default function TechLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; tech: string }>;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <TechChrome params={params}>{children}</TechChrome>
    </div>
  );
}

async function TechChrome({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; tech: string }>;
}) {
  const { locale: rawLocale, tech: rawTech } = await params;
  if (!isLocale(rawLocale) || !isTech(rawTech)) notFound();
  const locale: Locale = rawLocale;
  const tech: Tech = rawTech;
  const dict = getDictionary(locale);

  return (
    <div data-tech={tech} className="contents">
      <div className="site-chrome">
        <Header locale={locale} tech={tech} dict={dict} />
      </div>
      <main id="conteudo-principal" className="flex-1">
        {children}
      </main>
      <div className="site-chrome">
        <Footer locale={locale} tech={tech} dict={dict} />
      </div>
    </div>
  );
}
