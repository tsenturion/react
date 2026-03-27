import { MutableRefLab } from '../components/dom-refs/MutableRefLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildMutableRefReport, simulateMutableRefFlow } from '../lib/mutable-ref-model';
import { getProjectStudy } from '../lib/project-study';

export function MutableRefPage() {
  const refWrite = buildMutableRefReport('ref-write');
  const stateWrite = buildMutableRefReport('state-write');
  const handle = buildMutableRefReport('external-handle');
  const simulated = simulateMutableRefFlow(3, 0);
  const study = getProjectStudy('mutable');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="useRef как mutable значение без ререндера"
        copy="Ref подходит для значений, которые нужно сохранить между render-ами, но не нужно сразу превращать в новый UI snapshot. Здесь хорошо видно отличие между изменением ref и изменением state."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Actual ref after 3 writes"
          value={String(simulated.actualRef)}
          hint={refWrite.summary}
          tone="cool"
        />
        <MetricCard
          label="Visible snapshot without rerender"
          value={String(simulated.visibleSnapshot)}
          hint={stateWrite.summary}
          tone="accent"
        />
        <MetricCard
          label="Common ref payload"
          value="timer / object"
          hint={handle.summary}
          tone="dark"
        />
      </div>

      <MutableRefLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={refWrite.title} code={refWrite.snippet} />
        <CodeBlock label={stateWrite.title} code={stateWrite.snippet} />
        <CodeBlock label={handle.title} code={handle.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
