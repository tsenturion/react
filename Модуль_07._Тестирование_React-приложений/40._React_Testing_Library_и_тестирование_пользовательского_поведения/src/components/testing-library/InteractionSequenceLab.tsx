import { useEffect, useMemo, useRef, useState } from 'react';

import { recommendInteractionAssertion } from '../../lib/rtl-runtime';

export function InteractionSequenceLab() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [log, setLog] = useState<readonly string[]>([]);
  const timeoutRef = useRef<number | null>(null);

  const recommendation = useMemo(
    () =>
      recommendInteractionAssertion({
        multiStep: panelOpen,
        asyncUi: true,
        changesFocus: false,
        textEntry: query.length > 0,
      }),
    [panelOpen, query.length],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const applyFilter = () => {
    if (query.trim().length < 3) {
      return;
    }

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    setPending(true);
    setAnnouncement('');

    // Здесь результат появляется не мгновенно, чтобы было видно:
    // тесту нужен observable async outcome, а не чтение внутреннего флага pending.
    timeoutRef.current = window.setTimeout(() => {
      const nextMessage = `Фильтр "${query.trim()}" применён к каталогу лабораторий.`;

      setAnnouncement(nextMessage);
      setPending(false);
      setLog((current) => [nextMessage, ...current]);
    }, 120);
  };

  return (
    <section className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Interaction sequence
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">
            Один пользовательский путь должен читаться и в интерфейсе, и в тесте
          </h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          {recommendation.model}
        </span>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <button
          type="button"
          onClick={() => setPanelOpen((current) => !current)}
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
        >
          {panelOpen ? 'Скрыть фильтры' : 'Открыть фильтры'}
        </button>

        {panelOpen ? (
          <div className="mt-4 space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
            <label htmlFor="interaction-query" className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Поисковая строка</span>
              <input
                id="interaction-query"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>

            <button
              type="button"
              disabled={query.trim().length < 3 || pending}
              onClick={applyFilter}
              className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Применить фильтр
            </button>

            {announcement ? (
              <p
                role="status"
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900"
              >
                {announcement}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Почему такой тест полезен
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {recommendation.recommendation}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-900">
            <strong>Не делайте так:</strong> {recommendation.antiPattern}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Interaction log
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {log.length === 0 ? <li>Лог пока пуст.</li> : null}
            {log.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
