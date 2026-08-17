// `<` escapado pra evitar que um valor de conteúdo contendo `</script>` literal feche a tag antes da hora.
export function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
