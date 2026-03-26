export default function TraceChunk() {
  return (
    <section className="rounded-[24px] border border-violet-200 bg-violet-50 p-5">
      <h3 className="text-lg font-semibold text-violet-950">Trace chunk loaded</h3>
      <ol className="mt-3 space-y-2 text-sm leading-6 text-violet-900">
        <li>Shell появляется.</li>
        <li>Fallback закрывает только pending часть дерева.</li>
        <li>Chunk доезжает и boundary раскрывается без полного сброса экрана.</li>
      </ol>
    </section>
  );
}
