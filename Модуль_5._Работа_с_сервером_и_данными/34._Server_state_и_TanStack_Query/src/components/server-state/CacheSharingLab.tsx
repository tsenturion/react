import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useCatalogQuery } from '../../hooks/useCatalogQueries';
import { serverStateKeys } from '../../query/query-keys';
import { LessonCatalogView } from './LessonCatalogView';

function ObserverCard({ title }: { title: string }) {
  const query = useCatalogQuery('catalog', 'published', 30_000);

  return (
    <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {title}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Эта панель подписана на тот же query key, что и соседняя.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
        Request no: <strong>{query.data?.meta.requestNo ?? '—'}</strong>. Updated at:{' '}
        <strong>
          {query.dataUpdatedAt ? new Date(query.dataUpdatedAt).toLocaleTimeString() : '—'}
        </strong>
        .
      </div>

      {query.data ? (
        <LessonCatalogView items={query.data.items} disabled />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          Query загружает опубликованные lessons.
        </div>
      )}
    </div>
  );
}

export function CacheSharingLab() {
  const queryClient = useQueryClient();
  const [showMirror, setShowMirror] = useState(true);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowMirror((current) => !current)}
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            {showMirror ? 'Скрыть второй observer' : 'Показать второй observer'}
          </button>
          <button
            type="button"
            onClick={() =>
              void queryClient.invalidateQueries({
                queryKey: serverStateKeys.catalog('catalog', 'published'),
              })
            }
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Invalidate published query
          </button>
          <button
            type="button"
            onClick={() =>
              queryClient.removeQueries({
                queryKey: serverStateKeys.catalogRoot('catalog'),
              })
            }
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Очистить cache
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ObserverCard title="Observer A" />
        {showMirror ? <ObserverCard title="Observer B" /> : null}
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
        Если обе панели показывают одинаковый `requestNo`, query function выполнилась один
        раз, а второй consumer получил данные из того же cache entry.
      </div>
    </div>
  );
}
