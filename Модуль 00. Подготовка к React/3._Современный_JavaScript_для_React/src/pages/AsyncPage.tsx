import { useState } from 'react';

import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  buildPromiseTimeline,
  fetchCatalog,
  fetchModes,
  filterRemoteLessons,
  toRequestError,
  type FetchMode,
  type RemoteCatalog,
} from '../lib/async-model';
import { formatMinutes } from '../lib/common';
import { projectStudy } from '../lib/project-study';

type RequestState =
  | { status: 'idle' | 'loading'; payload: null; error: string }
  | { status: 'success'; payload: RemoteCatalog; error: string }
  | { status: 'error'; payload: null; error: string };

export function AsyncPage() {
  const [mode, setMode] = useState<FetchMode>('ready');
  const [query, setQuery] = useState('');
  const [onlyReady, setOnlyReady] = useState(false);
  const [requestState, setRequestState] = useState<RequestState>({
    status: 'idle',
    payload: null,
    error: '',
  });

  const loadCatalog = async () => {
    setRequestState({ status: 'loading', payload: null, error: '' });

    try {
      const payload = await fetchCatalog(mode);
      setRequestState({ status: 'success', payload, error: '' });
    } catch (error) {
      setRequestState({
        status: 'error',
        payload: null,
        error: toRequestError(error),
      });
    }
  };

  const visibleLessons =
    requestState.status === 'success'
      ? filterRemoteLessons(requestState.payload, { query, onlyReady })
      : [];
  const promiseTimeline = buildPromiseTimeline({
    mode,
    status: requestState.status,
    visibleCount: visibleLessons.length,
    error: requestState.error,
  });

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Lab 5"
        title="Promises, async/await и fetch как источник интерфейсных состояний"
        copy="Эта лаборатория делает настоящий `fetch` в локальный JSON, а затем превращает ответ в loading, success или error-состояние. Так видно, что async-поток — это не только код запроса, но и модель поведения интерфейса."
        aside={
          <div className="space-y-3">
            <StatusPill
              tone={
                requestState.status === 'error'
                  ? 'error'
                  : requestState.status === 'loading'
                    ? 'warn'
                    : 'success'
              }
            >
              {requestState.status}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Загрузка запускается вручную, чтобы каждый переход состояния был виден без
              скрытых side effects.
            </p>
          </div>
        }
      />

      <Panel className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Режим запроса</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {fetchModes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      mode === item
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className="text-sm font-semibold text-slate-800"
                htmlFor="async-query"
              >
                Фильтр после загрузки
              </label>
              <input
                id="async-query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400"
                placeholder="например: fetch"
              />
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={onlyReady}
                onChange={(event) => setOnlyReady(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm leading-6 text-slate-700">
                Фильтровать ответ дальше и оставлять только `ready`-элементы.
              </span>
            </label>

            <button
              type="button"
              onClick={() => {
                void loadCatalog();
              }}
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Выполнить fetch
            </button>

            <CodeBlock
              label="async handler"
              code={`const loadCatalog = async () => {
  setRequestState({ status: 'loading', payload: null, error: '' });

  try {
    const payload = await fetchCatalog(mode);
    setRequestState({ status: 'success', payload, error: '' });
  } catch (error) {
    setRequestState({ status: 'error', payload: null, error: toRequestError(error) });
  }
};`}
            />
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard
                label="request status"
                value={requestState.status}
                hint="Promise ещё не resolved/rejected или уже завершился."
              />
              <MetricCard
                label="visible lessons"
                value={String(visibleLessons.length)}
                hint="После получения ответа данные можно фильтровать отдельно от запроса."
                tone="accent"
              />
            </div>

            {requestState.status === 'success' ? (
              <MetricCard
                label="payload generated"
                value={new Date(requestState.payload.generatedAt).toLocaleTimeString(
                  'ru-RU',
                )}
                hint="В ответе лежат не только элементы, но и метаданные запроса."
                tone="cool"
              />
            ) : null}

            <ListBlock title="Promise timeline" items={promiseTimeline} />
          </div>
        </div>

        {requestState.status === 'success' ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visibleLessons.map((lesson) => (
              <article
                key={lesson.id}
                className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                    {lesson.level}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    {formatMinutes(lesson.duration)}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {lesson.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{lesson.summary}</p>
              </article>
            ))}
          </div>
        ) : null}

        {requestState.status === 'error' ? (
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-5 text-sm leading-6 text-rose-950">
            Ошибка запроса: {requestState.error}
          </div>
        ) : null}

        <ListBlock
          title="Типичные ошибки"
          items={[
            'Смешивать сам запрос и derived-фильтрацию результата в одну непрозрачную функцию.',
            'Не различать loading и error-состояния, из-за чего интерфейс не объясняет, что происходит.',
            'Мутировать payload после fetch вместо того, чтобы строить новый отфильтрованный массив.',
          ]}
        />
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.async.files}
          snippets={projectStudy.async.snippets}
        />
      </Panel>
    </div>
  );
}
