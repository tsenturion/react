import { useState } from 'react';

import { LessonCatalogView } from '../components/lists/LessonCatalogView';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildListSurface, defaultListState, type ListState } from '../lib/list-model';
import { getProjectStudy } from '../lib/project-study';

const selectControls: readonly {
  key: 'track' | 'status' | 'sort';
  label: string;
  options: readonly { value: string; label: string }[];
}[] = [
  {
    key: 'track',
    label: 'Направление',
    options: [
      { value: 'all', label: 'Все' },
      { value: 'core', label: 'База React' },
      { value: 'patterns', label: 'Паттерны' },
      { value: 'testing', label: 'Тестирование' },
    ],
  },
  {
    key: 'status',
    label: 'Статус',
    options: [
      { value: 'all', label: 'Все' },
      { value: 'open', label: 'Открыт' },
      { value: 'draft', label: 'Черновик' },
      { value: 'archived', label: 'Архив' },
    ],
  },
  {
    key: 'sort',
    label: 'Сортировка',
    options: [
      { value: 'title', label: 'По названию' },
      { value: 'duration', label: 'По длительности' },
      { value: 'seats', label: 'По свободным местам' },
    ],
  },
] as const;

export function ListRenderingPage() {
  const [state, setState] = useState<ListState>(defaultListState);
  const surface = buildListSurface(state);
  const study = getProjectStudy('lists');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Рендер списков из данных"
        copy="React не нуждается в ручном создании каждой карточки по шагам. Данные проходят через фильтрацию и `map(...)`, после чего JSX описывает новый список целиком."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Фильтры списка</h2>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Поиск</span>
            <input
              value={state.query}
              onChange={(event) =>
                setState((current) => ({ ...current, query: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              placeholder="Например, key"
            />
          </label>

          {selectControls.map((control) => (
            <label key={control.key} className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">{control.label}</span>
              <select
                value={state[control.key]}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    [control.key]: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3"
              >
                {control.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ))}

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium">Только с live review</span>
            <input
              type="checkbox"
              checked={state.withLiveReviewOnly}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  withLiveReviewOnly: event.target.checked,
                }))
              }
            />
          </label>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Отрисовано"
              value={String(surface.items.length)}
              hint="Столько карточек дошло до `map(...)` после текущих фильтров."
              tone="cool"
            />
            <MetricCard
              label="Направление"
              value={String(state.track === 'all' ? 'все' : state.track)}
              hint="Один prop фильтра сразу меняет всю отрисовку списка."
            />
            <MetricCard
              label="Сортировка"
              value={String(state.sort)}
              hint="Порядок элементов тоже часть итогового UI."
              tone="accent"
            />
          </div>

          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Итог</h2>
            <p className="text-sm leading-6 text-slate-600">{surface.summary}</p>
          </Panel>

          <LessonCatalogView surface={surface} />
          <CodeBlock label="Список через map(...)" code={surface.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
