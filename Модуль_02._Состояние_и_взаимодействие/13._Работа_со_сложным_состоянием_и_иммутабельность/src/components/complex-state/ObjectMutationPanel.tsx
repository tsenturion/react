import { useRef, useState } from 'react';

import { createLessonSettings } from '../../lib/complex-state-domain';
import {
  buildObjectStateReport,
  cycleDensityImmutable,
  toggleNotificationsImmutable,
  toggleThemeImmutable,
  toggleThemeMutably,
} from '../../lib/object-state-model';
import { StatusPill } from '../ui';

export function ObjectMutationPanel() {
  const [settings, setSettings] = useState(createLessonSettings);
  const [paintVersion, setPaintVersion] = useState(1);
  const [visibleJournal, setVisibleJournal] = useState<string[]>([]);
  const hiddenJournalRef = useRef<string[]>([]);
  const report = buildObjectStateReport(settings);

  const runMutableThemeUpdate = () => {
    const next = toggleThemeMutably(settings);

    // Объект уже изменён, но ссылка осталась той же.
    // Пока не случится другой ререндер, экран может не показать новый theme.
    hiddenJournalRef.current = [
      `theme изменён мутированием на ${next.theme}, но React получил ту же ссылку.`,
      ...hiddenJournalRef.current,
    ];
    setSettings(next);
  };

  return (
    <div className="space-y-5">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              object state
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              {settings.owner}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Последний видимый рендер: {paintVersion}
            </p>
          </div>
          <StatusPill tone={report.tone}>{report.stateLabel}</StatusPill>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-[24px] bg-slate-50 px-4 py-4 text-sm text-slate-700">
            Theme: <strong>{settings.theme}</strong>
          </div>
          <div className="rounded-[24px] bg-slate-50 px-4 py-4 text-sm text-slate-700">
            Notifications: <strong>{settings.notifications ? 'on' : 'off'}</strong>
          </div>
          <div className="rounded-[24px] bg-slate-50 px-4 py-4 text-sm text-slate-700">
            Density: <strong>{settings.density}</strong>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setVisibleJournal([...hiddenJournalRef.current]);
              setSettings((current) => toggleThemeImmutable(current));
            }}
            className="chip"
          >
            Безопасно переключить theme
          </button>
          <button
            type="button"
            onClick={() => {
              setVisibleJournal([...hiddenJournalRef.current]);
              setSettings((current) => toggleNotificationsImmutable(current));
            }}
            className="chip"
          >
            Переключить notifications
          </button>
          <button
            type="button"
            onClick={() => {
              setVisibleJournal([...hiddenJournalRef.current]);
              setSettings((current) => cycleDensityImmutable(current));
            }}
            className="chip"
          >
            Сменить density
          </button>
          <button type="button" onClick={runMutableThemeUpdate} className="chip">
            Плохое обновление theme
          </button>
          <button
            type="button"
            onClick={() => {
              setVisibleJournal([...hiddenJournalRef.current]);
              setPaintVersion((current) => current + 1);
            }}
            className="chip"
          >
            Внешний ререндер
          </button>
          <button
            type="button"
            onClick={() => {
              setSettings(createLessonSettings());
              setPaintVersion(1);
              hiddenJournalRef.current = [];
              setVisibleJournal([]);
            }}
            className="chip"
          >
            Сбросить
          </button>
        </div>
      </article>

      <div className="space-y-3">
        {visibleJournal.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
            Попробуйте плохое обновление объекта, а затем внешний ререндер. Так видно, что
            данные уже испорчены, хотя предыдущий экран этого не показал.
          </div>
        ) : (
          visibleJournal.map((entry, index) => (
            <div
              key={`${entry}-${index}`}
              className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700 shadow-sm"
            >
              {entry}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
