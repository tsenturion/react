import { CatalogContractLab } from '../components/custom-hooks/CatalogContractLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ContractPage() {
  const study = projectStudies.contract;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Контракт custom hook"
        copy="Смотрите на custom hook как на самостоятельный API-слой: он принимает входы, держит внутреннее состояние, считает derived data и отдаёт наружу только те команды, которые реально нужны экрану."
      />

      <Panel>
        <CatalogContractLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Фокус"
          value="Контракт"
          hint="Если hook читается как маленький API, компонент остаётся проще."
          tone="cool"
        />
        <MetricCard
          label="Анти-паттерн"
          value="Сырые setState"
          hint="Когда наружу утекают внутренние сеттеры, компонент знает о hook-е слишком много."
          tone="accent"
        />
        <MetricCard
          label="Практика"
          value="Derived data"
          hint="Список и статус строятся внутри hook-а и приходят готовыми к UI."
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
