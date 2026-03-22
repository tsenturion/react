import { filterServerItems } from '../../lib/server-state-model';
import { useQueryParamState } from '../../hooks/useQueryParamState';
import { MetricCard } from '../ui';
import { useServerPlaybookQuery } from '../../hooks/useServerPlaybookQuery';

const tracks = ['all', 'ui', 'routing', 'data', 'infra'] as const;

export function UrlStateLab() {
  const [track, setTrack] = useQueryParamState<(typeof tracks)[number]>(
    'track',
    'all',
    tracks,
  );
  const [query, setQuery] = useQueryParamState<string>('q', '');
  const { snapshot } = useServerPlaybookQuery();
  const filteredItems = filterServerItems(snapshot.items, track, query);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="URL state"
          value={window.location.search || '?'}
          hint="Состояние живёт в адресной строке и переживает reload/back-forward."
          tone="cool"
        />
        <MetricCard
          label="Подходит для"
          value="Фильтр и view"
          hint="То, что должно открываться по ссылке, хорошо живёт в URL."
        />
        <MetricCard
          label="Не подходит для"
          value="Секретный draft"
          hint="Незавершённые локальные детали редко нужно экспортировать в ссылку."
          tone="accent"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Поиск в URL</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value, 'replace')}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400"
              />
            </label>

            <div className="mt-4">
              <span className="text-sm font-medium text-slate-700">Track</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {tracks.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTrack(value)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                      track === value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">Подсказка</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Меняйте фильтр и посмотрите на адресную строку. Потом используйте
              back/forward: `useQueryParamState` подписан на `popstate` и синхронно читает
              актуальный URL.
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    {item.track} • {item.owner}
                  </p>
                </div>
                <span className="chip">{item.syncCost}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
