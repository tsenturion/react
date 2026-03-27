import { TradeoffsLab } from '../components/composition-patterns/TradeoffsLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function TradeoffsPage() {
  const study = projectStudies.tradeoffs;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Границы, стоимость и anti-patterns"
        copy="Гибкий API-компонент полезен только до тех пор, пока его стоимость остаётся под контролем. Здесь можно проверить, как wrapper layers, hidden contracts, typing pressure и child fragility превращают удачный паттерн в источник архитектурных проблем."
      />

      <Panel>
        <TradeoffsLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Что считать"
          value="Real cost"
          hint="Важно оценивать не красоту API, а цену его поддержки, типизации и объяснимости."
          tone="cool"
        />
        <MetricCard
          label="Когда бить тревогу"
          value="Hidden contracts"
          hint="Если consumer должен знать слишком много скрытых правил, паттерн уже начинает вредить."
        />
        <MetricCard
          label="Правильная цель"
          value="Clarity first"
          hint="Гибкость API хороша только там, где не разрушает прозрачность кода и причинно-следственные связи."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
