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
import { buildModulePlayground, moduleGoals, type ModuleGoal } from '../lib/module-model';
import { projectStudy } from '../lib/project-study';

export function ModulesPage() {
  const [goal, setGoal] = useState<ModuleGoal>('modules');
  const [readyOnly, setReadyOnly] = useState(true);
  const [limit, setLimit] = useState(4);

  const view = buildModulePlayground({ goal, readyOnly, limit });

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Lab 2"
        title="ES-модули, import/export и распределение ответственности по файлам"
        copy="Здесь import/export не обсуждаются абстрактно: страница сама опирается на named exports, default export и отдельные модули с данными, чтобы показать, как устроен контракт между файлами."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">esm</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Модуль с карточками уроков импортируется и как источник данных, и как набор
              helper-функций.
            </p>
          </div>
        }
      />

      <Panel className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Цель импорта</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {moduleGoals.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setGoal(item)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      goal === item
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={readyOnly}
                onChange={(event) => setReadyOnly(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm leading-6 text-slate-700">
                Оставить только `ready`-элементы и посмотреть, как один и тот же module
                contract работает для разного набора данных.
              </span>
            </label>

            <div>
              <label
                className="text-sm font-semibold text-slate-800"
                htmlFor="module-limit"
              >
                Сколько элементов забрать из модуля: {limit}
              </label>
              <input
                id="module-limit"
                type="range"
                min={2}
                max={6}
                value={limit}
                onChange={(event) => setLimit(Number(event.target.value))}
                className="mt-2 w-full accent-blue-600"
              />
            </div>

            <CodeBlock label="import preview" code={view.importPreview} />
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard
                label="visible exports"
                value={String(view.visibleLessons.length)}
                hint="Столько карточек проходит через named export с массивом данных."
              />
              <MetricCard
                label="recommended"
                value={view.recommendedLesson?.title ?? 'нет совпадения'}
                hint="default export выбирает рекомендацию по цели модуля."
                tone="accent"
              />
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что вернул модуль
              </p>
              <div className="mt-3 space-y-3">
                {view.summary.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ListBlock
            title="Где это видно в проекте"
            items={[
              'Данные уроков лежат отдельно от страниц и импортируются сразу несколькими лабораториями.',
              'Default export используется там, где нужен один главный выбор, а named exports там, где нужны данные и helper-функции.',
              'Каждый файл отвечает за свой уровень: данные, вычисления или UI.',
            ]}
          />
          <ListBlock
            title="Типичные ошибки"
            items={[
              'Перепутать default import и named import и получить `undefined` вместо функции.',
              'Смешать данные, бизнес-логику и JSX в одном файле, даже когда они используются в нескольких местах.',
              'Делать большой универсальный модуль без внятного контракта export/import.',
            ]}
          />
        </div>
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.modules.files}
          snippets={projectStudy.modules.snippets}
        />
      </Panel>
    </div>
  );
}
