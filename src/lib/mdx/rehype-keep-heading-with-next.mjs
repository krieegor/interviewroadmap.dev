// Agrupa cada <h2>/<h3> com o parágrafo <p> imediatamente seguinte num <div> wrapper.
// Sem esse agrupamento, `break-after: avoid-page` no heading (globals.css) só impede um
// page-break exatamente entre o heading e o próximo bloco — mas não impede que esse bloco
// comece a ser cortado poucas linhas depois, deixando o título "sozinho" perto do fim da
// página impressa. O wrapper com `break-inside: avoid-page` (também em globals.css, escopado
// a `.pdf-book`) faz o Chromium empurrar o par heading+parágrafo inteiro para a página seguinte
// quando não cabem juntos. Não tem efeito na leitura normal do site (div sem estilo próprio).
//
// Só agrupa quando o próximo irmão é um <p> simples — evita empurrar blocos grandes
// (diagramas, listas, componentes MDX customizados) que poderiam deixar buracos em branco
// piores do que o problema original.
export default function rehypeKeepHeadingWithNext() {
  return (tree) => {
    visit(tree);
  };
}

function isHeading(node) {
  return node?.type === "element" && (node.tagName === "h2" || node.tagName === "h3");
}

function isPlainParagraph(node) {
  return node?.type === "element" && node.tagName === "p";
}

function isWhitespaceText(node) {
  return node?.type === "text" && node.value.trim() === "";
}

function isOwnWrapper(node) {
  return (
    node?.type === "element" &&
    node.tagName === "div" &&
    node.properties?.className?.includes?.("pdf-keep-with-heading")
  );
}

function visit(node) {
  if (!node || !Array.isArray(node.children)) return;
  // O wrapper já contém exatamente [heading, parágrafo] adjacentes, sem texto entre eles —
  // reprocessar esses filhos recriaria o mesmo wrapper dentro dele mesmo, infinitamente.
  if (isOwnWrapper(node)) return;

  const children = node.children;
  const next = [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (isHeading(child)) {
      // Pula nós de texto (só espaço/quebra de linha) entre o heading e o próximo bloco real.
      let j = i + 1;
      while (j < children.length && isWhitespaceText(children[j])) j++;
      const candidate = children[j];

      if (isPlainParagraph(candidate)) {
        next.push({
          type: "element",
          tagName: "div",
          properties: { className: ["pdf-keep-with-heading"] },
          children: [child, candidate],
        });
        i = j;
        continue;
      }
    }

    next.push(child);
  }

  node.children = next;
  for (const child of node.children) {
    visit(child);
  }
}
