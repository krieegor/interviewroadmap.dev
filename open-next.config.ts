import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// Sem isso, o Worker não tem onde ler o cache incremental gerado no build — cada request cairia no
// fallback de renderização ao vivo, que falha porque os loaders de conteúdo (src/lib/content/**) usam
// fs.readdirSync/import() dinâmico, indisponíveis no sandbox do Workers. Ver docs/deployment.md.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
