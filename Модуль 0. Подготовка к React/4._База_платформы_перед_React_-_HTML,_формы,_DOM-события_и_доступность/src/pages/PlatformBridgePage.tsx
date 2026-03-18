import { useState } from 'react';

import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  bridgeScenarios,
  getBridgeScenario,
  type BridgeScenarioId,
} from '../lib/platform-bridge-model';
import { projectStudy } from '../lib/project-study';

export function PlatformBridgePage() {
  const [activeScenarioId, setActiveScenarioId] = useState<BridgeScenarioId>('forms');
  const [showFailure, setShowFailure] = useState(false);

  const scenario = getBridgeScenario(activeScenarioId, showFailure);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Lab 6"
        title="Почему понимание платформы критично уже на React-уровне"
        copy="Эта лаборатория связывает нативную модель браузера с тем, что позже встречается в React: формы, client-side navigation, обработчики событий, refs и тесты. Здесь можно переключать сценарий и сразу видеть, какой platform contract он опирается."
        aside={
          <div className="space-y-3">
            <StatusPill tone={scenario.statusTone}>{scenario.label}</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              React не отменяет HTML, DOM, focus и accessible names. Он строится поверх
              них и наследует их ограничения.
            </p>
          </div>
        }
      />

      <Panel className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {bridgeScenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveScenarioId(item.id)}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                activeScenarioId === item.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={showFailure}
            onChange={(event) => setShowFailure(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
          />
          <span className="text-sm leading-6 text-slate-700">
            Показывать не нормальный контракт, а то, что ломается, если базу платформы
            игнорировать.
          </span>
        </label>

        <div className="grid gap-4 lg:grid-cols-3">
          <MetricCard
            label="platform layer"
            value={scenario.platformLayer}
            hint="Какой нативный слой лежит под этим React use-case."
          />
          <MetricCard
            label="react layer"
            value={scenario.reactLayer}
            hint="Где этот платформенный слой проявится дальше в React-приложении."
            tone="accent"
          />
          <MetricCard
            label="mode"
            value={showFailure ? 'failure mode' : 'platform contract'}
            hint="Вы смотрите либо устойчивый контракт, либо последствия его нарушения."
            tone="cool"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
          <div className="space-y-4">
            <ListBlock
              title={showFailure ? 'Что ломается' : 'На чём держится сценарий'}
              items={scenario.visibleConsequences}
            />
            <CodeBlock label="bridge code" code={scenario.codePreview} />
          </div>

          <div className="space-y-4">
            <ListBlock
              title="Исходный platform contract"
              items={scenario.nativeContract}
            />
            <ListBlock title="Failure cases" items={scenario.breakage} />
          </div>
        </div>
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.bridge.files}
          snippets={projectStudy.bridge.snippets}
        />
      </Panel>
    </div>
  );
}
