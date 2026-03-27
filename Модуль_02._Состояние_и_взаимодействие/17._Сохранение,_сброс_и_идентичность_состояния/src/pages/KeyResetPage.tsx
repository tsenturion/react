import { KeyedResetLab } from '../components/state-identity/KeyedResetLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildKeyResetReport } from '../lib/key-reset-model';
import { getProjectStudy } from '../lib/project-study';

export function KeyResetPage() {
  const withoutKey = buildKeyResetReport(false);
  const withKey = buildKeyResetReport(true);
  const study = getProjectStudy('keys');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="`key` управляет тем, сохранить состояние или начать заново"
        copy="Один и тот же component type можно либо переиспользовать, либо намеренно сбросить. Именно `key` позволяет явно провести границу новой identity для subtree."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard label="Без key" value="reuse" hint={withoutKey.summary} />
        <MetricCard label="С key" value="reset" hint={withKey.summary} tone="cool" />
        <MetricCard
          label="Практика"
          value="осознанный reset"
          hint="`key` полезен для новой формы, нового черновика и нового lifecycle при смене сущности."
          tone="accent"
        />
      </div>

      <KeyedResetLab />

      <BeforeAfter
        beforeTitle="Без key"
        before="Черновик и локальные флаги переходят к следующему профилю, потому что React продолжает тот же экземпляр."
        afterTitle="С key"
        after="При смене id React поднимает новый экземпляр и локальный state начинается с initial values."
      />

      <Panel className="grid gap-4 lg:grid-cols-2">
        <CodeBlock label="Reuse subtree" code={withoutKey.snippet} />
        <CodeBlock label="Reset subtree" code={withKey.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
