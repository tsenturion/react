import { ScrollLab } from '../components/dom-refs/ScrollLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildScrollReport, describeScrollOptions } from '../lib/scroll-model';
import { getProjectStudy } from '../lib/project-study';

export function ScrollPage() {
  const elementRef = buildScrollReport('scroll-into-view');
  const refMap = buildScrollReport('ref-map');
  const windowScroll = buildScrollReport('window-scroll');
  const study = getProjectStudy('scroll');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Scroll и программная навигация по уже существующему DOM"
        copy="Когда нужный блок уже есть в DOM, ref даёт точный access к нему. Это намного устойчивее, чем угадывать координаты или искать узлы глобально по документу."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Primary API"
          value="scrollIntoView"
          hint={elementRef.summary}
          tone="cool"
        />
        <MetricCard
          label="Collection strategy"
          value="id -> ref map"
          hint={refMap.summary}
          tone="accent"
        />
        <MetricCard
          label="Current preset"
          value={describeScrollOptions('smooth', 'center')}
          hint={windowScroll.summary}
          tone="dark"
        />
      </div>

      <ScrollLab />

      <BeforeAfter
        beforeTitle="Если опираться на глобальный scroll"
        before="Прокрутка знает только окно и координаты, но не знает, какой компонент и какой DOM-узел реально является целью."
        afterTitle="Если опираться на element refs"
        after="Прокрутка остаётся привязана к данным и конкретным узлам текущего списка, поэтому её легче поддерживать и расширять."
      />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={elementRef.title} code={elementRef.snippet} />
        <CodeBlock label={refMap.title} code={refMap.snippet} />
        <CodeBlock label={windowScroll.title} code={windowScroll.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
