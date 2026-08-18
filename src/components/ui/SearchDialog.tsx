"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import type { SearchEntry } from "@/types/content";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Tech } from "@/lib/tech/config";
import { formatTemplate } from "@/lib/i18n/format";

export function SearchDialog({
  tech,
  locale,
  dict,
}: {
  tech: Tech;
  locale: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const fetchStarted = useRef(false);

  // Índice gerado em build-time (scripts/build-search-index.ts) como JSON estático: não vem embutido
  // no HTML da página (evita duplicar ~90 entradas em toda uma das 294 páginas do site). Buscado sob
  // demanda (no hover/foco do botão, ou na abertura do diálogo, o que vier primeiro).
  function loadIndex() {
    if (fetchStarted.current) return;
    fetchStarted.current = true;
    fetch(`/search-index/${tech}-${locale}.json`)
      .then((response) => (response.ok ? response.json() : []))
      .then((data: SearchEntry[]) => setIndex(data))
      .catch(() => setIndex([]));
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        loadIndex();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loadIndex é estável (só depende de refs)
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !index) return [];
    return index
      .filter(
        (entry) => entry.title.toLowerCase().includes(q) || entry.excerpt.toLowerCase().includes(q),
      )
      .slice(0, 20);
  }, [index, query]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (next) loadIndex();
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <Dialog.Trigger asChild>
        <button
          type="button"
          onMouseEnter={loadIndex}
          onFocus={loadIndex}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--color-border)] px-3 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="hidden sm:inline">{dict.header.searchButton}</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-24 z-50 w-[90vw] max-w-lg -translate-x-1/2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-4 shadow-xl outline-none">
          <Dialog.Title className="sr-only">{dict.search.dialogTitle}</Dialog.Title>
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.search.placeholder}
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2 text-sm text-[var(--color-text)] outline-none"
          />
          <ul className="mt-3 max-h-80 overflow-y-auto">
            {results.map((result) => (
              <li key={`${result.type}-${result.href}`}>
                <Link
                  href={result.href}
                  onClick={() => setOpen(false)}
                  className="flex flex-col gap-0.5 rounded-md px-3 py-2 hover:bg-[var(--color-surface)]"
                >
                  <span className="text-xs font-medium text-[var(--color-accent)]">
                    {result.type}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    {result.title}
                  </span>
                  <span className="truncate text-xs text-[var(--color-text-muted)]">
                    {result.excerpt}
                  </span>
                </Link>
              </li>
            ))}
            {query.trim() && results.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-[var(--color-text-muted)]">
                {formatTemplate(dict.search.noResults, { query })}
              </li>
            ) : null}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
