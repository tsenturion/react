import { RequestSyncLab } from '../components/effects/RequestSyncLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildRequestReport } from '../lib/effect-request-model';
import { getProjectStudy } from '../lib/project-study';

export function RequestSyncPage() {
  const safe = buildRequestReport('cancel-stale');
  const stale = buildRequestReport('allow-stale');
  const study = getProjectStudy('requests');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Сетевые запросы, cleanup и stale responses"
        copy="Запрос к серверу тоже является внешней синхронизацией. Если query меняется быстро, несколько запросов будут жить одновременно. Без cleanup более старый ответ способен вернуться позже и заменить уже актуальные данные."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Network sync"
          value="fetch + abort"
          hint="Effect запускает запрос и связывает его lifecycle с текущим query."
          tone="cool"
        />
        <MetricCard label="Cleanup" value="AbortController" hint={safe.summary} />
        <MetricCard
          label="Риск"
          value="stale response"
          hint={stale.summary}
          tone="accent"
        />
      </div>

      <RequestSyncLab />

      <BeforeAfter
        beforeTitle="Без cleanup"
        before="Более старый медленный запрос может завершиться позже нового и перезаписать интерфейс устаревшим результатом."
        afterTitle="С cleanup"
        after="Смена query сразу отменяет старый запрос, поэтому интерфейс принимает только актуальный ответ."
      />

      <Panel className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label={safe.title} code={safe.snippet} />
        <CodeBlock label={stale.title} code={stale.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
