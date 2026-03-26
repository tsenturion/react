export default function GlossaryChunk() {
  return (
    <section className="rounded-[24px] border border-sky-200 bg-sky-50 p-5">
      <h3 className="text-lg font-semibold text-sky-950">Glossary chunk loaded</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-sky-900">
        <li>Suspense boundary: место, где UI может ждать отдельно.</li>
        <li>Fallback: временное содержимое внутри этой границы.</li>
        <li>Reveal: момент, когда данные или код готовы и граница раскрывается.</li>
      </ul>
    </section>
  );
}
