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
  buildStrategyPreview,
  createLearningBoard,
  mutateLessonInPlace,
  toggleLessonImmutably,
} from '../lib/immutability-model';
import { projectStudy } from '../lib/project-study';

export function ImmutabilityPage() {
  const [selectedLessonId, setSelectedLessonId] = useState('spread');
  const [brokenBoard, setBrokenBoard] = useState(() => createLearningBoard());
  const [safeBoard, setSafeBoard] = useState(() => createLearningBoard());
  const [forcedRerenderCount, setForcedRerenderCount] = useState(0);

  const preview = buildStrategyPreview(safeBoard, selectedLessonId);

  const runBrokenMutation = () => {
    // Это намеренно неправильный обработчик: он нужен как контролируемая
    // демонстрация того, что React не увидит новую ссылку и может скрыть изменение
    // до следующего постороннего rerender.
    setBrokenBoard((current) => mutateLessonInPlace(current, selectedLessonId));
  };

  const runImmutableUpdate = () => {
    setSafeBoard((current) => toggleLessonImmutably(current, selectedLessonId));
  };

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Lab 6"
        title="Иммутабельность, ссылки и предсказуемость React-состояния"
        copy="Это центральная лаборатория темы: справа и слева один и тот же набор данных обновляется двумя разными стратегиями. Одна мутирует старую ссылку и прячет изменение, вторая создаёт новую структуру и даёт React предсказуемый сигнал на rerender."
        aside={
          <div className="space-y-3">
            <StatusPill tone="error">mutation</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Изменение объекта на месте может проявиться в UI только после постороннего
              rerender и именно этим ломает предсказуемость интерфейса.
            </p>
          </div>
        }
      />

      <Panel className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {safeBoard.lessons.map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              onClick={() => setSelectedLessonId(lesson.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedLessonId === lesson.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lesson.title}
            </button>
          ))}
        </div>

        <BeforeAfter
          beforeTitle="Неправильная стратегия"
          before="Мутация меняет старый объект и возвращает ту же ссылку. React может не показать результат сразу, потому что для него root reference не изменился."
          afterTitle="Правильная стратегия"
          after="Копирование массива и изменённого элемента создаёт новые ссылки. React получает однозначный сигнал, что состояние изменилось, и обновляет интерфейс сразу."
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-4 rounded-[28px] border border-rose-200 bg-rose-50/70 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-rose-950">Скрытая мутация</h2>
                <p className="mt-2 text-sm leading-6 text-rose-900">
                  Нажмите `Мутировать`, затем посмотрите, что интерфейс не обновился.
                  После `Посторонний rerender` изменение внезапно проявится.
                </p>
              </div>
              <MetricCard
                label="forced rerenders"
                value={String(forcedRerenderCount)}
                hint="Эта кнопка нужна только чтобы проявить уже испорченную ссылку."
                tone="accent"
              />
            </div>

            <div className="space-y-3">
              {brokenBoard.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="rounded-2xl border border-rose-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700"
                >
                  <p className="font-semibold text-slate-900">{lesson.title}</p>
                  <p className="mt-1">done: {lesson.done ? 'yes' : 'no'}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={runBrokenMutation}
                className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Мутировать выбранный элемент
              </button>
              <button
                type="button"
                onClick={() => setForcedRerenderCount((current) => current + 1)}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                Посторонний rerender
              </button>
              <button
                type="button"
                onClick={() => {
                  setBrokenBoard(createLearningBoard());
                  setForcedRerenderCount(0);
                }}
                className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Сбросить
              </button>
            </div>
          </div>

          <div className="space-y-4 rounded-[28px] border border-emerald-200 bg-emerald-50/70 p-5">
            <div>
              <h2 className="text-xl font-semibold text-emerald-950">
                Иммутабельное обновление
              </h2>
              <p className="mt-2 text-sm leading-6 text-emerald-900">
                Здесь та же операция создаёт новую структуру данных, поэтому состояние и
                интерфейс меняются сразу и предсказуемо.
              </p>
            </div>

            <div className="space-y-3">
              {safeBoard.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="rounded-2xl border border-emerald-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700"
                >
                  <p className="font-semibold text-slate-900">{lesson.title}</p>
                  <p className="mt-1">done: {lesson.done ? 'yes' : 'no'}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={runImmutableUpdate}
                className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Обновить иммутабельно
              </button>
              <button
                type="button"
                onClick={() => setSafeBoard(createLearningBoard())}
                className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <MetricCard
            label="mutable root"
            value={preview.mutable.sameRoot ? 'same ref' : 'new ref'}
            hint="При мутации корневая ссылка остаётся прежней."
          />
          <MetricCard
            label="immutable root"
            value={preview.immutable.sameRoot ? 'same ref' : 'new ref'}
            hint="При копировании React получает новую корневую ссылку."
            tone="cool"
          />
        </div>

        <ListBlock
          title="Типичные ошибки"
          items={[
            'Мутировать массив или объект из state и возвращать ту же ссылку из setState.',
            'Копировать только верхний объект, но забывать про вложенный массив или элемент, который меняется.',
            'Хранить derived summary отдельно и забывать синхронизировать её с реальным содержимым массива.',
          ]}
        />
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.immutability.files}
          snippets={projectStudy.immutability.snippets}
        />
      </Panel>
    </div>
  );
}
