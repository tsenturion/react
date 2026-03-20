import clsx from 'clsx';
import { useEffect, useState } from 'react';

import type { AdvancedEffectEntry } from '../../lib/advanced-effect-domain';
import { searchAdvancedEffectPlaybook } from '../../lib/advanced-effect-domain';
import { Panel, StatusPill } from '../ui';

const topics = [
  { id: 'async', label: 'async', note: 'effect-local async helper' },
  { id: 'abort', label: 'abort', note: 'cleanup управляет отменой' },
  { id: 'effect', label: 'effect', note: 'асинхронный playbook' },
] as const;

type LoadPhase = 'loading' | 'success' | 'error';

function AsyncGuideRuntime({ topic }: { topic: string }) {
  const [phase, setPhase] = useState<LoadPhase>('loading');
  const [entry, setEntry] = useState<AdvancedEffectEntry | null>(null);
  const [error, setError] = useState('');
  const [logs] = useState<string[]>([`setup -> request ${topic}`]);

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;

    // Async-функция живёт внутри effect, чтобы callback оставался синхронным
    // и мог вернуть cleanup с abort/ignore.
    async function load() {
      try {
        const [nextEntry] = await searchAdvancedEffectPlaybook(topic, controller.signal);

        if (disposed) {
          return;
        }

        setEntry(nextEntry ?? null);
        setPhase('success');
      } catch (unknownError) {
        if (
          controller.signal.aborted ||
          (unknownError instanceof DOMException && unknownError.name === 'AbortError') ||
          disposed
        ) {
          return;
        }

        const message =
          unknownError instanceof Error ? unknownError.message : 'Неизвестная ошибка';
        setPhase('error');
        setError(message);
      }
    }

    void load();

    return () => {
      disposed = true;
      controller.abort();
    };
  }, [topic]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill tone={phase === 'success' ? 'success' : 'error'}>
            {phase}
          </StatusPill>
          <span className="text-sm text-slate-500">
            Запрос привязан к текущему query и закрывается cleanup-ом.
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Результат
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {entry?.title ??
              (phase === 'loading' ? 'Идёт загрузка...' : 'Пока нет записи')}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {error ||
              entry?.summary ||
              'Смените query или временно размонтируйте блок ниже.'}
          </p>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Что видно
        </p>
        <div className="mt-4 space-y-2">
          {logs.map((line) => (
            <div
              key={line}
              className="rounded-2xl border border-white bg-white px-4 py-3 text-sm leading-6 text-slate-700"
            >
              {line}
            </div>
          ))}
          <div className="rounded-2xl border border-white bg-white px-4 py-3 text-sm leading-6 text-slate-700">
            {phase === 'success'
              ? 'success -> запрос завершён'
              : 'effect ждёт ответ внешней системы'}
          </div>
          <div className="rounded-2xl border border-white bg-white px-4 py-3 text-sm leading-6 text-slate-700">
            {mountedText(topic)}
          </div>
        </div>
      </div>
    </div>
  );
}

function mountedText(topic: string) {
  return `cleanup управляет жизненным циклом запроса для "${topic}" и прерывает прошлый запуск при новом mount.`;
}

export function AsyncInsideEffectLab() {
  const [topic, setTopic] = useState<(typeof topics)[number]['id']>('async');
  const [mounted, setMounted] = useState(true);

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {topics.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTopic(item.id)}
            className={clsx(
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              topic === item.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setMounted((current) => !current)}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {mounted ? 'Размонтировать блок' : 'Смонтировать блок'}
        </button>
      </div>

      <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        В этом sandbox-е query меняет внешний запрос. Размонтирование показывает, что
        cleanup принадлежит effect-у и должен прервать незавершённую работу.
      </div>

      {mounted ? (
        <AsyncGuideRuntime key={topic} topic={topic} />
      ) : (
        <div className="rounded-[24px] border border-amber-300 bg-amber-50 p-6 text-sm leading-6 text-amber-950">
          Блок размонтирован. Если запрос был активен, cleanup уже отработал и забрал
          управление у предыдущего запуска.
        </div>
      )}
    </Panel>
  );
}
