import { BasicStateCard } from '../components/state/BasicStateCard';
import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildBasicStateReport, type BasicCardState } from '../lib/basic-state-model';
import { getProjectStudy } from '../lib/project-study';

const starterState: BasicCardState = {
  likes: 12,
  bookmarked: false,
  expanded: true,
};

export function StateIntroPage() {
  const report = buildBasicStateReport(starterState);
  const study = getProjectStudy('intro');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Что такое state и как `useState` меняет UI"
        copy="State нужен там, где интерфейс должен запоминать что-то между рендерами: счётчик, закладку, открытый блок, выбранный режим. Здесь можно менять локальное состояние карточки и сразу видеть, как один и тот же компонент переходит в другое визуальное состояние."
      />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Panel className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Что важно заметить</h2>
          <ListBlock
            title="Базовая модель"
            items={[
              '`useState` создаёт локальную память компонента.',
              'Текущее значение читается в рендере, а кнопки и события только планируют следующее.',
              'Один компонент может хранить несколько независимых state-срезов.',
            ]}
          />
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Хранимых значений"
              value="3"
              hint="Лайки, закладка и видимость блока живут как отдельные state-срезы."
              tone="cool"
            />
            <MetricCard
              label="Хук"
              value="useState"
              hint="Именно он связывает пользовательское действие и новый UI рендер."
            />
            <MetricCard
              label="Роль"
              value={report.reactionLabel}
              hint={report.summary}
              tone="accent"
            />
          </div>

          <BasicStateCard />
          <CodeBlock label="Базовый набор state" code={report.snippet} />
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
