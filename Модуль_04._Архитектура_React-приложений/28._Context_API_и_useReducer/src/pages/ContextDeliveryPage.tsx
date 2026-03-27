import { ContextDeliveryLab } from '../components/context-reducer/ContextDeliveryLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ContextDeliveryPage() {
  const study = projectStudies.context;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Context как слой доставки данных через дерево"
        copy="Context нужен там, где данные должны дойти до глубоких leaf-компонентов, а промежуточные layout-уровни не должны знать ни о значении, ни о setter-функции. Его задача — delivery через дерево, а не автоматическое превращение любого состояния в глобальное."
      />

      <Panel>
        <ContextDeliveryLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Когда помогает"
          value="Deep delivery"
          hint="Далёкие leaf-компоненты получают данные без лишних props на промежуточных уровнях."
          tone="cool"
        />
        <MetricCard
          label="Не заменяет"
          value="Архитектуру"
          hint="Context не отвечает за сложные переходы состояния сам по себе."
        />
        <MetricCard
          label="Главный риск"
          value="Use everywhere"
          hint="Если оборачивать всё подряд, provider перестаёт иметь ясную границу."
          tone="accent"
        />
      </div>

      <Panel>
        <BeforeAfter
          beforeTitle="Если использовать только props"
          before="Глубокие ветки получают нужные данные, но промежуточные layout-компоненты начинают тянуть на себе чужой API."
          afterTitle="Если использовать context по делу"
          after="Доставка уходит в provider layer, а промежуточные компоненты снова отвечают только за layout и композицию."
        />
      </Panel>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
