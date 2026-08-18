import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { locales } from "../src/lib/i18n/config";
import { techs } from "../src/lib/tech/config";

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, "public", "_headers");

// O Cloudflare Workers (assets estáticos, ver wrangler.jsonc) infere Content-Type pela extensão do
// arquivo. As rotas de imagem geradas via `ImageResponse` do Next (icon.tsx, opengraph-image.tsx) não
// têm extensão no path: sem isso, Cloudflare serve o PNG com HTTP 200 mas SEM header Content-Type, e
// crawlers de redes sociais (WhatsApp, Twitter, etc.) descartam a imagem silenciosamente. Confirmado
// em produção. Gerado a partir de `techs`/`locales` em vez de mantido à mão (ver docs/adding-a-tech.md
// §6): uma trilha nova ganha as entradas automaticamente, sem editar este arquivo.
function buildImageRoutes(): string {
  const routes = ["/icon", "/opengraph-image", ...locales.map((locale) => `/${locale}/opengraph-image`)];
  for (const locale of locales) {
    for (const tech of techs) {
      routes.push(`/${locale}/${tech}/opengraph-image`);
    }
  }
  return routes.map((route) => `${route}\n  Content-Type: image/png`).join("\n\n");
}

// `'unsafe-inline'` em script-src/style-src é inevitável nesta arquitetura: o Next injeta um script de
// hidratação inline em toda página SSG (`output: "export"`, sem nonce/hash por página possível em build
// estático), e vários componentes usam `style={{...}}` inline real (Node3D, OffsetLog3D, etc.). Ver
// docs/security.md pelo trade-off completo. O ganho real da CSP aqui é bloquear recurso de terceiro
// (script/iframe/conexão remota externa), não eliminar inline.
const SECURITY_HEADERS = `/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'self'; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN`;

function main() {
  const content = `${buildImageRoutes()}\n\n${SECURITY_HEADERS}\n`;
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, content);
  console.log(`public/_headers gerado (${locales.length * techs.length + locales.length + 2} rotas de imagem + CSP global).`);
}

const isMainModule = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;
if (isMainModule) {
  main();
}
