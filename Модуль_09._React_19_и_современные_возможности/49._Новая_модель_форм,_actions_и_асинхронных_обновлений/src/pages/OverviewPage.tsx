import { useSearchParams } from 'react-router-dom';

import {
  filterOverviewCardsByFocus,
  parseOverviewFocus,
  type OverviewFocus,
} from '../lib/actions-overview-domain';
import { projectStudyByLab } from '../lib/project-study';
import { BeforeAfter, Panel, ProjectStudy, SectionIntro } from '../components/ui';

const focusOptions: readonly { value: OverviewFocus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'model', label: 'Model' },
  { value: 'state', label: 'State' },
  { value: 'buttons', label: 'Buttons' },
  { value: 'status', label: 'Status' },
  { value: 'workflow', label: 'Workflow' },
] as const;

export function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focus = parseOverviewFocus(searchParams.get('focus'));
  const cards = filterOverviewCardsByFocus(focus);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Actions overview"
        title="Новая модель форм строится вокруг async action, а не вокруг ручного submit-кода"
        copy="В этом уроке форма рассматривается как источник FormData и submit intent. React 19 добавляет action-модель, где pending, validation и разные outcomes можно выражать через структуру самой формы, а не через разрозненные обработчики и useEffect-связки."
        aside={
          <div className="space-y-3 text-sm leading-6 text-slate-600">
            <p>
              Тема раскрывается через реальные формы этого проекта, а не через абстрактные
              псевдокнопки.
            </p>
            <p>
              Каждая лаборатория показывает, какой именно уровень сложности требует plain
              action, useActionState, formAction или useFormStatus.
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
        beforeTitle="Ручная модель submit"
        before="onSubmit, preventDefault, ручной сбор полей, несколько setPending/setError/setSuccess и отдельный useEffect для синхронизации результата."
        afterTitle="Action-модель"
        after="Форма отправляет FormData прямо в action, а returned state, pending и button-specific outcomes выражаются структурой формы и встроенными React 19 API."
      />

      <ProjectStudy
        files={projectStudyByLab.overview.files}
        snippets={projectStudyByLab.overview.snippets}
      />
    </div>
  );
}
