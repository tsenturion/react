import { SubscriptionLab } from '../components/effects/SubscriptionLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildSubscriptionReport } from '../lib/effect-subscription-model';
import { getProjectStudy } from '../lib/project-study';

export function SubscriptionPage() {
  const safe = buildSubscriptionReport('cleanup');
  const unsafe = buildSubscriptionReport('no-cleanup');
  const study = getProjectStudy('subscriptions');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Подписки и внешние API"
        copy="Когда компонент подключается к socket, emitter, browser listener или другому imperative API, useEffect управляет жизненным циклом этой связи. Важно не просто подписаться, а гарантированно снять старую подписку в cleanup."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="External source"
          value="hub / listener"
          hint="Источник сообщений существует отдельно от React и присылает пакеты по своему lifecycle."
          tone="cool"
        />
        <MetricCard label="One active subscription" value="cleanup" hint={safe.summary} />
        <MetricCard
          label="Без cleanup"
          value="double packets"
          hint={unsafe.summary}
          tone="accent"
        />
      </div>

      <SubscriptionLab />

      <Panel className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label={safe.title} code={safe.snippet} />
        <CodeBlock label={unsafe.title} code={unsafe.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
