import { ListConsistencyLab } from '../components/mutations/ListConsistencyLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ListPage() {
  const study = projectStudies.list;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Согласованность списка при optimistic add/delete"
        copy="Когда мутация меняет структуру списка, цена ошибки выше: появляются временные id, rollback удаления и риск потерять запись визуально, хотя сервер её не удалил."
      />

      <Panel>
        <ListConsistencyLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Без работы с temp id и rollback"
        before="Список начинает дублировать записи, терять элементы или оставаться в состоянии, которое сервер никогда не подтверждал."
        afterTitle="С правильной mutation-моделью"
        after="Временная запись живёт ровно до server confirm, а неуспешное удаление возвращает список к подтверждённой структуре."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Optimistic add"
          value="Temp id first"
          hint="Клиенту нужен временный id, чтобы отрисовать новую запись сразу."
          tone="cool"
        />
        <MetricCard
          label="Server confirm"
          value="Replace temp"
          hint="После ответа сервера временный id должен уступить место реальному id."
        />
        <MetricCard
          label="Delete failure"
          value="Rollback list"
          hint="Если сервер не удалил запись, она обязана вернуться в список."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
