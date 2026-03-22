import clsx from 'clsx';
import { useState } from 'react';

import { architectureModes } from '../../lib/redux-domain';
import { useAppSelector } from '../../store/hooks';
import { MetricCard } from '../ui';

const localStructure = [
  {
    title: 'Component owns state',
    detail: 'Состояние, callbacks и derived logic живут рядом с конкретным компонентом.',
  },
  {
    title: 'Lifting and props',
    detail:
      'Когда нужно поделиться данными, state поднимается выше, а callbacks идут через props.',
  },
  {
    title: 'Logic spreads through UI',
    detail:
      'С ростом дерева переходы состояния начинают размазываться по множеству обработчиков.',
  },
] as const;

const reduxStructure = [
  {
    title: 'Action expresses intent',
    detail: 'View dispatch-ит action object и не меняет общий state напрямую.',
  },
  {
    title: 'Reducer owns transitions',
    detail: 'Все изменения shared state собираются в одном reducer/slice слое.',
  },
  {
    title: 'Selectors shape views',
    detail:
      'Каждая ветка читает derived data из store через selectors, а не считает всё заново внутри JSX.',
  },
] as const;

export function ArchitectureShiftLab() {
  const [mode, setMode] = useState<'local' | 'redux'>('local');
  const lens = useAppSelector((state) => state.lessonView.lens);
  const activeMode =
    architectureModes.find((item) => item.id === mode) ?? architectureModes[0]!;
  const activeStructure = mode === 'local' ? localStructure : reduxStructure;

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-wrap gap-2">
          {architectureModes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={clsx(
                'rounded-xl px-4 py-3 text-sm font-medium transition',
                mode === item.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Режим"
          value={activeMode.label}
          hint={activeMode.headline}
          tone="cool"
        />
        <MetricCard
          label="Lesson lens"
          value={lens}
          hint="Shell урока сам построен на Redux, поэтому общая перспектива переключается централизованно."
        />
        <MetricCard
          label="Mental shift"
          value={mode === 'local' ? 'UI-centric' : 'Store-centric'}
          hint="Redux меняет не только API, но и точку, из которой вы смотрите на shared state."
          tone="accent"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">{activeMode.headline}</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            {activeMode.bullets.map((bullet) => (
              <li
                key={bullet}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            Та же задача, другой фокус
          </p>
          <div className="mt-4 grid gap-3">
            {activeStructure.map((step) => (
              <article
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
