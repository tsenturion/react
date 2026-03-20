import { EffectEventLab } from '../components/advanced-effects/EffectEventLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildEffectEventReport,
  getNotificationTheme,
  getReconnectCount,
} from '../lib/effect-event-model';
import { getProjectStudy } from '../lib/project-study';

export function EffectEventPage() {
  const staleTheme = buildEffectEventReport('stale-theme');
  const themeDependency = buildEffectEventReport('theme-dependency');
  const effectEvent = buildEffectEventReport('effect-event');
  const study = getProjectStudy('effect-event');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="useEffectEvent и чтение актуальных значений без лишнего reconnect"
        copy="Иногда внешний callback должен видеть свежие props, но сама синхронизация не должна перезапускаться при каждом их изменении. Это и есть зона useEffectEvent: отделить non-reactive callback от dependencies основного effect-а."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Reconnects after 2 theme changes"
          value={String(getReconnectCount('theme-dependency', 2))}
          hint={themeDependency.summary}
          tone="accent"
        />
        <MetricCard
          label="Stale toast theme"
          value={getNotificationTheme('stale-theme', 'light', 'contrast')}
          hint={staleTheme.summary}
          tone="cool"
        />
        <MetricCard
          label="EffectEvent toast theme"
          value={getNotificationTheme('effect-event', 'light', 'contrast')}
          hint={effectEvent.summary}
          tone="dark"
        />
      </div>

      <EffectEventLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={staleTheme.title} code={staleTheme.snippet} />
        <CodeBlock label={themeDependency.title} code={themeDependency.snippet} />
        <CodeBlock label={effectEvent.title} code={effectEvent.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
