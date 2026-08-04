"use client";

import { useEffect, useId, useRef, useState } from "react";

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"rendering" | "done" | "error">("rendering");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            background: "transparent",
            primaryColor: "#f1f5f9",
            primaryTextColor: "#0f172a",
            primaryBorderColor: "#e2e8f0",
            lineColor: "#475569",
            secondaryColor: "#fff7ed",
            tertiaryColor: "#ffffff",
          },
        });
        const { svg } = await mermaid.render(`mermaid-${id}`, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setStatus("done");
        }
      } catch {
        if (!cancelled) {
          setError("Não foi possível renderizar o diagrama.");
          setStatus("error");
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return <pre className="text-sm text-red-500">{error}</pre>;
  }

  return (
    <div ref={ref} data-mermaid-status={status} className="flex justify-center overflow-x-auto" />
  );
}
