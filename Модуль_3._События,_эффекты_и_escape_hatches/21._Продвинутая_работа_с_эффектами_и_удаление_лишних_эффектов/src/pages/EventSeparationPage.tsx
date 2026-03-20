import { EventsVsEffectsLab } from '../components/advanced-effects/EventsVsEffectsLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildEventSeparationReport, getPublishCount } from '../lib/event-effect-model';
import { getProjectStudy } from '../lib/project-study';

export function EventSeparationPage() {
  const effectDriven = buildEventSeparationReport('effect-driven');
  const eventDriven = buildEventSeparationReport('event-driven');
  const study = getProjectStudy('events');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Разделение событий и эффектов"
        copy="Не каждое побочное действие должно жить в useEffect. Если причина уже произошла как пользовательское событие, логичнее обрабатывать её в handler и не растягивать эту связь на дополнительные renders."
      />

      <div className="grid gap-3 md:grid-cols-2">
        <MetricCard
          label="Effect-driven after 2 edits"
          value={String(getPublishCount('effect-driven', 2))}
          hint={effectDriven.summary}
          tone="accent"
        />
        <MetricCard
          label="Event-driven after 2 edits"
          value={String(getPublishCount('event-driven', 2))}
          hint={eventDriven.summary}
          tone="cool"
        />
      </div>

      <EventsVsEffectsLab />

      <BeforeAfter
        beforeTitle="Когда действие спрятано в effect"
        before="Клик превращается в промежуточный state, а последующие изменения props и form-полей могут снова запускать ту же бизнес-логику."
        afterTitle="Когда действие живёт в event handler"
        after="Причина и следствие остаются рядом: пользовательское событие сразу запускает нужное побочное действие, а effect остаётся только для реальной синхронизации."
      />

      <Panel className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label={effectDriven.title} code={effectDriven.snippet} />
        <CodeBlock label={eventDriven.title} code={eventDriven.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
