import { useState } from 'react';

import { FilterableRosterLab } from './components/labs/FilterableRosterLab';
import { RegistrationLab } from './components/labs/RegistrationLab';
import { TicTacToeLab } from './components/labs/TicTacToeLab';
import { Badge, InfoCard, StatCard } from './components/ui';
import {
  assignSeat,
  createRosterMemberFromRegistration,
  type MatchSeats,
} from './lib/arena-app-model';
import { rosterMembers, trackLabels, type RosterMember } from './lib/roster-data';
import type { SubmittedRegistration } from './lib/registration-model';
import { stackBadges } from './lib/stack-meta';

export function App() {
  const [participants, setParticipants] = useState<RosterMember[]>(() => [
    ...rosterMembers,
  ]);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(
    rosterMembers[0]?.id ?? null,
  );
  const [matchSeats, setMatchSeats] = useState<MatchSeats>({
    X: rosterMembers[0]?.id ?? null,
    O: rosterMembers[2]?.id ?? null,
  });

  const xPlayer =
    participants.find((participant) => participant.id === matchSeats.X) ?? null;
  const oPlayer =
    participants.find((participant) => participant.id === matchSeats.O) ?? null;
  const readyCount = participants.filter(
    (participant) => participant.status === 'ready',
  ).length;
  const digestCount = participants.filter(
    (participant) => participant.wantsDigest,
  ).length;
  const accessibilityCount = participants.filter(
    (participant) => participant.accessibilityFocus,
  ).length;

  function handleRegister(payload: SubmittedRegistration) {
    const nextParticipant = createRosterMemberFromRegistration(payload, participants);

    setParticipants((current) => [nextParticipant, ...current]);
    setSelectedParticipantId(nextParticipant.id);
    setMatchSeats((current) => {
      if (current.X === null) {
        return { ...current, X: nextParticipant.id };
      }

      if (current.O === null) {
        return { ...current, O: nextParticipant.id };
      }

      return current;
    });
  }

  function handleAssignSeat(seat: keyof MatchSeats, participantId: string) {
    setMatchSeats((current) => assignSeat(current, seat, participantId));
  }

  function handleClearSeat(seat: keyof MatchSeats) {
    setMatchSeats((current) => ({
      ...current,
      [seat]: null,
    }));
  }

  return (
    <div className="app-shell">
      <div className="shell-inner">
        <header className="hero">
          <span className="soft-label">React Arena Weekend</span>
          <h1 className="hero-title">Пульт организатора мини-турнира</h1>
          <p className="hero-copy">
            Это единый продуктовый сценарий: организатор принимает заявки участников,
            собирает пары игроков из живого реестра и запускает матч `Tic-Tac-Toe` прямо
            на той же странице. Регистрация реально пополняет список, список реально
            управляет слотами матча, а арена реально зависит от выбранной пары.
          </p>

          <div className="hero-grid">
            <InfoCard
              eyebrow="Реестр"
              title={`${participants.length} участников`}
              tone="accent"
            >
              Реестр пополняется из формы регистрации без перезагрузки и сразу становится
              доступным для поиска, фильтрации и выбора в матч.
            </InfoCard>
            <InfoCard
              eyebrow="Матч"
              title={xPlayer && oPlayer ? 'Пара собрана' : 'Нужны два игрока'}
            >
              {xPlayer && oPlayer
                ? `${xPlayer.name} (${trackLabels[xPlayer.track]}) против ${oPlayer.name} (${trackLabels[oPlayer.track]}).`
                : 'Назначьте игроков X и O в реестре участников, чтобы открыть арену.'}
            </InfoCard>
            <InfoCard
              eyebrow="Коммуникация"
              title={`${digestCount} подписаны на дайджест`}
            >
              Можно быстро видеть, сколько участников хотят follow-up после турнира и
              сколько заявок уже имеют a11y-фокус.
            </InfoCard>
          </div>

          <div className="hero-stats">
            <StatCard
              label="Готовы к матчу"
              value={readyCount}
              note="Статус ready в реестре."
              tone="success"
            />
            <StatCard
              label="A11y-фокус"
              value={accessibilityCount}
              note="Участники, которые явно работают с доступностью."
              tone="accent"
            />
            <StatCard
              label="Активная пара"
              value={xPlayer && oPlayer ? 'Собрана' : 'Ожидание'}
              note={
                xPlayer && oPlayer
                  ? `${xPlayer.name} vs ${oPlayer.name}`
                  : 'Слоты X и O ещё не заполнены.'
              }
            />
          </div>
        </header>

        <section className="match-strip">
          <SeatOverviewCard
            seat="X"
            player={xPlayer}
            onClear={() => handleClearSeat('X')}
          />
          <SeatOverviewCard
            seat="O"
            player={oPlayer}
            onClear={() => handleClearSeat('O')}
          />
        </section>

        <main className="dashboard-grid">
          <div className="dashboard-main">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Участники</p>
                  <h2 className="panel-title">Реестр и назначение игроков</h2>
                  <p className="panel-copy">
                    Таблица остаётся рабочим инструментом: здесь ищут людей, смотрят их
                    карточки и назначают игроков в матч.
                  </p>
                </div>
                <div className="badge-list">
                  <Badge tone="accent">filterable table</Badge>
                  <Badge tone="accent">keys</Badge>
                  <Badge tone="accent">selection</Badge>
                </div>
              </div>

              <FilterableRosterLab
                participants={participants}
                selectedId={selectedParticipantId}
                onSelect={setSelectedParticipantId}
                matchSeats={matchSeats}
                onAssignSeat={handleAssignSeat}
                onClearSeat={handleClearSeat}
              />
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Арена</p>
                  <h2 className="panel-title">Живой матч на выбранной паре</h2>
                  <p className="panel-copy">
                    История ходов, статус игры и доска живут вместе с текущими игроками.
                    Если меняется пара, матч сбрасывается к чистому старту.
                  </p>
                </div>
                <div className="badge-list">
                  <Badge tone="accent">derived winner</Badge>
                  <Badge tone="accent">time travel</Badge>
                  <Badge tone="accent">shared state</Badge>
                </div>
              </div>

              <TicTacToeLab xPlayer={xPlayer} oPlayer={oPlayer} />
            </section>
          </div>

          <aside className="dashboard-side">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Регистрация</p>
                  <h2 className="panel-title">Новая заявка на турнир</h2>
                  <p className="panel-copy">
                    После успешной отправки игрок мгновенно появляется в реестре и может
                    быть назначен в слот X или O.
                  </p>
                </div>
                <div className="badge-list">
                  <Badge tone="accent">forms</Badge>
                  <Badge tone="accent">validation</Badge>
                  <Badge tone="accent">a11y</Badge>
                </div>
              </div>

              <RegistrationLab
                onRegister={handleRegister}
                existingEmails={participants
                  .map((participant) => participant.email)
                  .filter((email): email is string => Boolean(email))}
              />
            </section>

            <section className="panel footer-panel">
              <p className="eyebrow">Стек</p>
              <h2 className="panel-title">Только базовые инструменты React</h2>
              <div className="badge-list">
                {stackBadges.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
              <div className="footer-copy">
                <p>
                  Вся связность проекта собрана на локальном state и props. Это намеренное
                  ограничение: сценарий остаётся реальным, но архитектура базового уровня
                  не прячется за глобальными абстракциями.
                </p>
                <p>
                  Регистрация, реестр и матч используют один и тот же слой данных, поэтому
                  изменения видны сразу во всех частях экрана.
                </p>
              </div>
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
}

type SeatOverviewCardProps = {
  seat: 'X' | 'O';
  player: RosterMember | null;
  onClear: () => void;
};

function SeatOverviewCard({ seat, player, onClear }: SeatOverviewCardProps) {
  return (
    <article className="seat-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Слот {seat}</p>
          <h2 className="card-title">{player?.name ?? 'Свободно'}</h2>
        </div>
        <Badge tone={player ? 'success' : 'warning'}>{player ? 'Готов' : 'Пусто'}</Badge>
      </div>

      <p className="panel-copy">
        {player
          ? `${trackLabels[player.track]} · ${player.city}`
          : 'Назначьте участника из реестра, чтобы открыть матч.'}
      </p>

      <button
        type="button"
        className="button button--secondary"
        onClick={onClear}
        disabled={player === null}
      >
        Очистить слот
      </button>
    </article>
  );
}
