import { useState } from 'react';

export function BatchingScene() {
  const [version, setVersion] = useState(1);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [flash, setFlash] = useState('Изменений пока нет.');

  const publish = () => {
    // Несколько setState в одном обработчике описывают следующий UI целиком.
    // React не показывает промежуточное состояние между этими тремя вызовами.
    setVersion((current) => current + 1);
    setStatus('published');
    setFlash('Обновление собрано и опубликовано.');
  };

  return (
    <div className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            batched event
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Версия {version}</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
          status: {status}
        </span>
      </div>

      <p className="rounded-[24px] bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
        {flash}
      </p>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={publish} className="chip">
          Опубликовать одним действием
        </button>
        <button
          type="button"
          onClick={() => {
            setVersion(1);
            setStatus('draft');
            setFlash('Изменений пока нет.');
          }}
          className="chip"
        >
          Сбросить
        </button>
      </div>
    </div>
  );
}
