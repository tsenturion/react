import { RefactorHookLab } from '../components/custom-hooks/RefactorHookLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function RefactorPage() {
  const study = projectStudies.refactor;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Как hook убирает шум из компонента"
        copy="Иногда custom hook нужен не ради самого факта переиспользования, а ради ясности. Если компонент тонет в полях, ошибках, preview, reset-логике и derived state, hook помогает превратить шум в читаемую модель."
      />

      <Panel className="space-y-6">
        <BeforeAfter
          beforeTitle="До выделения hook-а"
          before="Состояние формы, validation, preview и обработчики размазаны по компоненту. JSX читает слишком много технических деталей."
          afterTitle="После выделения hook-а"
          after="Компонент получает единый draft, errors, preview и набор команд. Поведение по-прежнему на месте, но экран уже читает готовую модель."
        />
      </Panel>

      <Panel>
        <RefactorHookLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Цель hook-а"
          value="Сделать модель видимой"
          hint="Hook не прячет смысл, а наоборот делает структуру компонента прозрачнее."
          tone="cool"
        />
        <MetricCard
          label="Риск"
          value="Спрятать весь хаос"
          hint="Если hook просто переносит неупорядоченную бизнес-логику в другой файл, улучшения не произошло."
          tone="accent"
        />
        <MetricCard
          label="Практика"
          value="Form workflow"
          hint="Поля, ошибки и preview остаются синхронны без ручного дублирования вычислений."
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
