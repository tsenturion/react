import { useState } from 'react';

import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  analyzeProjectFile,
  projectFileOptions,
  type ProjectFileId,
} from '../lib/learning-model';
import { structureStudy } from '../lib/project-study';

export function StructurePage() {
  const [fileId, setFileId] = useState<ProjectFileId>('main-tsx');

  // Эта лаборатория учит читать проект как систему связанных файлов, а не как
  // случайную папку src. Поэтому активный фокус — это всегда конкретный файл.
  const analysis = analyzeProjectFile(fileId);

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Структура React-проекта: от корня репозитория до страницы"
        copy="Здесь вы выбираете конкретный файл текущего проекта и разбираете его роль в жизненном цикле приложения. Так становится видно, зачем проект разделён на root-файлы, `index.html`, `main`, `App`, `pages`, `lib`, tooling и delivery."
      />

      <Panel>
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Фокус по файлам
            </p>
            <div className="space-y-2">
              {projectFileOptions.map((item) => {
                const active = item.id === analysis.selected.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFileId(item.id)}
                    className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                      active
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-black/10 bg-white/60 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{item.title}</span>
                      <span className="text-[10px] uppercase tracking-[0.18em]">
                        {item.zone}
                      </span>
                    </div>
                    <p
                      className={`mt-2 text-sm leading-6 ${active ? 'text-slate-200' : 'text-slate-500'}`}
                    >
                      {item.path}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[28px] border border-black/10 bg-white/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Текущий файл
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                {analysis.selected.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                <span className="font-semibold">{analysis.selected.path}</span> —{' '}
                {analysis.selected.purpose}
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <MetricCard
                label="Где живёт"
                value={analysis.selected.zone}
                hint="Положение файла в структуре напрямую связано с его ролью в проекте."
                tone="accent"
              />
              <MetricCard
                label="Когда участвует"
                value={analysis.selected.startPhase}
                hint="Устройство проекта читается через момент, в котором файл включается в цепочку запуска."
                tone="cool"
              />
              <MetricCard
                label="Если сломать"
                value={analysis.selected.ifBreaks}
                hint="Такой вопрос хорошо показывает реальную ответственность файла."
                tone="dark"
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
              <CodeBlock
                label="chain"
                code={analysis.selected.chain
                  .map((step, index) => `${index + 1}. ${step}`)
                  .join('\n')}
              />
              <div className="rounded-[24px] border border-black/10 bg-white/65 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Связанные файлы
                </p>
                <div className="mt-4 space-y-3">
                  {analysis.related.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[20px] border border-black/8 bg-white/75 px-4 py-3"
                    >
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.path}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="grid gap-6 xl:grid-cols-2">
        <ListBlock
          title="Типичные ошибки чтения структуры"
          items={analysis.selected.mistakes}
        />
        <ListBlock title="Почему это важно" items={analysis.selected.importance} />
      </Panel>

      <Panel>
        <ProjectStudy files={structureStudy.files} snippets={structureStudy.snippets} />
      </Panel>
    </div>
  );
}
