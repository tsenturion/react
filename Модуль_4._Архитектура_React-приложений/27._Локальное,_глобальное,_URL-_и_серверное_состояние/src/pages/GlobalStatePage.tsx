import { GlobalStateLab } from '../components/state-architecture/GlobalStateLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function GlobalStatePage() {
  const study = projectStudies.global;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Global state: общий источник для далёких веток"
        copy="Global state полезен там, где одно и то же значение нужно нескольким удалённым частям дерева: глобальные настройки интерфейса, текущая сессия, общая тема, выбранный workspace. Важно не превратить этот слой в свалку для локальных деталей, которые не должны жить вне своей ветки."
      />

      <Panel>
        <GlobalStateLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Подходит для"
          value="Shared prefs"
          hint="Общие настройки чтения, плотности и режима анализа, которые нужны разным секциям."
          tone="cool"
        />
        <MetricCard
          label="Риск"
          value="Store noise"
          hint="Если тащить сюда каждый черновик, общий слой становится шумным и трудным для отладки."
          tone="accent"
        />
        <MetricCard
          label="Главный плюс"
          value="Без drilling"
          hint="Состояние доходит до далёких веток без длинной цепочки промежуточных props."
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
