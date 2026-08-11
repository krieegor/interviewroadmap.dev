import { spawn, type ChildProcess } from "node:child_process";
import net from "node:net";
import path from "node:path";
import fs from "node:fs";
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, "public", "livro.pdf");
// `next build` (output: "export") já copiou public/** para out/ antes do postbuild rodar — escrever
// só em public/livro.pdf não afeta o export já gerado, então o PDF final também precisa ir pra lá.
const EXPORT_OUTPUT_PATH = path.join(ROOT, "out", "livro.pdf");
const PRINT_ROUTE = "/pt/kafka/livro/impressao";
const SERVER_READY_TIMEOUT_MS = 60_000;
const MERMAID_TIMEOUT_MS = 30_000;

function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, () => {
      const address = server.address();
      if (address && typeof address === "object") {
        const { port } = address;
        server.close(() => resolve(port));
      } else {
        server.close(() => reject(new Error("Não foi possível obter uma porta livre.")));
      }
    });
  });
}

function startServer(port: number): ChildProcess {
  // Com `output: "export"` não existe mais `next start` (o build é HTML estático em out/) — serve
  // esse diretório com o `serve` (mesmo pacote usado no script "start" do package.json).
  const serveBin = path.join(
    ROOT,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "serve.cmd" : "serve",
  );
  const outDir = path.join(ROOT, "out");
  // .cmd shims on Windows only run through a shell; the command is built as a
  // single string (rather than shell:true + args array) to sidestep Node's
  // shell-argument-escaping deprecation warning (DEP0190).
  const command = `"${serveBin}" -l ${port} "${outDir}"`;
  return spawn(command, {
    cwd: ROOT,
    shell: true,
    stdio: "pipe",
  });
}

function stopServer(server: ChildProcess) {
  if (!server.pid) return;
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(server.pid), "/t", "/f"], { stdio: "ignore" });
  } else {
    server.kill("SIGTERM");
  }
}

async function waitForServer(url: string): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < SERVER_READY_TIMEOUT_MS) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // servidor ainda subindo
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Servidor não respondeu em ${url} após ${SERVER_READY_TIMEOUT_MS}ms.`);
}

async function main() {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

  const port = await getFreePort();
  const url = `http://localhost:${port}${PRINT_ROUTE}`;
  const server = startServer(port);

  try {
    console.log(`Aguardando servidor de produção em ${url}...`);
    await waitForServer(url);

    console.log("Gerando PDF com Playwright/Chromium...");
    let browser;
    try {
      browser = await chromium.launch();
    } catch (error) {
      console.warn(
        "Não foi possível iniciar o Chromium (ambiente sem as bibliotecas gráficas necessárias — " +
          "ex.: o build container da Cloudflare Workers Builds). Pulando a geração do PDF nesta " +
          "execução; public/livro.pdf não será atualizado.",
      );
      console.warn(String(error));
      return;
    }
    try {
      const context = await browser.newContext({ colorScheme: "light" });
      const page = await context.newPage();
      // Precisa ser emulado antes do goto: os diagramas decidem 3D-vs-SVG (useShouldRender3D)
      // já na primeira renderização, lendo `window.matchMedia("print")` no mount.
      await page.emulateMedia({ media: "print" });
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForFunction(
        () => document.querySelectorAll('[data-mermaid-status="rendering"]').length === 0,
        { timeout: MERMAID_TIMEOUT_MS },
      );

      const margin = { top: "20mm", bottom: "18mm", left: "16mm", right: "16mm" };

      // A capa é gerada isoladamente e sem rodapé, para não entrar na contagem de páginas do
      // livro. As duas passadas usam a mesma página já carregada (só alternando uma classe no
      // <body> que esconde/mostra seções via CSS — ver globals.css).
      await page.evaluate(() => document.body.classList.add("pdf-render-cover-only"));
      const coverBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin,
        displayHeaderFooter: false,
      });

      await page.evaluate(() => {
        document.body.classList.remove("pdf-render-cover-only");
        document.body.classList.add("pdf-render-content-only");
      });
      const contentBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin,
        displayHeaderFooter: true,
        headerTemplate: "<div></div>",
        footerTemplate: `
          <div style="width:100%; font-size:9px; text-align:center; color:#94a3b8; padding-top:4px;">
            <span class="pageNumber"></span> / <span class="totalPages"></span>
          </div>
        `,
      });

      const merged = await PDFDocument.create();
      const coverDoc = await PDFDocument.load(coverBuffer);
      const contentDoc = await PDFDocument.load(contentBuffer);
      for (const p of await merged.copyPages(coverDoc, coverDoc.getPageIndices())) {
        merged.addPage(p);
      }
      for (const p of await merged.copyPages(contentDoc, contentDoc.getPageIndices())) {
        merged.addPage(p);
      }
      const pdfBytes = await merged.save();
      fs.writeFileSync(OUTPUT_PATH, pdfBytes);
      if (fs.existsSync(path.dirname(EXPORT_OUTPUT_PATH))) {
        fs.writeFileSync(EXPORT_OUTPUT_PATH, pdfBytes);
      }
    } finally {
      await browser.close();
    }

    const { size } = fs.statSync(OUTPUT_PATH);
    console.log(`PDF gerado em public/livro.pdf e out/livro.pdf (${(size / 1024 / 1024).toFixed(1)} MB).`);
  } finally {
    stopServer(server);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Falha ao gerar o PDF do livro:", error);
    process.exit(1);
  });
