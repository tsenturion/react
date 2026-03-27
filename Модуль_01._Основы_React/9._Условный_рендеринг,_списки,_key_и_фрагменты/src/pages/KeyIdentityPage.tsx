import { useState } from 'react';

import { KeyIdentitySandbox } from '../components/identity/KeyIdentitySandbox';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import type { KeyStrategy } from '../lib/reconciliation-model';
import { getProjectStudy } from '../lib/project-study';

export function KeyIdentityPage() {
  const [strategy, setStrategy] = useState<KeyStrategy>('stable-id');
  const study = getProjectStudy('keys');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="key как идентичность элемента"
        copy="`key` нужен не для подавления предупреждения, а для сохранения связи между компонентом и конкретной сущностью данных. Здесь это видно через локальное состояние строк списка."
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
              hint="Стратегия определяет, как React связывает старый и новый элемент списка."
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
              value="Счётчик + reverse"
              hint="Увеличьте счётчик у строки и затем поменяйте порядок списка."
            />
            <MetricCard
              label="Ожидаемое поведение"
              value={
                strategy === 'stable-id'
                  ? 'state остаётся'
                  : strategy === 'index'
                    ? 'state смещается'
                    : 'state сбрасывается'
              }
              hint="Эта разница и показывает реальную роль `key`."
              tone="accent"
            />
          </div>

          <KeyIdentitySandbox strategy={strategy} mode="reorder" />
          <CodeBlock
            label="Типичный key в map(...)"
            code={`{items.map((item, index) => <Row key={${
              strategy === 'stable-id'
                ? 'item.id'
                : strategy === 'index'
                  ? 'index'
                  : 'Math.random()'
            }} item={item} />)}`}
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
