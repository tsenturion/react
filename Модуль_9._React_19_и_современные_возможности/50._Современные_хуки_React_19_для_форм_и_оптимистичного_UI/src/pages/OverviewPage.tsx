import { useSearchParams } from 'react-router-dom';

import {
  filterOverviewCardsByFocus,
  parseOverviewFocus,
  type OverviewFocus,
} from '../lib/modern-hooks-overview-domain';
import { projectStudyByLab } from '../lib/project-study';
import { BeforeAfter, Panel, ProjectStudy, SectionIntro } from '../components/ui';

const focusOptions: readonly { value: OverviewFocus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'action-state', label: 'useActionState' },
  { value: 'status', label: 'useFormStatus' },
  { value: 'optimistic', label: 'useOptimistic' },
  { value: 'ux', label: 'Pending / Result UX' },
  { value: 'architecture', label: 'Architecture' },
] as const;

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterOverviewCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Hooks overview"
        title="React 19 form hooks переносят async UX ближе к самой форме"
        copy="В этом уроке форма рассматривается как самостоятельная модель async действия. useActionState возвращает следующий state submit, useFormStatus даёт nearest-form snapshot, а useOptimistic позволяет показать ожидаемый результат до server confirmation."
        aside={
          <div className="space-y-3 text-sm leading-6 text-slate-600">
            <p>
              Здесь важно не просто увидеть новые API, а понять границы между pending,
              error, optimistic overlay и подтверждённым сервером результатом.
            </p>
            <p>
              Все сценарии урока построены как живые формы, которые действительно
              отправляют данные и меняют UI в зависимости от исхода async действия.
            </p>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {focusOptions.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.set('focus', item.value);
              setSearchParams(next);
            }}
            className={focus === item.value ? 'chip chip-active' : 'chip'}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((item) => (
          <Panel key={item.id} className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="text-sm leading-6 text-slate-600">{item.summary}</p>
          </Panel>
        ))}
      </div>

      <BeforeAfter
        beforeTitle="Ручная orchestration-модель"
        before="Отдельные setPending, setError, setSuccess, внешние loading-флаги для кнопки и отдельная логика, которая пытается синхронизировать optimistic UI с серверным ответом."
        afterTitle="React 19 hooks model"
        after="Форма получает returned state через useActionState, ближайшие дочерние элементы читают pending через useFormStatus, а useOptimistic накладывает локальный мгновенный overlay поверх подтверждённого server state."
      />

      <ProjectStudy
        files={projectStudyByLab.overview.files}
        snippets={projectStudyByLab.overview.snippets}
      />
    </div>
  );
}
