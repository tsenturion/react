import clsx from 'clsx';
import { useRef, useState } from 'react';

import {
  lessonCards,
  type ScrollBehaviorMode,
  type ScrollBlockMode,
} from '../../lib/ref-domain';
import { describeScrollOptions } from '../../lib/scroll-model';
import { Panel, StatusPill } from '../ui';

export function ScrollLab() {
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeId, setActiveId] = useState(lessonCards[0].id);
  const [behavior, setBehavior] = useState<ScrollBehaviorMode>('smooth');
  const [block, setBlock] = useState<ScrollBlockMode>('center');
  const [status, setStatus] = useState('Пока прокрутка не запускалась.');

  function jumpToCard(id: string) {
    itemRefs.current[id]?.scrollIntoView({
      behavior,
      block,
      inline: 'nearest',
    });
    setActiveId(id);
    setStatus(
      `Прокрутка к "${id}" выполнена с настройками ${describeScrollOptions(behavior, block)}.`,
    );
  }

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">scrollIntoView via refs</StatusPill>
        <span className="text-sm text-slate-500">
          Активный блок: <strong>{activeId}</strong>
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Behavior</span>
          <select
            value={behavior}
            onChange={(event) => setBehavior(event.target.value as ScrollBehaviorMode)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
          >
            <option value="smooth">smooth</option>
            <option value="auto">auto</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Block</span>
          <select
            value={block}
            onChange={(event) => setBlock(event.target.value as ScrollBlockMode)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
          >
            <option value="start">start</option>
            <option value="center">center</option>
            <option value="end">end</option>
            <option value="nearest">nearest</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        {lessonCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => jumpToCard(card.id)}
            className={clsx(
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              activeId === card.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            )}
          >
            {card.title}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-[24px] border border-blue-200 bg-blue-50/80 p-5 text-sm leading-6 text-blue-950">
          {status}
        </div>

        <div className="max-h-[28rem] overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="space-y-4">
            {lessonCards.map((card, index) => (
              <div
                key={card.id}
                ref={(node) => {
                  itemRefs.current[card.id] = node;
                }}
                className={clsx(
                  'rounded-[24px] border px-5 py-5 transition',
                  activeId === card.id
                    ? 'border-blue-400 bg-blue-50/80'
                    : 'border-slate-200 bg-slate-50/70',
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Блок {index + 1}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.summary}</p>
                <div className="mt-4 rounded-2xl border border-white bg-white/80 p-4 text-sm leading-6 text-slate-600">
                  Здесь удобно видеть, что scroll работает по ref конкретного DOM-узла, а
                  не по глобальному querySelector и не по guess-координатам.
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
