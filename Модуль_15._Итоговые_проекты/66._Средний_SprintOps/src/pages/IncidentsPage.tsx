import { useQuery } from '@tanstack/react-query';
import { useDeferredValue, useState, useTransition } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import {
  EmptyState,
  InlineErrorState,
  LoadingRows,
  PageIntro,
  PriorityBadge,
  SectionCard,
  StatusBadge,
} from '../components/ui';
import {
  useCreateIncidentMutation,
  useDeleteIncidentMutation,
  useUpdateIncidentMutation,
} from '../features/incidents/useIncidentMutations';
import { filterIncidents, priorityLabels, statusLabels } from '../lib/incidents-domain';
import { failNextRequest } from '../lib/mock-api';
import { incidentsQueryOptions } from '../lib/query-options';
import type {
  CreateIncidentPayload,
  IncidentPriority,
  IncidentStatus,
} from '../lib/types';
import { formatRelativeTime } from '../lib/utils';

const initialForm: CreateIncidentPayload = {
  title: '',
  service: '',
  owner: '',
  priority: 'medium',
  description: '',
};

export function IncidentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [createForm, setCreateForm] = useState<CreateIncidentPayload>(initialForm);
  const [isRoutingFilters, startTransition] = useTransition();
  const incidentsQuery = useQuery(incidentsQueryOptions());
  const createMutation = useCreateIncidentMutation();
  const updateMutation = useUpdateIncidentMutation();
  const deleteMutation = useDeleteIncidentMutation();

  const filters = {
    status: (searchParams.get('status') as IncidentStatus | 'all') ?? 'all',
    priority: (searchParams.get('priority') as IncidentPriority | 'all') ?? 'all',
    query: searchParams.get('q') ?? '',
  };

  const deferredQuery = useDeferredValue(filters.query);
  const visibleIncidents = filterIncidents(incidentsQuery.data ?? [], {
    ...filters,
    query: deferredQuery,
  });

  function updateFilter(name: 'status' | 'priority' | 'q', value: string) {
    startTransition(() => {
      const next = new URLSearchParams(searchParams);

      if (!value || value === 'all') {
        next.delete(name);
      } else {
        next.set(name, value);
      }

      setSearchParams(next, { replace: true });
    });
  }

  const mutationError =
    createMutation.error ?? updateMutation.error ?? deleteMutation.error ?? null;

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="CRUD + server state"
        title="Очередь инцидентов"
        copy="Экран соединяет URL-фильтры, protected routes, optimistic mutations, rollback и детальную карточку маршрута."
        actions={
          <div className="action-row">
            <button
              type="button"
              className="button button--secondary"
              onClick={() => void incidentsQuery.refetch()}
            >
              Обновить список
            </button>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => {
                failNextRequest('incidents');
                void incidentsQuery.refetch();
              }}
            >
              Уронить следующий fetch
            </button>
          </div>
        }
      />

      {mutationError ? (
        <InlineErrorState title="Mutation откатился" message={mutationError.message} />
      ) : null}

      <div className="content-split">
        <div className="page-stack">
          <SectionCard title="Фильтры" kicker="Router state in URL">
            <div className="filters-grid">
              <label className="field">
                <span>Поиск</span>
                <input
                  className="input"
                  value={filters.query}
                  onChange={(event) => updateFilter('q', event.target.value)}
                  placeholder="Checkout, Лина, blocked..."
                />
              </label>

              <label className="field">
                <span>Статус</span>
                <select
                  className="input"
                  value={filters.status}
                  onChange={(event) => updateFilter('status', event.target.value)}
                >
                  <option value="all">Все</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Приоритет</span>
                <select
                  className="input"
                  value={filters.priority}
                  onChange={(event) => updateFilter('priority', event.target.value)}
                >
                  <option value="all">Все</option>
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className="muted-copy">
              URL фильтров обновляется через transition. Текущее состояние:{' '}
              <code>
                {filters.status}/{filters.priority}/{filters.query || 'empty'}
              </code>
              {isRoutingFilters ? ' · router обновляет search params' : null}
            </p>
          </SectionCard>

          <SectionCard
            title="Текущие инциденты"
            kicker="Optimistic list"
            action={
              incidentsQuery.isRefetching ? (
                <span className="muted-copy">Синхронизация...</span>
              ) : null
            }
          >
            {incidentsQuery.isPending ? <LoadingRows count={5} /> : null}
            {incidentsQuery.isError ? (
              <InlineErrorState
                title="Список не загрузился"
                message={incidentsQuery.error.message}
                onAction={() => void incidentsQuery.refetch()}
              />
            ) : null}
            {!incidentsQuery.isPending &&
            !incidentsQuery.isError &&
            visibleIncidents.length === 0 ? (
              <EmptyState
                title="Совпадений не найдено"
                message="Измените фильтры в URL или создайте новый инцидент справа."
              />
            ) : null}

            <div className="incident-stack">
              {visibleIncidents.map((incident) => (
                <article key={incident.id} className="incident-card">
                  <div className="incident-card__header">
                    <div>
                      <Link
                        className="incident-link"
                        to={`/app/incidents/${incident.id}`}
                      >
                        {incident.title}
                      </Link>
                      <p className="muted-copy">
                        {incident.id} · {incident.service} · {incident.owner}
                      </p>
                    </div>
                    <div className="badge-row">
                      <PriorityBadge priority={incident.priority} />
                      <StatusBadge status={incident.status} />
                    </div>
                  </div>

                  <p className="incident-description">{incident.description}</p>

                  <div className="incident-card__footer">
                    <span className="muted-copy">
                      Обновлено {formatRelativeTime(incident.updatedAt)}
                    </span>

                    <div className="incident-actions">
                      <label className="inline-control">
                        <span className="sr-only">Статус</span>
                        <select
                          aria-label={`Статус ${incident.id}`}
                          className="input input--compact"
                          value={incident.status}
                          onChange={(event) =>
                            updateMutation.mutate({
                              incidentId: incident.id,
                              patch: {
                                status: event.target.value as IncidentStatus,
                              },
                            })
                          }
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="inline-control">
                        <span className="sr-only">Приоритет</span>
                        <select
                          aria-label={`Приоритет ${incident.id}`}
                          className="input input--compact"
                          value={incident.priority}
                          onChange={(event) =>
                            updateMutation.mutate({
                              incidentId: incident.id,
                              patch: {
                                priority: event.target.value as IncidentPriority,
                              },
                            })
                          }
                        >
                          {Object.entries(priorityLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <Link
                        className="button button--secondary"
                        to={`/app/incidents/${incident.id}`}
                      >
                        Открыть
                      </Link>

                      <button
                        type="button"
                        className="button button--danger"
                        onClick={() => deleteMutation.mutate({ incidentId: incident.id })}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="page-stack">
          <SectionCard title="Создать инцидент" kicker="Create mutation">
            <form
              className="form-stack"
              onSubmit={(event) => {
                event.preventDefault();
                createMutation.mutate(createForm, {
                  onSuccess: () => setCreateForm(initialForm),
                });
              }}
            >
              <label className="field">
                <span>Заголовок</span>
                <input
                  className="input"
                  value={createForm.title}
                  onChange={(event) =>
                    setCreateForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Например, Checkout timeout spike"
                />
              </label>

              <label className="field">
                <span>Сервис</span>
                <input
                  className="input"
                  value={createForm.service}
                  onChange={(event) =>
                    setCreateForm((current) => ({
                      ...current,
                      service: event.target.value,
                    }))
                  }
                  placeholder="Checkout API"
                />
              </label>

              <label className="field">
                <span>Ответственный</span>
                <input
                  className="input"
                  value={createForm.owner}
                  onChange={(event) =>
                    setCreateForm((current) => ({
                      ...current,
                      owner: event.target.value,
                    }))
                  }
                  placeholder="Ава Чен"
                />
              </label>

              <label className="field">
                <span>Приоритет</span>
                <select
                  className="input"
                  value={createForm.priority}
                  onChange={(event) =>
                    setCreateForm((current) => ({
                      ...current,
                      priority: event.target.value as IncidentPriority,
                    }))
                  }
                >
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Описание</span>
                <textarea
                  className="textarea"
                  value={createForm.description}
                  onChange={(event) =>
                    setCreateForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Что сломалось, какой контекст, что мешает релизу"
                />
              </label>

              <button
                type="submit"
                className="button button--full"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Создаём карточку...' : 'Создать инцидент'}
              </button>
            </form>
          </SectionCard>

          <SectionCard title="Rollback drill" kicker="Mutation resilience">
            <p className="muted-copy">
              Нажмите кнопку ниже, затем измените статус любой карточки. UI сначала
              покажет optimistic state, а после server error вернётся назад.
            </p>
            <button
              type="button"
              className="button button--ghost button--full"
              onClick={() => failNextRequest('mutation')}
            >
              Уронить следующий mutation
            </button>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
