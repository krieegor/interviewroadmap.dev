"use client";

import { useEffect, useRef, useState } from "react";

// Vídeo só baixa/toca quando entra na viewport (IntersectionObserver) e nunca ativa sob
// prefers-reduced-motion — sem isso o browser começa a buscar os bytes do vídeo assim que a home
// carrega, mesmo escondido via CSS (motion-reduce:hidden não impede o download).
export function LazyAutoplayVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Mudar `src` via re-render não reativa sozinho o carregamento/autoplay do <video> em todo
    // browser — precisa chamar load()/play() explicitamente depois que o atributo muda.
    if (!shouldLoad) return;
    const el = ref.current;
    if (!el) return;
    el.load();
    el.play().catch(() => {
      // Autoplay bloqueado pelo browser (raro com muted, mas pode acontecer) — sem áudio pra
      // recuperar, então só deixa o poster estático.
    });
  }, [shouldLoad]);

  return (
    <video
      ref={ref}
      src={shouldLoad ? src : undefined}
      poster={poster}
      preload={shouldLoad ? "auto" : "none"}
      muted
      loop
      playsInline
      aria-hidden="true"
      className={className}
    />
  );
}
