import { NeedEffectLab } from '../components/effects/NeedEffectLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildEffectNeedReport } from '../lib/effect-need-model';
import { getProjectStudy } from '../lib/project-study';

export function NeedEffectPage() {
  const derived = buildEffectNeedReport('derived-value');
  const titleSync = buildEffectNeedReport('document-title');
  const timer = buildEffectNeedReport('timer');
  const study = getProjectStudy('need');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="useEffect нужен не для всего, что происходит после render"
        copy="Главный вопрос здесь не «нужен ли код после render», а «есть ли внешняя система, с которой надо синхронизироваться». Если внешней системы нет, effect чаще всего лишний и вместо пользы создаёт второй источник истины."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Без effect"
          value="derived value"
          hint={derived.summary}
          tone="cool"
        />
        <MetricCard
          label="С effect"
          value="document / timer"
          hint="Заголовок документа, таймеры, подписки и запросы относятся к внешнему миру и требуют синхронизации."
        />
        <MetricCard
          label="Главный риск"
          value="лишний state"
          hint="Когда вычисление переносится в effect, легко получить drift, пропущенную зависимость и повторение уже имеющихся данных."
          tone="accent"
        />
      </div>

      <NeedEffectLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={derived.title} code={derived.snippet} />
        <CodeBlock label={titleSync.title} code={titleSync.snippet} />
        <CodeBlock label={timer.title} code={timer.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
