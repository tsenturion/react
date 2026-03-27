import { useState } from 'react';

import {
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  createClosureActionPack,
  evaluateClosureScenario,
  type ClosureAction,
} from '../lib/closure-model';
import { formatMinutes } from '../lib/common';
import { projectStudy } from '../lib/project-study';

export function ClosuresPage() {
  const [draftBonus, setDraftBonus] = useState(4);
  const [log, setLog] = useState<string[]>([]);
  // Набор функций хранится в state специально: так можно менять draftBonus отдельно
  // и видеть, что уже созданные closures продолжают держать старое значение.
  const [actions, setActions] = useState<ClosureAction[]>(() =>
    createClosureActionPack(4),
  );

  const comparison = evaluateClosureScenario({
    initialBonus: actions[0]?.capturedBonus ?? draftBonus,
    currentBonus: draftBonus,
    baseDuration: 20,
  });

  const regeneratePack = () => {
    setActions(createClosureActionPack(draftBonus));
    setLog([]);
  };

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Lab 4"
        title="Closures и то, как обработчики запоминают окружение"
        copy="Здесь можно отдельно менять draft-значение и отдельно пересоздавать набор функций. Так становится видно, что closure не читает новое число магически, а удерживает то окружение, в котором была создана функция."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">closure</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Это один из ключевых мостов между обычным JavaScript и поведением React
              обработчиков.
            </p>
          </div>
        }
      />

      <Panel className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-4">
            <div>
              <label
                className="text-sm font-semibold text-slate-800"
                htmlFor="closure-range"
              >
                Draft bonus: {draftBonus}
              </label>
              <input
                id="closure-range"
                type="range"
                min={2}
                max={12}
                value={draftBonus}
                onChange={(event) => setDraftBonus(Number(event.target.value))}
                className="mt-2 w-full accent-blue-600"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={regeneratePack}
                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Создать новый action pack
              </button>
              <button
                type="button"
                onClick={() => setLog([])}
                className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Очистить лог
              </button>
            </div>

            <div className="grid gap-3">
              {actions.map((action) => (
                <div
                  key={action.id}
                  className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {action.label}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Этот обработчик запомнил bonus = {action.capturedBonus}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setLog((current) => [action.run(), ...current].slice(0, 6))
                      }
                      className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Запустить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard
                label="captured bonus"
                value={String(actions[0]?.capturedBonus ?? 0)}
                hint="Первый handler удерживает значение из момента генерации."
              />
              <MetricCard
                label="current draft"
                value={String(draftBonus)}
                hint="Эта цифра пока не влияет на старые функции."
                tone="accent"
              />
            </div>
            <MetricCard
              label="snapshot vs mutable"
              value={`${formatMinutes(comparison.snapshotDuration)} / ${formatMinutes(comparison.mutableDuration)}`}
              hint={comparison.note}
              tone="cool"
            />
            <ListBlock
              title="Лог запусков"
              items={
                log.length > 0
                  ? log
                  : [
                      'Пока пусто. Нажмите кнопку у любого action, чтобы увидеть captured value в действии.',
                    ]
              }
            />
            <ListBlock
              title="Типичные ошибки"
              items={[
                'Ожидать, что уже созданный callback начнёт использовать новое значение без пересоздания.',
                'Путать closure со случайным кэшем: функция читает ровно то окружение, которое было у неё при создании.',
                'Использовать общий mutable object там, где нужен предсказуемый snapshot значения.',
              ]}
            />
          </div>
        </div>
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.closures.files}
          snippets={projectStudy.closures.snippets}
        />
      </Panel>
    </div>
  );
}
