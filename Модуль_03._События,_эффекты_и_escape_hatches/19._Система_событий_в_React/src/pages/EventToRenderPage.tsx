import { EventToRenderLab } from '../components/react-events/EventToRenderLab';
import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { createEventLessons } from '../lib/event-domain';
import { buildEventFlowSnapshot } from '../lib/event-flow-model';
import { getProjectStudy } from '../lib/project-study';

export function EventToRenderPage() {
  const initialLessons = createEventLessons();
  const snapshot = buildEventFlowSnapshot({
    onlyUnhandled: false,
    selectedId: initialLessons[0]?.id ?? null,
    lessons: initialLessons,
  });
  const study = getProjectStudy('flow');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Одно действие пользователя запускает целую цепочку обновления UI"
        copy="В React событие не меняет DOM вручную. Оно меняет state, React запускает новый render, а интерфейс собирается заново уже из обновлённых данных. Поэтому самый важный навык здесь: видеть полную цепочку `event → state → rerender → visual result`."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Trigger"
          value="user event"
          hint="Нажатие кнопки или изменение поля становится входом для логики обновления."
          tone="cool"
        />
        <MetricCard
          label="State"
          value={`${snapshot.handledCount} handled`}
          hint="State описывает факты, а не готовый DOM. После события React перечитывает именно его."
        />
        <MetricCard
          label="UI"
          value={`${snapshot.visibleCount} visible`}
          hint="Видимые элементы вычисляются заново от state, а не меняются пошаговыми DOM-операциями."
          tone="accent"
        />
      </div>

      <EventToRenderLab />

      <Panel className="grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <ListBlock
          title="Как читать цепочку"
          items={[
            'Событие пользователя приходит в handler.',
            'Handler вычисляет next state и вызывает setState.',
            'React запускает новый render с обновлёнными данными.',
            'UI перестраивается как следствие новых данных, а не ручного патча DOM.',
          ]}
        />
        <CodeBlock label="State to render" code={snapshot.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
