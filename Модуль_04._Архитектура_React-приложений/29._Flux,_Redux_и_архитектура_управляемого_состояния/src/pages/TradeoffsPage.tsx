import { ReduxOverkillLab } from '../components/redux-architecture/ReduxOverkillLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function TradeoffsPage() {
  const study = projectStudies.tradeoffs;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Когда Redux нужен, а когда становится overkill"
        copy="Централизованный store помогает, только если он остаётся сфокусированным на shared app concerns. Если складывать туда локальные drafts, hover state, URL-параметры и server data без разбора, Redux перестаёт упрощать приложение и начинает размывать границы ответственности."
      />

      <Panel>
        <ReduxOverkillLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Нормальный store"
          value="Focused"
          hint="Shared app concerns дают store ясную роль и понятный набор действий."
          tone="cool"
        />
        <MetricCard
          label="Лишний store"
          value="Everything"
          hint="Если store начинает владеть всем подряд, читать и поддерживать его становится сложнее, чем исходный UI."
        />
        <MetricCard
          label="Главный trade-off"
          value="Scope control"
          hint="Польза Redux зависит не только от выбора библиотеки, но и от того, что именно вы в него кладёте."
          tone="accent"
        />
      </div>

      <Panel>
        <BeforeAfter
          beforeTitle="Если один store собирает всё подряд"
          before="Локальные детали интерфейса, URL-состояние и серверные данные смешиваются с app-level coordination и усложняют любой селектор или action."
          afterTitle="Если centralized layer остаётся узким"
          after="Redux отвечает только за действительно общие transitions, а локальные, URL- и server concerns остаются в своих естественных слоях."
        />
      </Panel>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
