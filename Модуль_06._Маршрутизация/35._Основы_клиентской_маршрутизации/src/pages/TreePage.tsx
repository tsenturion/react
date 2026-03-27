import { useLocation } from 'react-router-dom';

import { RouteTreeVisualizer } from '../components/routing/RouteTreeVisualizer';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';
import { routeTree } from '../lib/routing-domain';

export function TreePage() {
  const location = useLocation();
  const study = projectStudies.tree;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Route tree и layout route"
        copy="Маршрутизация строится не как случайный набор ссылок, а как дерево. Здесь видно общий shell route, дочерние страницы и то, как текущий pathname совпадает с ветками route tree."
      />

      <Panel>
        <RouteTreeVisualizer tree={routeTree} pathname={location.pathname} />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Root route"
          value="Shared shell"
          hint="Общий layout route держит header, nav, footer и shell state."
          tone="cool"
        />
        <MetricCard
          label="Child routes"
          value="Separate screens"
          hint="Каждый экран становится отдельной веткой, а не условным блоком внутри одного компонента."
        />
        <MetricCard
          label="Current match"
          value={location.pathname}
          hint="Pathname указывает, какая именно ветка route tree сейчас активна."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
