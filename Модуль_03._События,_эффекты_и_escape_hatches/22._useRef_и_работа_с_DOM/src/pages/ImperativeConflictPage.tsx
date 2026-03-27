import { ImperativeConflictLab } from '../components/dom-refs/ImperativeConflictLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildImperativeDomReport,
  willReactOverwriteManualDom,
} from '../lib/imperative-dom-model';
import { getProjectStudy } from '../lib/project-study';

export function ImperativeConflictPage() {
  const safe = buildImperativeDomReport('safe');
  const conflict = buildImperativeDomReport('conflict');
  const stateOwned = buildImperativeDomReport('state-owned');
  const study = getProjectStudy('imperative');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Прямой доступ к DOM: где он допустим, а где начинает ломать декларативную модель"
        copy="Refs дают реальный доступ к DOM, но не все операции одинаково безопасны. Focus, scroll и measurement обычно помогают React. Ручная подмена className и textContent уже начинает конкурировать с JSX."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Safe escape hatch"
          value="focus / scroll"
          hint={safe.summary}
          tone="cool"
        />
        <MetricCard
          label="Conflict on rerender"
          value={willReactOverwriteManualDom(true) ? 'yes' : 'no'}
          hint={conflict.summary}
          tone="accent"
        />
        <MetricCard
          label="Preferred owner"
          value="React state"
          hint={stateOwned.summary}
          tone="dark"
        />
      </div>

      <ImperativeConflictLab />

      <BeforeAfter
        beforeTitle="Когда DOM меняется вручную поверх JSX"
        before="Появляется второй источник истины. Следующий React render может частично перезаписать DOM, а часть ручной мутации останется висеть неожиданно."
        afterTitle="Когда imperative DOM используется как escape hatch"
        after="Фокус, scroll и measurement направляют уже существующий DOM, но не подменяют то, что React сам считает своим состоянием интерфейса."
      />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={safe.title} code={safe.snippet} />
        <CodeBlock label={conflict.title} code={conflict.snippet} />
        <CodeBlock label={stateOwned.title} code={stateOwned.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
