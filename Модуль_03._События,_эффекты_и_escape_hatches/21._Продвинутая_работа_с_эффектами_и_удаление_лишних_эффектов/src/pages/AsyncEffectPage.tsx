import { AsyncInsideEffectLab } from '../components/advanced-effects/AsyncInsideEffectLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildAsyncEffectReport } from '../lib/async-effect-model';
import { getProjectStudy } from '../lib/project-study';

export function AsyncEffectPage() {
  const correct = buildAsyncEffectReport('correct');
  const wrong = buildAsyncEffectReport('wrong-callback');
  const mixed = buildAsyncEffectReport('mixed-business-logic');
  const study = getProjectStudy('async');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Async внутри effect: только как effect-local logic"
        copy="Effect не должен становиться асинхронным сам по себе. Его задача — начать синхронизацию с внешним миром, а затем вернуть cleanup. Поэтому async-работа обычно живёт внутри effect как локальная функция."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Правильная форма"
          value="effect-local async"
          hint={correct.summary}
          tone="cool"
        />
        <MetricCard
          label="Типичная ошибка"
          value="async callback"
          hint={wrong.summary}
          tone="accent"
        />
        <MetricCard
          label="Архитектурный риск"
          value="business logic inside effect"
          hint={mixed.summary}
          tone="dark"
        />
      </div>

      <AsyncInsideEffectLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={correct.title} code={correct.snippet} />
        <CodeBlock label={wrong.title} code={wrong.snippet} />
        <CodeBlock label={mixed.title} code={mixed.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
