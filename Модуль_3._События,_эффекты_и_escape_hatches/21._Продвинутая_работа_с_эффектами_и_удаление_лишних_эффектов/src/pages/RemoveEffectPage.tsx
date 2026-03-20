import { RemoveEffectLab } from '../components/advanced-effects/RemoveEffectLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildRemoveEffectReport } from '../lib/remove-effect-model';
import { getProjectStudy } from '../lib/project-study';

export function RemoveEffectPage() {
  const mirrored = buildRemoveEffectReport('mirrored');
  const derived = buildRemoveEffectReport('derived');
  const study = getProjectStudy('remove');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Удаление лишних эффектов и выведение данных прямо в render"
        copy="Лишний effect часто появляется там, где UI можно просто вычислить из текущих props и state. Чем больше mirrored state, тем больше причин для drift, лишних reruns и неочевидного потока данных."
      />

      <div className="grid gap-3 md:grid-cols-2">
        <MetricCard
          label="Mirrored mode"
          value="2 effects"
          hint={mirrored.summary}
          tone="accent"
        />
        <MetricCard
          label="Derived mode"
          value="0 effects"
          hint={derived.summary}
          tone="cool"
        />
      </div>

      <RemoveEffectLab />

      <BeforeAfter
        beforeTitle="Если хранить derived values в state"
        before="Список и summary дублируют исходные данные, а каждая пропущенная dependency создаёт дополнительную точку рассинхрона."
        afterTitle="Если вычислять прямо в render"
        after="Компонент остаётся ближе к данным: query и level являются единственным источником истины, а интерфейс каждый раз пересчитывается из них напрямую."
      />

      <Panel className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label={mirrored.title} code={mirrored.snippet} />
        <CodeBlock label={derived.title} code={derived.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
