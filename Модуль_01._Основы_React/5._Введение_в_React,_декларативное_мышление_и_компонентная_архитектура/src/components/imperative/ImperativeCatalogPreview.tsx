import { useEffect, useRef, useState } from 'react';

import type { CatalogView } from '../../lib/catalog-domain';
import { buildImperativeOperations } from '../../lib/react-vs-js-model';

type ImperativeRenderSummary = {
  operationCount: number;
  operations: string[];
};

export function ImperativeCatalogPreview({
  view,
  selectedId,
}: {
  view: CatalogView;
  selectedId: string | null;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [summary, setSummary] = useState<ImperativeRenderSummary>({
    operationCount: 0,
    operations: [],
  });

  useEffect(() => {
    if (!hostRef.current) {
      return;
    }

    // Этот блок намеренно пишет в DOM вручную, чтобы контраст с React-версией
    // был выражен не только текстом, но и самой реализацией текущего проекта.
    const nextSummary = renderCatalogImperatively(hostRef.current, view, selectedId);
    setSummary(nextSummary);
  }, [view, selectedId]);

  return (
    <section className="space-y-4 rounded-[24px] border border-rose-200 bg-rose-50/60 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
          Imperative DOM preview
        </p>
        <h3 className="mt-2 text-lg font-semibold text-rose-950">Обычный JS</h3>
        <p className="mt-2 text-sm leading-6 text-rose-900/80">
          Контейнер ниже пересобирается через DOM API: создаются элементы, записывается
          `textContent`, затем всё вручную вставляется в host-узел.
        </p>
      </div>

      <div
        ref={hostRef}
        className="min-h-[260px] rounded-[24px] border border-rose-200 bg-white p-4"
      />

      <div className="rounded-[20px] border border-rose-200 bg-white/90 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
          Последний проход по DOM
        </p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-rose-950">
          {summary.operationCount}
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-rose-900/80">
          {summary.operations.map((operation) => (
            <li key={operation}>{operation}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function renderCatalogImperatively(
  host: HTMLDivElement,
  view: CatalogView,
  selectedId: string | null,
): ImperativeRenderSummary {
  const operations = buildImperativeOperations(view, selectedId);
  const fragment = document.createDocumentFragment();
  const wrapper = document.createElement('div');
  wrapper.className = 'space-y-4';

  const summary = document.createElement('div');
  summary.className =
    'rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900';
  summary.textContent = `Видимых карточек: ${view.visibleCount}. Категорий: ${view.sections.length}.`;
  wrapper.append(summary);

  if (view.visibleCount === 0) {
    const empty = document.createElement('div');
    empty.className =
      'rounded-2xl border border-dashed border-rose-200 bg-white px-4 py-6 text-sm text-rose-900';
    empty.textContent = view.emptyCopy;
    wrapper.append(empty);
  } else {
    for (const section of view.sections) {
      const sectionElement = document.createElement('section');
      sectionElement.className = 'space-y-3';

      const heading = document.createElement('h4');
      heading.className =
        'text-sm font-semibold uppercase tracking-[0.18em] text-rose-700';
      heading.textContent = section.category;
      sectionElement.append(heading);

      const list = document.createElement('div');
      list.className = 'grid gap-3';

      for (const item of section.items) {
        const card = document.createElement('article');
        card.className =
          item.id === selectedId
            ? 'rounded-2xl border border-blue-500 bg-blue-50 px-4 py-3'
            : 'rounded-2xl border border-rose-200 bg-white px-4 py-3';

        const title = document.createElement('h5');
        title.className = 'text-sm font-semibold text-slate-950';
        title.textContent = item.title;

        const copy = document.createElement('p');
        copy.className = 'mt-2 text-sm leading-6 text-slate-600';
        copy.textContent = item.summary;

        card.append(title, copy);
        list.append(card);
      }

      sectionElement.append(list);
      wrapper.append(sectionElement);
    }
  }

  fragment.append(wrapper);
  host.replaceChildren(fragment);

  return {
    operationCount: operations.length,
    operations: operations.slice(0, 7),
  };
}
