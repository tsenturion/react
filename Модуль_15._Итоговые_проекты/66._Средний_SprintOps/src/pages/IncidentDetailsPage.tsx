import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  InlineErrorState,
  LoadingRows,
  PageIntro,
  PriorityBadge,
  SectionCard,
  StatusBadge,
} from '../components/ui';
import {
  useDeleteIncidentMutation,
  useUpdateIncidentMutation,
} from '../features/incidents/useIncidentMutations';
import { priorityLabels, statusLabels } from '../lib/incidents-domain';
import { incidentDetailQueryOptions, queryKeys } from '../lib/query-options';
import type { Incident, IncidentPriority, IncidentStatus } from '../lib/types';
import { formatDateTime } from '../lib/utils';

export function IncidentDetailsPage() {
  const queryClient = useQueryClient();
  const { incidentId = '' } = useParams();
  const detailQuery = useQuery({
    ...incidentDetailQueryOptions(incidentId),
    initialData: () =>
      queryClient
        .getQueryData<Incident[]>(queryKeys.incidents)
        ?.find((item) => item.id === incidentId),
  });
  if (!incidentId) {
    return (
      <InlineErrorState
        title="Некорректный маршрут"
        message="Router не передал идентификатор инцидента."
      />
    );
  }

  const incident = detailQuery.data;

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="Detail route"
        title={incident ? incident.title : `Инцидент ${incidentId}`}
        copy="Маршрут страхуется loader-prefetch, отдельным query cache и серверной мутацией редактирования."
        actions={
          <div className="action-row">
            <Link className="button button--secondary" to="/app/incidents">
              Назад к списку
            </Link>
            {incident ? (
              <span className="muted-copy">
                Обновлено {formatDateTime(incident.updatedAt)}
              </span>
            ) : null}
          </div>
        }
      />

      {detailQuery.isPending && !incident ? <LoadingRows count={4} /> : null}

      {detailQuery.isError && !incident ? (
        <InlineErrorState
          title="Карточка не загрузилась"
          message={detailQuery.error.message}
          onAction={() => void detailQuery.refetch()}
        />
      ) : null}

      {incident ? (
        <div className="content-split">
          <IncidentEditor
            key={`${incident.id}:${incident.updatedAt}`}
            incident={incident}
            incidentId={incidentId}
          />

          <SectionCard title="Route + cache notes" kicker="Engineering view">
            <ul className="plain-list">
              <li>detail route предзагружается loader-ом до рендера страницы</li>
              <li>карточка получает initialData из списка, если список уже в cache</li>
              <li>
                mutation обновляет и list cache, и detail cache, и dashboard counters
              </li>
              <li>
                после успешной записи activity feed дозагружается через invalidation
              </li>
            </ul>
          </SectionCard>
        </div>
      ) : null}
    </div>
  );
}

function IncidentEditor({
  incident,
  incidentId,
}: {
  incident: Incident;
  incidentId: string;
}) {
  const navigate = useNavigate();
  const updateMutation = useUpdateIncidentMutation();
  const deleteMutation = useDeleteIncidentMutation();
  const [draft, setDraft] = useState({
    title: incident.title,
    service: incident.service,
    owner: incident.owner,
    priority: incident.priority,
    status: incident.status,
    description: incident.description,
  });

  const hasChanges =
    incident.title !== draft.title ||
    incident.service !== draft.service ||
    incident.owner !== draft.owner ||
    incident.priority !== draft.priority ||
    incident.status !== draft.status ||
    incident.description !== draft.description;

  return (
    <SectionCard title="Параметры" kicker="Protected detail screen">
      <div className="badge-row badge-row--spaced">
        <PriorityBadge priority={incident.priority} />
        <StatusBadge status={incident.status} />
      </div>

      <form
        className="form-stack"
        onSubmit={(event) => {
          event.preventDefault();
          updateMutation.mutate({
            incidentId,
            patch: draft,
          });
        }}
      >
        <label className="field">
          <span>Заголовок</span>
          <input
            className="input"
            value={draft.title}
            onChange={(event) =>
              setDraft((current) => ({ ...current, title: event.target.value }))
            }
          />
        </label>

        <label className="field">
          <span>Сервис</span>
          <input
            className="input"
            value={draft.service}
            onChange={(event) =>
              setDraft((current) => ({ ...current, service: event.target.value }))
            }
          />
        </label>

        <label className="field">
          <span>Ответственный</span>
          <input
            className="input"
            value={draft.owner}
            onChange={(event) =>
              setDraft((current) => ({ ...current, owner: event.target.value }))
            }
          />
        </label>

        <div className="filters-grid">
          <label className="field">
            <span>Приоритет</span>
            <select
              className="input"
              value={draft.priority}
              onChange={(event) =>
                setDraft((current) => ({
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
            <span>Статус</span>
            <select
              className="input"
              value={draft.status}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  status: event.target.value as IncidentStatus,
                }))
              }
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span>Описание</span>
          <textarea
            className="textarea"
            value={draft.description}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
          />
        </label>

        {updateMutation.isError ? (
          <InlineErrorState
            title="Сохранить не удалось"
            message={updateMutation.error.message}
          />
        ) : null}

        <div className="action-row">
          <button
            type="submit"
            className="button"
            disabled={!hasChanges || updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Сохраняем...' : 'Сохранить изменения'}
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={() => {
              deleteMutation.mutate(
                { incidentId },
                {
                  onSuccess: () => void navigate('/app/incidents', { replace: true }),
                },
              );
            }}
          >
            Удалить карточку
          </button>
        </div>
      </form>
    </SectionCard>
  );
}
