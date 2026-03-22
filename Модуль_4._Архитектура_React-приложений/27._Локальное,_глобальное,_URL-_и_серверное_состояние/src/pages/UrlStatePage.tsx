import { UrlStateLab } from '../components/state-architecture/UrlStateLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function UrlStatePage() {
  const study = projectStudies.url;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="URL state: состояние, которое должно жить в ссылке"
        copy="URL state нужен там, где экран должен воспроизводиться по ссылке: фильтр, вкладка, текущий режим просмотра, поиск, сортировка. Если оставить такие данные только в памяти компонента, reload, back/forward и shared link перестанут возвращать тот же экран."
      />

      <Panel>
        <UrlStateLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Подходит для"
          value="Filters + view"
          hint="Поиск, активный tab, сортировка и другие shareable настройки экрана."
          tone="cool"
        />
        <MetricCard
          label="Не подходит для"
          value="Private draft"
          hint="Личные черновики и временные локальные детали редко нужно экспортировать в адресную строку."
          tone="accent"
        />
        <MetricCard
          label="Главный эффект"
          value="Повторяемость"
          hint="Reload и переход по ссылке восстанавливают тот же UI, а не случайное локальное состояние."
        />
      </div>

      <Panel>
        <BeforeAfter
          beforeTitle="Если фильтр хранится только локально"
          before="Переход по ссылке и reload теряют текущий экран. Back/forward не могут воспроизвести предыдущее состояние списка."
          afterTitle="Если фильтр хранится в URL"
          after="Экран открывается в нужном режиме по ссылке, а история браузера становится частью нормального UX, а не источником случайных потерь контекста."
        />
      </Panel>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
