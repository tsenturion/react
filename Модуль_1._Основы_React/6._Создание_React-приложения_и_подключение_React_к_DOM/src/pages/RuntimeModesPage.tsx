import { useState } from 'react';

import {
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudy } from '../lib/project-study';
import { compareRuntimeModes } from '../lib/runtime-mode-model';
import type { RuntimeMode } from '../lib/strict-mode-model';

export function RuntimeModesPage() {
  const [mode, setMode] = useState<RuntimeMode>('development');
  const [strictMode, setStrictMode] = useState(true);
  const [hmrEnabled, setHmrEnabled] = useState(true);
  const [optimizedBundle, setOptimizedBundle] = useState(false);

  const scenario = compareRuntimeModes({
    mode,
    strictMode,
    hmrEnabled,
    optimizedBundle,
  });

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Development vs Production"
        title="Почему dev и production ведут себя по-разному"
        copy="React и Vite дают два разных рабочих режима. Development нужен для быстрой итерации и диагностики, production — для финального пользовательского runtime. Ниже можно менять характеристики режима и смотреть, что именно меняется на практике."
        aside={
          <div className="space-y-3">
            <StatusPill tone={scenario.tone}>{mode}</StatusPill>
            <p className="text-sm leading-6 text-slate-600">{scenario.visibleOutcome}</p>
          </div>
        }
      />

      <Panel className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ToggleCard
          title="Режим"
          checked={mode === 'development'}
          onLabel="development"
          offLabel="production"
          onToggle={(checked) => setMode(checked ? 'development' : 'production')}
        />
        <ToggleCard
          title="StrictMode"
          checked={strictMode}
          onLabel="включён"
          offLabel="выключен"
          onToggle={setStrictMode}
        />
        <ToggleCard
          title="HMR"
          checked={hmrEnabled}
          onLabel="доступен"
          offLabel="отключён"
          onToggle={setHmrEnabled}
        />
        <ToggleCard
          title="Optimized bundle"
          checked={optimizedBundle}
          onLabel="да"
          offLabel="нет"
          onToggle={setOptimizedBundle}
        />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Current runtime"
          value={mode}
          hint="От этого зависит, есть ли dev-only checks и какой именно артефакт исполняется."
          tone="accent"
        />
        <MetricCard
          label="HMR"
          value={hmrEnabled ? 'Активен' : 'Нет'}
          hint="Горячая замена модулей нужна для итерации, а не для production-доставки."
          tone="cool"
        />
        <MetricCard
          label="Bundle"
          value={optimizedBundle ? 'Оптимизирован' : 'Почти debug'}
          hint="Production-сборка не должна оцениваться по тем же ожиданиям, что и dev-server."
          tone="dark"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <ListBlock
            title="Что означает текущая комбинация"
            items={scenario.togglesMeaning}
          />
        </Panel>
        <Panel>
          <ListBlock title="Ключевые различия режимов" items={scenario.differences} />
        </Panel>
      </div>

      <Panel>
        <ListBlock title="Частые ошибки интерпретации" items={scenario.mistakes} />
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.runtime.files}
          snippets={projectStudy.runtime.snippets}
        />
      </Panel>
    </div>
  );
}

function ToggleCard({
  title,
  checked,
  onLabel,
  offLabel,
  onToggle,
}: {
  title: string;
  checked: boolean;
  onLabel: string;
  offLabel: string;
  onToggle: (next: boolean) => void;
}) {
  return (
    <label className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <span className="text-sm font-semibold text-slate-800">{title}</span>
      <span className="mt-4 flex items-center gap-3 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onToggle(event.target.checked)}
        />
        {checked ? onLabel : offLabel}
      </span>
    </label>
  );
}
