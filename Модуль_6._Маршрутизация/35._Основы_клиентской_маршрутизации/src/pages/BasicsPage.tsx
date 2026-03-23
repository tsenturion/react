import { Link, useLocation } from 'react-router-dom';

import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function BasicsPage() {
  const location = useLocation();
  const study = projectStudies.basics;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Что такое client-side routing"
        copy="URL меняет экран внутри уже работающего SPA, а не заставляет браузер каждый раз поднимать новый документ. Здесь вы видите эту границу на практике: client transition сохраняет shell state, а document reload уничтожает его."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">Current route</StatusPill>
            <p className="text-sm leading-6 text-slate-600">{location.pathname}</p>
          </div>
        }
      />

      <Panel className="space-y-4">
        <p className="text-sm leading-6 text-slate-600">
          Попробуйте оба перехода ниже и наблюдайте за заметкой и session id в общем shell
          сверху.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/navigation"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Client-side Link
          </Link>
          <Link
            reloadDocument
            to="/navigation"
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Document reload
          </Link>
        </div>
      </Panel>

      <BeforeAfter
        beforeTitle="Document navigation"
        before="Браузер запрашивает документ заново, заново поднимает приложение и теряет локальное runtime-состояние."
        afterTitle="Client-side routing"
        after="Router меняет экран внутри уже работающего SPA, поэтому общий shell и его состояние остаются живыми."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="URL"
          value="Screen address"
          hint="Адресная строка перестаёт быть просто строкой и начинает описывать активный экран."
          tone="cool"
        />
        <MetricCard
          label="Transition"
          value="No full reload"
          hint="Router меняет только клиентское представление без нового HTML-документа."
        />
        <MetricCard
          label="SPA effect"
          value="Shell persists"
          hint="Общее layout-state переживает переходы между дочерними route-экранами."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
