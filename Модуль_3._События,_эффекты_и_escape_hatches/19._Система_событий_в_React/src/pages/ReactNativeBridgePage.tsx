import { ReactNativeBridgeLab } from '../components/react-events/ReactNativeBridgeLab';
import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { getProjectStudy } from '../lib/project-study';
import { buildReactNativeReport } from '../lib/react-native-model';

export function ReactNativeBridgePage() {
  const report = buildReactNativeReport();
  const study = getProjectStudy('bridge');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="React events и native DOM listeners живут рядом, но не одинаково"
        copy="В React вы обычно работаете с SyntheticEvent и declarative handlers через JSX. При этом native addEventListener никуда не исчезает: он нужен для escape hatches, внешних интеграций и прямой работы с DOM-узлами."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="React level"
          value="SyntheticEvent"
          hint="Нормализованный объект события, который приходит в onClick и другие JSX-handlers."
          tone="cool"
        />
        <MetricCard
          label="DOM level"
          value="MouseEvent"
          hint="Настоящий DOM Event, полученный браузером и доставленный в addEventListener."
        />
        <MetricCard
          label="Подписка"
          value="JSX + effect"
          hint="React-handlers описываются декларативно, native listeners вешаются и снимаются вручную."
          tone="accent"
        />
      </div>

      <ReactNativeBridgeLab />

      <Panel className="grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <ListBlock title="Ключевые различия" items={report.differences} />
        <CodeBlock label="Native listener in effect" code={report.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
