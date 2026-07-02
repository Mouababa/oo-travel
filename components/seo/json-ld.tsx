/**
 * Renders one or more JSON-LD structured-data blocks. Server component —
 * safe to embed in layouts/pages. Feeds SEO rich results and generative
 * engines (AI answer engines read schema.org entities to cite the business).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
