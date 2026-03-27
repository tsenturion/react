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
import { projectStudy } from '../lib/project-study';
import {
  buildSyntaxPlayground,
  syntaxExtraTopics,
  type BindingMode,
  type CaptionState,
} from '../lib/syntax-model';

export function SyntaxPage() {
  const [bindingMode, setBindingMode] = useState<BindingMode>('const');
  const [captionState, setCaptionState] = useState<CaptionState>('filled');
  const [includeMentor, setIncludeMentor] = useState(true);
  const [city, setCity] = useState('Екатеринбург');
  const [extraTopics, setExtraTopics] = useState<string[]>(['closures', 'async/await']);

  const playground = buildSyntaxPlayground({
    bindingMode,
    captionState,
    includeMentor,
    city,
    extraTopics,
  });

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Lab 1"
        title="Синтаксис и выражения, которые реально входят в React-код"
        copy="Здесь видно, как let/const, шаблонные строки, destructuring, spread/rest, optional chaining и nullish coalescing превращаются в читаемую модель данных, а не остаются отдельными синтаксическими трюками."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">{bindingMode}</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              В этой лаборатории одно и то же состояние сразу показывает результат
              выражений и готовый кодовый фрагмент.
            </p>
          </div>
        }
      />

      <Panel className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Выбор binding</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(['const', 'let'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setBindingMode(mode)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      bindingMode === mode
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className="text-sm font-semibold text-slate-800"
                htmlFor="syntax-city"
              >
                Город в шаблонной строке
              </label>
              <input
                id="syntax-city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">Состояние caption</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(['filled', 'empty', 'undefined', 'null'] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCaptionState(value)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      captionState === value
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={includeMentor}
                onChange={(event) => setIncludeMentor(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm leading-6 text-slate-700">
                Добавить `mentor` и проверить, как `optional chaining` ведёт себя при
                наличии или отсутствии вложенного объекта.
              </span>
            </label>

            <div>
              <p className="text-sm font-semibold text-slate-800">Дополнительные темы</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {syntaxExtraTopics.map((topic) => {
                  const active = extraTopics.includes(topic);

                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() =>
                        setExtraTopics((current) =>
                          active
                            ? current.filter((item) => item !== topic)
                            : [...current, topic],
                        )
                      }
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        active
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard
                label="safe mentor"
                value={playground.safeMentor}
                hint="optional chaining + nullish coalescing превращают вложенное поле в безопасное чтение."
              />
              <MetricCard
                label="topics"
                value={String(playground.mergedTopics.length)}
                hint="spread собирает массив тем для интерфейса без ручной конкатенации."
                tone="cool"
              />
            </div>
            <MetricCard
              label="template string"
              value={playground.greeting}
              hint={playground.bindingNote}
              tone="accent"
            />
            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                `||` против `??`
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-rose-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                    Через ||
                  </p>
                  <p className="mt-2 text-sm leading-6 text-rose-950">
                    {playground.captionWithOr || 'пустая строка'}
                  </p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Через ??
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-950">
                    {playground.captionWithNullish === ''
                      ? 'пустая строка сохранена'
                      : playground.captionWithNullish}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CodeBlock label="generated syntax preview" code={playground.codePreview} />

        <div className="grid gap-6 lg:grid-cols-2">
          <ListBlock
            title="Что выражает текущая модель"
            items={[
              `Первый topic из destructuring: ${playground.firstTopic}`,
              `Остальные темы через rest: ${playground.otherTopics.join(', ') || 'нет'}`,
              `Город из шаблонной строки: ${playground.safeCity}`,
              `Mentor: ${playground.safeMentor}`,
            ]}
          />
          <ListBlock
            title="Типичные ошибки"
            items={[
              'Подменять `??` оператором `||`, когда пустая строка и 0 должны оставаться валидными значениями.',
              'Делать тяжёлые вычисления прямо внутри JSX вместо того, чтобы сначала собрать понятную модель данных.',
              'Использовать `let` по умолчанию там, где переменная не переопределяется.',
            ]}
          />
        </div>
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.syntax.files}
          snippets={projectStudy.syntax.snippets}
        />
      </Panel>
    </div>
  );
}
