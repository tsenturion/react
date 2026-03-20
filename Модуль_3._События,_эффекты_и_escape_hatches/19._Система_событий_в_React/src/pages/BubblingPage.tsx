import { BubblingLab } from '../components/react-events/BubblingLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildBubblingReport } from '../lib/bubbling-model';
import { getProjectStudy } from '../lib/project-study';

export function BubblingPage() {
  const naturalBubble = buildBubblingReport('none');
  const stopOnButton = buildBubblingReport('button');
  const stopOnCard = buildBubblingReport('card');
  const study = getProjectStudy('bubbling');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Bubbling и `stopPropagation()`"
        copy="React-события по умолчанию всплывают от target вверх по дереву обработчиков. Это удобно для композиции интерфейса, но важно точно понимать, где событие продолжается дальше, а где его останавливают намеренно."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Bubble path"
          value="target → parent"
          hint={naturalBubble.summary}
          tone="cool"
        />
        <MetricCard
          label="stopPropagation"
          value="локальная граница"
          hint={stopOnButton.summary}
        />
        <MetricCard
          label="Риск"
          value="скрытый click"
          hint="Непродуманный bubbling может случайно запускать карточку, модалку или навигацию выше по дереву."
          tone="accent"
        />
      </div>

      <BubblingLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label="Без остановки" code={naturalBubble.snippet} />
        <CodeBlock label="Стоп на button" code={stopOnButton.snippet} />
        <CodeBlock label="Стоп на card" code={stopOnCard.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
