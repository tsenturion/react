import { useState } from 'react';

import { KeyIdentitySandbox } from '../components/identity/KeyIdentitySandbox';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { buildKeyBugReport } from '../lib/key-bug-model';
import { getProjectStudy } from '../lib/project-study';
import type { KeyStrategy } from '../lib/reconciliation-model';

export function DynamicUiPage() {
  const [strategy, setStrategy] = useState<KeyStrategy>('stable-id');
  const study = getProjectStudy('dynamic-ui');
  const report = buildKeyBugReport(strategy, 'filter-first');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Скрытые баги состояния в динамическом UI"
        copy="Самые неприятные ошибки с `key` проявляются не в статичном списке, а в живом интерфейсе: фильтрация, скрытие элементов, prepend, локальные draft-поля и счётчики. Здесь можно воспроизвести именно такие сценарии."
      />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Panel className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Стратегия key</h2>
          {(['stable-id', 'index', 'random'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStrategy(option)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                strategy === option
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {option}
            </button>
          ))}
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Стратегия key"
              value={strategy}
              hint="С этим ключом фильтрация и reorder будут вести себя по-разному."
              tone={
                strategy === 'stable-id'
                  ? 'cool'
                  : strategy === 'index'
                    ? 'accent'
                    : 'dark'
              }
            />
            <MetricCard
              label="Что проверить"
              value="draft + скрыть закрытые"
              hint="Измените draft в одной строке, затем скройте closed-элементы."
            />
            <MetricCard
              label="Риск для UI"
              value={
                strategy === 'stable-id'
                  ? 'предсказуемо'
                  : strategy === 'index'
                    ? 'дрейф state'
                    : 'сброс state'
              }
              hint="Так проявляется влияние ключей на состояние в реальном интерфейсе."
              tone="accent"
            />
          </div>

          <Panel className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone={report.tone}>{report.title}</StatusPill>
              <p className="text-sm leading-6 text-slate-600">{report.note}</p>
            </div>

            <BeforeAfter
              beforeTitle="Если key плохой"
              before="После фильтрации draft и счётчики начинают относиться уже к другой строке списка или полностью сбрасываются."
              afterTitle="Если key стабильный"
              after="Локальное состояние продолжает жить у того же объекта данных, даже если элемент временно сместился или часть списка скрылась."
            />
          </Panel>

          <KeyIdentitySandbox strategy={strategy} mode="filter" />
          <CodeBlock
            label="Динамический список с локальным state"
            code={`{visibleItems.map((item, index) => (
  <CounterRow
    key=${
      strategy === 'stable-id'
        ? '{item.id}'
        : strategy === 'index'
          ? '{index}'
          : '{Math.random()}'
    }
    item={item}
  />
))}`}
          />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
