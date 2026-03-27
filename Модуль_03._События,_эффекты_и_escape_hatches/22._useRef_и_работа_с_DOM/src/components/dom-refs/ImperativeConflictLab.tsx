import clsx from 'clsx';
import { useRef, useState } from 'react';

import type { DemoTheme } from '../../lib/ref-domain';
import { Panel, StatusPill } from '../ui';

export function ImperativeConflictLab() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const [theme, setTheme] = useState<DemoTheme>('calm');
  const [labelVersion, setLabelVersion] = useState(1);
  const [status, setStatus] = useState(
    'Пока DOM полностью совпадает с JSX. Дальше попробуйте ручную мутацию.',
  );

  const reactLabel = `React-owned label ${labelVersion}`;

  function focusCard() {
    cardRef.current?.focus();
    setStatus('Фокус на карточку направлен imperatively. Это нормальный escape hatch.');
  }

  function mutateDomManually() {
    cardRef.current?.classList.add('ring-4', 'ring-rose-500');

    if (titleRef.current) {
      titleRef.current.textContent = 'Manual DOM rewrite';
    }

    setStatus(
      'DOM изменён вручную: добавлен ring и переписан заголовок. Теперь запустите React rerender.',
    );
  }

  function handleReactRerender() {
    setTheme((current) => (current === 'calm' ? 'alert' : 'calm'));
    setLabelVersion((current) => current + 1);
    setStatus(
      'React снова применил JSX-описание. То, что было подменено вручную, стало неустойчивым.',
    );
  }

  function resetCard() {
    if (cardRef.current) {
      cardRef.current.classList.remove('ring-4', 'ring-rose-500');
    }

    setTheme('calm');
    setLabelVersion(1);
    setStatus('Карточка возвращена к declarative baseline.');
  }

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="warn">imperative DOM has limits</StatusPill>
        <span className="text-sm text-slate-500">
          theme in React state: <strong>{theme}</strong>
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div
          ref={cardRef}
          tabIndex={-1}
          className={clsx(
            'rounded-[28px] border p-6 outline-none transition',
            theme === 'calm'
              ? 'border-slate-200 bg-slate-50'
              : 'border-amber-300 bg-amber-50',
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            React controls className and label
          </p>
          <h3 ref={titleRef} className="mt-3 text-2xl font-semibold text-slate-900">
            {reactLabel}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Этот блок хорошо показывает границу: focus допустим imperatively, а ручное
            переписывание className и textContent быстро вступает в конфликт с React.
          </p>
        </div>

        <div className="rounded-[24px] border border-blue-200 bg-blue-50/80 p-5 text-sm leading-6 text-blue-950">
          {status}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={focusCard}
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Imperatively focus
        </button>
        <button
          type="button"
          onClick={mutateDomManually}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Ручная DOM-мутация
        </button>
        <button
          type="button"
          onClick={handleReactRerender}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          React rerender
        </button>
        <button
          type="button"
          onClick={resetCard}
          className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Сбросить
        </button>
      </div>
    </Panel>
  );
}
