import { LocalStateLab } from '../components/state-architecture/LocalStateLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function LocalStatePage() {
  const study = projectStudies.local;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Local state: состояние рядом с местом использования"
        copy="Local state нужен там, где данные принадлежат одной небольшой ветке интерфейса: раскрытие, временный черновик, выделение внутри карточки, локальный input. Как только такое состояние поднимается слишком высоко, независимые части UI начинают влиять друг на друга без причины."
      />

      <Panel>
        <LocalStateLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Лучший сигнал"
          value="Эфемерность"
          hint="Незавершённый ввод и локальное раскрытие редко нужны за пределами одной ветки."
          tone="cool"
        />
        <MetricCard
          label="Типичный сбой"
          value="Leak upward"
          hint="Один поднятый черновик начинает протекать в соседние карточки."
          tone="accent"
        />
        <MetricCard
          label="Архитектурный эффект"
          value="Меньше связей"
          hint="Состояние остаётся рядом с тем UI, который действительно зависит от него."
        />
      </div>

      <Panel>
        <BeforeAfter
          beforeTitle="Если поднять состояние слишком высоко"
          before="Независимые карточки внезапно делят один и тот же draft, а локальная правка начинает менять соседние блоки."
          afterTitle="Если оставить состояние локальным"
          after="Каждая карточка управляет только своим временным вводом, не создавая скрытой связи с остальным экраном."
        />
      </Panel>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
