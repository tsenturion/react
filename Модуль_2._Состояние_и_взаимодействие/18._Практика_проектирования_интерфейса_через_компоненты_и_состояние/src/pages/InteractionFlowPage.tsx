import { InteractionLoopLab } from '../components/interface-practice/InteractionLoopLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildFlowEntry } from '../lib/interaction-flow-model';
import { getProjectStudy } from '../lib/project-study';

export function InteractionFlowPage() {
  const entry = buildFlowEntry('select', {
    query: '',
    activeTrack: 'all',
    selectedTitle: 'Архитектура состояния',
    visibleCount: 4,
    favoriteCount: 2,
    draftLength: 72,
  });
  const study = getProjectStudy('flow');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Как действие пользователя превращается в state, render и визуальный результат"
        copy="Хороший mini-demo не просто меняет цифры. Он даёт увидеть сам цикл: пользовательское действие вызывает обработчик, обработчик меняет state, React пересчитывает derived values и уже потом экран показывает новый результат."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Action"
          value="event handler"
          hint={entry.actionLine}
          tone="cool"
        />
        <MetricCard label="State" value="single update path" hint={entry.stateLine} />
        <MetricCard
          label="UI result"
          value="rendered consequence"
          hint={entry.visualLine}
          tone="accent"
        />
      </div>

      <InteractionLoopLab />

      <Panel className="grid gap-4 lg:grid-cols-2">
        <CodeBlock label="Action step" code={entry.actionLine} />
        <CodeBlock label="Render step" code={entry.renderLine} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
