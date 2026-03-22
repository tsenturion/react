import { IntegratedArchitectureLab } from '../components/state-architecture/IntegratedArchitectureLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ArchitecturePage() {
  const study = projectStudies.architecture;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Общая архитектура: local, global, URL и server state в одном экране"
        copy="Финальный экран нужен, чтобы увидеть причинно-следственную связь целиком. Один и тот же интерфейс одновременно использует local draft, global preferences, URL filters и server data. Устойчивость здесь появляется не от количества hooks, а от того, что каждый слой делает только свою работу."
      />

      <Panel>
        <IntegratedArchitectureLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Сильная сторона"
          value="Разделение ролей"
          hint="Каждый слой знает свою ответственность и не подменяет соседний."
          tone="cool"
        />
        <MetricCard
          label="Если всё смешать"
          value="Drift + noise"
          hint="Сложнее объяснить, почему сломался reload, refetch, shared link или локальный draft."
          tone="accent"
        />
        <MetricCard
          label="Практический эффект"
          value="Проще отладка"
          hint="Понятно, где искать проблему: в локальной ветке, в общем store, в URL или в серверном слое."
        />
      </div>

      <Panel>
        <BeforeAfter
          beforeTitle="Если хранить всё в одном слое"
          before="URL-параметры, server data, temporary drafts и глобальные preferences начинают конкурировать в одном месте, а экран становится шумным и непредсказуемым."
          afterTitle="Если разделить виды состояния по ролям"
          after="Каждый слой отражает собственную природу данных: local для временных деталей, global для shared preferences, URL для shareable view и server для внешнего источника истины."
        />
      </Panel>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
