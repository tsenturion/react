import { SyncExternalStoreLab } from '../components/advanced-hooks/SyncExternalStoreLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function SyncStorePage() {
  const study = projectStudies['sync-store'];

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="useSyncExternalStore и внешний store"
        copy="`useSyncExternalStore` нужен там, где React-компоненты читают состояние не из собственного `useState`, а из внешнего источника данных. Его задача — дать React согласованный snapshot и безопасную подписку, чтобы UI не расходился между ветками."
      />

      <Panel>
        <SyncExternalStoreLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Главный смысл"
          value="Consistent snapshot"
          hint="Все подписанные компоненты читают одну и ту же версию store."
          tone="cool"
        />
        <MetricCard
          label="Не заменяет"
          value="Обычный state"
          hint="Если данные живут внутри React-ветки, `useState` или `useReducer` обычно проще."
        />
        <MetricCard
          label="Полезно для"
          value="External source"
          hint="Сторонние store, browser signals и shared imperative источники."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
