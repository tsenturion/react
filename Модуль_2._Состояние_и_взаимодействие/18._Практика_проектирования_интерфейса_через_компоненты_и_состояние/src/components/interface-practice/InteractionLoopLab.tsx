import { useCallback, useState } from 'react';

import { CourseWorkbench } from './CourseWorkbench';

export function InteractionLoopLab() {
  const [entries, setEntries] = useState<string[]>([]);

  const appendTrace = useCallback((line: string) => {
    setEntries((current) => [line, ...current].slice(0, 18));
  }, []);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <CourseWorkbench onTrace={appendTrace} compact />
      <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Timeline
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Меняйте query, фильтр, выбранный урок, favorite и draft. Журнал покажет, как
          действие меняет state и к какому render-результату это приводит.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
          {entries.length > 0 ? (
            entries.map((entry, index) => (
              <li key={`${entry}-${index}`} className="rounded-2xl bg-slate-50 px-4 py-3">
                {entry}
              </li>
            ))
          ) : (
            <li className="rounded-2xl bg-slate-50 px-4 py-3">
              Сначала взаимодействуйте с экраном слева.
            </li>
          )}
        </ul>
      </aside>
    </div>
  );
}
