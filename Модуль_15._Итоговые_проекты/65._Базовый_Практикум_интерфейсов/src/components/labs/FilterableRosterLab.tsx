import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useState } from 'react';

import type { MatchSeats } from '../../lib/arena-app-model';
import { statusLabels, trackLabels, type RosterMember } from '../../lib/roster-data';
import {
  createRosterFilters,
  describeSelection,
  filterRoster,
  getStatusTone,
  summarizeRoster,
  type RosterFilters,
} from '../../lib/roster-model';
import { Badge, Field, StatCard } from '../ui';

type FilterableRosterLabProps = {
  participants: readonly RosterMember[];
  selectedId: string | null;
  matchSeats: MatchSeats;
  onSelect: (value: string | null) => void;
  onAssignSeat: (seat: keyof MatchSeats, participantId: string) => void;
  onClearSeat: (seat: keyof MatchSeats) => void;
};

export function FilterableRosterLab({
  participants,
  selectedId,
  matchSeats,
  onSelect,
  onAssignSeat,
  onClearSeat,
}: FilterableRosterLabProps) {
  const [filters, setFilters] = useState(createRosterFilters);
  const visibleRows = filterRoster(participants, filters);
  const summary = summarizeRoster(visibleRows);
  const selection = describeSelection(selectedId, participants, visibleRows);

  function patchFilters<K extends keyof RosterFilters>(key: K, value: RosterFilters[K]) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetFilters() {
    setFilters(createRosterFilters());
  }

  return (
    <div className="lab-grid lab-grid--responsive">
      <div className="lab-column">
        <div className="stat-grid">
          <StatCard
            label="В выдаче"
            value={summary.visibleCount}
            note="Поиск и фильтры работают поверх общего реестра."
            tone="accent"
          />
          <StatCard
            label="Готовы"
            value={summary.readyCount}
            note="Игроки со статусом ready."
            tone="success"
          />
          <StatCard
            label="A11y-фокус"
            value={summary.accessibilityFocusCount}
            note="Участники, которые явно работают с доступностью."
          />
        </div>

        <section className="lab-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Реестр</p>
              <h3 className="card-title">Участники турнира</h3>
            </div>
            <Badge tone="accent">{participants.length} записей</Badge>
          </div>

          <RosterFiltersPanel
            filters={filters}
            onQueryChange={(value) => patchFilters('query', value)}
            onTrackChange={(value) => patchFilters('track', value)}
            onReadyChange={(value) => patchFilters('onlyReady', value)}
            onSortChange={(value) => patchFilters('sortBy', value)}
            onReset={resetFilters}
          />

          <p className="table-summary" aria-live="polite">
            Найдено {summary.visibleCount} участников: {summary.readyCount} готовы,{' '}
            {summary.reviewCount} ещё проходят review, {summary.blockedCount} временно не
            доступны для матча.
          </p>

          <RosterTable rows={visibleRows} selectedId={selectedId} onSelect={onSelect} />
        </section>
      </div>

      <aside className="lab-sidebar">
        <SelectedProfile
          selectionState={selection.state}
          message={selection.message}
          matchSeats={matchSeats}
          onAssignSeat={onAssignSeat}
          onClearSeat={onClearSeat}
          onClear={() => onSelect(null)}
          selectedName={selection.member?.name ?? null}
          selectedId={selection.member?.id ?? null}
        >
          {selection.member ? (
            <>
              <div className="profile-line">
                <span>Трек</span>
                <strong>{trackLabels[selection.member.track]}</strong>
              </div>
              <div className="profile-line">
                <span>Статус</span>
                <Badge tone={getStatusTone(selection.member.status)}>
                  {statusLabels[selection.member.status]}
                </Badge>
              </div>
              <div className="profile-line">
                <span>E-mail</span>
                <strong>{selection.member.email ?? 'Не указан'}</strong>
              </div>
              <div className="profile-line">
                <span>Проект</span>
                <strong>{selection.member.project}</strong>
              </div>
              <div className="profile-line">
                <span>Команда</span>
                <strong>{selection.member.teamName ?? 'Индивидуально'}</strong>
              </div>
              <div className="profile-line">
                <span>О себе</span>
                <strong>{selection.member.bio ?? 'Без описания'}</strong>
              </div>
            </>
          ) : (
            <p className="panel-copy">
              Выберите строку в таблице, чтобы посмотреть полную карточку и назначить
              участника в текущий матч.
            </p>
          )}
        </SelectedProfile>
      </aside>
    </div>
  );
}

type RosterFiltersPanelProps = {
  filters: RosterFilters;
  onQueryChange: (value: string) => void;
  onTrackChange: (value: RosterFilters['track']) => void;
  onReadyChange: (value: boolean) => void;
  onSortChange: (value: RosterFilters['sortBy']) => void;
  onReset: () => void;
};

function RosterFiltersPanel({
  filters,
  onQueryChange,
  onTrackChange,
  onReadyChange,
  onSortChange,
  onReset,
}: RosterFiltersPanelProps) {
  return (
    <div className="filters-grid">
      <Field label="Поиск" htmlFor="roster-query" hint="Имя, город, ментор или e-mail.">
        <input
          id="roster-query"
          className="text-input"
          type="search"
          value={filters.query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Ирина, Тюмень, Мария"
        />
      </Field>

      <Field label="Трек" htmlFor="roster-track">
        <select
          id="roster-track"
          className="select-input"
          value={filters.track}
          onChange={(event) =>
            onTrackChange(event.target.value as RosterFilters['track'])
          }
        >
          <option value="all">Все треки</option>
          <option value="state">State</option>
          <option value="forms">Forms</option>
          <option value="architecture">Architecture</option>
        </select>
      </Field>

      <Field label="Сортировка" htmlFor="roster-sort">
        <select
          id="roster-sort"
          className="select-input"
          value={filters.sortBy}
          onChange={(event) =>
            onSortChange(event.target.value as RosterFilters['sortBy'])
          }
        >
          <option value="progress">По прогрессу</option>
          <option value="name">По имени</option>
        </select>
      </Field>

      <div className="field">
        <div className="field-label-row">
          <span className="field-label">Быстрое действие</span>
        </div>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={filters.onlyReady}
            onChange={(event) => onReadyChange(event.target.checked)}
          />
          <span>Показывать только готовых</span>
        </label>
        <button type="button" className="button button--secondary" onClick={onReset}>
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
}

type RosterTableProps = {
  rows: readonly RosterMember[];
  selectedId: string | null;
  onSelect: (value: string) => void;
};

function RosterTable({ rows, selectedId, onSelect }: RosterTableProps) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <caption className="visually-hidden">
          Реестр участников турнира с фильтрами и выделенной строкой
        </caption>
        <thead>
          <tr>
            <th scope="col">Участник</th>
            <th scope="col">Трек</th>
            <th scope="col">Статус</th>
            <th scope="col">Прогресс</th>
            <th scope="col">Город</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-cell">
                Подходящих участников нет. Попробуйте снять фильтры или добавить нового
                участника через форму справа.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={clsx('table-row', selectedId === row.id && 'is-selected')}
              >
                <td>
                  <button
                    type="button"
                    className="row-button"
                    onClick={() => onSelect(row.id)}
                  >
                    <span className="row-title">{row.name}</span>
                    <span className="row-copy">{row.email ?? row.project}</span>
                  </button>
                </td>
                <td>{trackLabels[row.track]}</td>
                <td>
                  <Badge tone={getStatusTone(row.status)}>
                    {statusLabels[row.status]}
                  </Badge>
                </td>
                <td>{row.progress}%</td>
                <td>{row.city}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

type SelectedProfileProps = {
  selectionState: 'none' | 'visible' | 'hidden-by-filter' | 'missing';
  message: string;
  selectedName: string | null;
  selectedId: string | null;
  matchSeats: MatchSeats;
  onClear: () => void;
  onAssignSeat: (seat: keyof MatchSeats, participantId: string) => void;
  onClearSeat: (seat: keyof MatchSeats) => void;
  children: ReactNode;
};

function SelectedProfile({
  selectionState,
  message,
  selectedName,
  selectedId,
  matchSeats,
  onClear,
  onAssignSeat,
  onClearSeat,
  children,
}: SelectedProfileProps) {
  const tone =
    selectionState === 'visible'
      ? 'success'
      : selectionState === 'hidden-by-filter'
        ? 'warning'
        : selectionState === 'missing'
          ? 'danger'
          : 'neutral';

  const selectionLabel =
    selectionState === 'visible'
      ? 'Виден в реестре'
      : selectionState === 'hidden-by-filter'
        ? 'Скрыт фильтром'
        : selectionState === 'missing'
          ? 'Не найден'
          : 'Нет выбора';

  return (
    <section className={clsx('profile-card', `tone-${tone}`)}>
      <div className="card-header">
        <div>
          <p className="eyebrow">Карточка участника</p>
          <h3 className="card-title">{selectedName ?? 'Участник не выбран'}</h3>
        </div>
        <Badge tone={tone}>{selectionLabel}</Badge>
      </div>

      <p className="selection-message">{message}</p>
      <div className="profile-details">{children}</div>

      {selectedId ? (
        <div className="seat-actions">
          <button
            type="button"
            className="button"
            onClick={() => onAssignSeat('X', selectedId)}
          >
            {matchSeats.X === selectedId ? 'Игрок X уже выбран' : 'Назначить в слот X'}
          </button>
          <button
            type="button"
            className="button"
            onClick={() => onAssignSeat('O', selectedId)}
          >
            {matchSeats.O === selectedId ? 'Игрок O уже выбран' : 'Назначить в слот O'}
          </button>
        </div>
      ) : null}

      <div className="seat-actions">
        <button
          type="button"
          className="button button--secondary"
          onClick={() => onClearSeat('X')}
        >
          Освободить X
        </button>
        <button
          type="button"
          className="button button--secondary"
          onClick={() => onClearSeat('O')}
        >
          Освободить O
        </button>
      </div>

      <button type="button" className="button button--secondary" onClick={onClear}>
        Снять выделение
      </button>
    </section>
  );
}
