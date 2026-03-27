import { useState } from 'react';

import {
  BeforeAfter,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  artifactChecks,
  ecosystemLayers,
  ecosystemReferencePoints,
  ecosystemTasks,
} from '../lib/learning-model';
import { ecosystemStudy } from '../lib/project-study';

export function EcosystemPage() {
  const [taskId, setTaskId] = useState(ecosystemTasks[0].id);
  const [artifactId, setArtifactId] = useState(artifactChecks[1].id);
  const [referencePointId, setReferencePointId] = useState(
    ecosystemReferencePoints[1].id,
  );

  // Страница хранит только выбранные ids, а сами сценарии и артефакты
  // достаются из предметной модели. Так UI остаётся декларативным.
  const task = ecosystemTasks.find((item) => item.id === taskId) ?? ecosystemTasks[0];
  const artifact =
    artifactChecks.find((item) => item.id === artifactId) ?? artifactChecks[0];
  // Эта привязка нужна, чтобы именованные стартовые точки вроде Vite или Next.js
  // читались через ту же карту экосистемы, а не как отдельный "список терминов".
  const referencePoint =
    ecosystemReferencePoints.find((item) => item.id === referencePointId) ??
    ecosystemReferencePoints[0];

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Карта экосистемы React и современного фронтенд-стека"
        copy="Здесь вы перестаёте воспринимать React как изолированную библиотеку. Вы видите реальные роли браузера, DOM, JavaScript, Node.js, npm, Vite, React Router, React Router framework mode, Next.js, full-stack React и Docker."
        aside={
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Результат обучения
            </p>
            <p className="text-sm leading-6 text-slate-700">
              После этой страницы вы ясно видите, где именно выполняется код, почему CRA
              больше не считается базовой отправной точкой и как Vite, React Router
              framework mode и Next.js занимают разные уровни общей системы.
            </p>
          </div>
        }
      />

      <Panel>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Практический сценарий
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
              Что участвует в задаче
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Выберите живую задачу из реальной разработки. Активные слои подсветятся, а
              ниже станет видно, где именно запускается логика и какие ошибки чаще всего
              возникают.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ecosystemTasks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTaskId(item.id)}
                className={`chip ${item.id === task.id ? 'chip-active' : ''}`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
          <div className="rounded-[28px] border border-black/10 bg-white/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Выбранная задача
            </p>
            <h3 className="mt-2 text-lg font-bold text-slate-950">{task.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{task.prompt}</p>

            <div className="mt-5 grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
              {ecosystemLayers.map((layer) => {
                const active = task.activeLayers.includes(layer.id);
                return (
                  <div
                    key={layer.id}
                    className={`rounded-[24px] border p-4 transition ${
                      active
                        ? 'border-slate-950 bg-slate-950 text-white shadow-[0_18px_48px_rgba(15,23,42,0.16)]'
                        : 'border-black/8 bg-white/55 text-slate-500'
                    }`}
                  >
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-base font-semibold leading-6 break-words">
                        {layer.title}
                      </p>
                      <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em]">
                        {layer.zone}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6">{layer.short}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-black/10 bg-slate-950 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Где работает код
              </p>
              <div className="mt-4 space-y-3">
                {task.runtimes.map((runtime) => (
                  <div
                    key={runtime.id}
                    className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-white">{runtime.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      {runtime.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard
                label="Активных слоёв"
                value={String(task.activeLayers.length)}
                hint="Чем лучше карта задачи, тем легче диагностировать, где именно сломалось поведение."
                tone="accent"
              />
              <MetricCard
                label="Рантаймов"
                value={String(task.runtimes.length)}
                hint="Даже одна практическая задача часто проходит через несколько сред выполнения."
                tone="cool"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <BeforeAfter
            beforeTitle="До"
            before={task.before}
            afterTitle="После"
            after={task.after}
          />
          <ListBlock title="Типичные ошибки" items={task.mistakes} />
        </div>
      </Panel>

      <Panel>
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Проверка артефакта
            </p>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">
              Что понимается напрямую, а что требует дополнительного шага
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              Это мини-лаборатория на границу между платформой и toolchain. Именно здесь
              становится ясно, почему современный React почти всегда изучается вместе с
              build-инструментами.
            </p>
            <div className="flex flex-wrap gap-2">
              {artifactChecks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setArtifactId(item.id)}
                  className={`chip ${item.id === artifact.id ? 'chip-active' : ''}`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Кто понимает"
              value={artifact.directOwner}
              hint="Это помогает отличать возможности браузера от возможностей сборщика или контейнера."
              tone="dark"
            />
            <MetricCard
              label="Нужный шаг"
              value={artifact.needsStep}
              hint="Если этот этап пропустить, ошибка проявится либо в transform, либо уже в runtime."
              tone="accent"
            />
            <MetricCard
              label="Практический смысл"
              value={artifact.practice}
              hint="Знание полезно не в теории, а в выборе правильного инструмента под задачу."
              tone="cool"
            />
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Именованные стартовые точки
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
              Где находятся CRA, Vite, React Router framework mode и Next.js
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Здесь вы переключаете реальные инструменты и подходы, которые встречаются в
              документации и проектах. Так становится видно, что CRA, Vite и
              framework-first решения занимают не одно и то же место.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ecosystemReferencePoints.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setReferencePointId(item.id)}
                className={`chip ${item.id === referencePoint.id ? 'chip-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-[28px] border border-black/10 bg-white/60 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Выбранная точка
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                  {referencePoint.label}
                </h3>
              </div>
              <StatusPill tone={referencePoint.tone}>{referencePoint.status}</StatusPill>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              {referencePoint.summary}
            </p>
            <p className="mt-3 rounded-[22px] bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
              {referencePoint.layerNote}
            </p>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Активные слои карты
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {referencePoint.activeLayers.map((layerId) => {
                  const layer = ecosystemLayers.find((item) => item.id === layerId);

                  return (
                    <span
                      key={layerId}
                      className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-medium text-slate-700"
                    >
                      {layer?.title ?? layerId}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <ListBlock
            title="Практическая рамка"
            items={[
              `Когда уместно: ${referencePoint.whenUseful}`,
              `Что не путать: ${referencePoint.watchOut}`,
              'Текущий учебный проект сам намеренно остаётся на стороне Vite SPA, чтобы client-side pipeline было видно без скрытого framework-слоя.',
            ]}
          />
        </div>
      </Panel>

      <Panel className="grid gap-6 xl:grid-cols-2">
        <ListBlock title="Почему это важно" items={task.whyItMatters} />
        <ListBlock
          title="Короткий практический вывод"
          items={[
            'React сам по себе не заменяет браузер, Node.js, npm и сборщик. Он живёт внутри большей системы.',
            'Современный frontend-стек важен не ради моды, а потому что он закрывает реальные инженерные задачи: transform, deps, build, routing, delivery.',
            'CRA полезно знать как часть истории экосистемы, но современную стартовую картину здесь задают Vite и framework-first решения.',
            'Понимание этой карты нужно до изучения JSX, state и hooks, иначе многие ошибки будут казаться случайными.',
          ]}
        />
      </Panel>

      <Panel>
        <ProjectStudy files={ecosystemStudy.files} snippets={ecosystemStudy.snippets} />
      </Panel>
    </div>
  );
}
