import { useQuery, useQueryClient } from '@tanstack/react-query';

import { WidgetBoundary } from '../components/WidgetBoundary';
import {
  InlineErrorState,
  LoadingRows,
  MetricCard,
  PageIntro,
  SectionCard,
  ToneBadge,
} from '../components/ui';
import { failNextRequest } from '../lib/mock-api';
import {
  activityQueryOptions,
  dashboardQueryOptions,
  queryKeys,
  teamQueryOptions,
} from '../lib/query-options';
import { formatDateTime, formatRelativeTime } from '../lib/utils';

export function DashboardPage() {
  const queryClient = useQueryClient();
  const dashboardQuery = useQuery(dashboardQueryOptions());
  const activityQuery = useQuery(activityQueryOptions());
  const teamQuery = useQuery(teamQueryOptions());

  const summary = dashboardQuery.data?.summary;

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="Protected dashboard"
        title="Операционная панель с серверными данными"
        copy="Здесь сочетаются router state, server state, частичные отказоустойчивые виджеты и явные loading/error boundaries."
        actions={
          <div className="action-row">
            <button
              type="button"
              className="button button--secondary"
              onClick={() =>
                void Promise.all([dashboardQuery.refetch(), teamQuery.refetch()])
              }
            >
              Обновить snapshot
            </button>
            {dashboardQuery.data ? (
              <span className="muted-copy">
                Синхронизировано {formatDateTime(dashboardQuery.data.syncedAt)}
              </span>
            ) : null}
          </div>
        }
      />

      {dashboardQuery.isError ? (
        <InlineErrorState
          title="Dashboard недоступен"
          message={dashboardQuery.error.message}
          onAction={() => void dashboardQuery.refetch()}
        />
      ) : null}

      <div className="metric-grid">
        {summary ? (
          <>
            <MetricCard
              label="Открыто"
              value={summary.openCount}
              hint="Все инциденты, кроме resolved"
              tone="blue"
            />
            <MetricCard
              label="Блокеры"
              value={summary.blockedCount}
              hint="Инциденты, которые ждут внешнюю зависимость"
              tone="amber"
            />
            <MetricCard
              label="Critical"
              value={summary.criticalCount}
              hint="Высший приоритет требует немедленной реакции"
              tone="rose"
            />
            <MetricCard
              label="Resolved today"
              value={summary.resolvedToday}
              hint={`Средний возраст открытых: ${summary.averageAgeHours} ч`}
              tone="green"
            />
          </>
        ) : (
          <>
            <MetricCard label="Открыто" value="..." hint="Загружаем KPI" />
            <MetricCard label="Блокеры" value="..." hint="Загружаем KPI" />
            <MetricCard label="Critical" value="..." hint="Загружаем KPI" />
            <MetricCard label="Resolved today" value="..." hint="Загружаем KPI" />
          </>
        )}
      </div>

      <div className="dashboard-grid">
        <SectionCard
          title="Лента событий"
          kicker="Widget-level resilience"
          action={
            <div className="action-row">
              <button
                type="button"
                className="button button--ghost"
                onClick={() => {
                  failNextRequest('activity');
                  void queryClient.invalidateQueries({ queryKey: queryKeys.activity });
                }}
              >
                Уронить следующий feed
              </button>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => void activityQuery.refetch()}
              >
                Retry
              </button>
            </div>
          }
        >
          <WidgetBoundary title="Лента событий">
            {activityQuery.isPending ? <LoadingRows count={4} /> : null}
            {activityQuery.isError ? (
              <InlineErrorState
                title="Feed отвалился локально"
                message={activityQuery.error.message}
                onAction={() => void activityQuery.refetch()}
              />
            ) : null}
            {activityQuery.data ? (
              <div className="activity-stack">
                {activityQuery.data.map((item) => (
                  <article key={item.id} className="timeline-card">
                    <div className="timeline-card__header">
                      <strong>{item.title}</strong>
                      <ToneBadge
                        tone={
                          item.tone === 'good'
                            ? 'green'
                            : item.tone === 'warn'
                              ? 'rose'
                              : 'slate'
                        }
                      >
                        {formatRelativeTime(item.at)}
                      </ToneBadge>
                    </div>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            ) : null}
          </WidgetBoundary>
        </SectionCard>

        <SectionCard
          title="Нагрузка on-call команды"
          kicker="Independent server widget"
          action={
            <button
              type="button"
              className="button button--secondary"
              onClick={() => void teamQuery.refetch()}
            >
              Обновить team load
            </button>
          }
        >
          <WidgetBoundary title="Нагрузка команды">
            {teamQuery.isPending ? <LoadingRows count={4} /> : null}
            {teamQuery.isError ? (
              <InlineErrorState
                title="Team load не загрузился"
                message={teamQuery.error.message}
                onAction={() => void teamQuery.refetch()}
              />
            ) : null}
            {teamQuery.data ? (
              <div className="team-stack">
                {teamQuery.data.map((member) => (
                  <article key={member.id} className="team-card">
                    <div>
                      <strong>{member.name}</strong>
                      <p>{member.focus}</p>
                    </div>
                    <div className="team-card__meta">
                      <ToneBadge tone={member.onCall ? 'green' : 'slate'}>
                        {member.onCall ? 'On-call' : 'Backup'}
                      </ToneBadge>
                      <span>{member.activeCount} активных</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </WidgetBoundary>
        </SectionCard>
      </div>

      <SectionCard title="Chaos drill" kicker="Explicit error handling">
        <div className="chaos-grid">
          <button
            type="button"
            className="button button--ghost"
            onClick={() => {
              failNextRequest('dashboard');
              void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
            }}
          >
            Уронить следующий dashboard read
          </button>
          <button
            type="button"
            className="button button--ghost"
            onClick={() => {
              failNextRequest('mutation');
            }}
          >
            Вооружить следующий mutation error
          </button>
        </div>
        <p className="muted-copy">
          Следующий шаг: откройте Incidents и измените статус карточки. UI обновится
          оптимистично, а при ошибке откатится обратно.
        </p>
      </SectionCard>
    </div>
  );
}
