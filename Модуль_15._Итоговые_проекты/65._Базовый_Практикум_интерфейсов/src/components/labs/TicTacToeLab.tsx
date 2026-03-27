import clsx from 'clsx';
import { useState } from 'react';

import type { RosterMember } from '../../lib/roster-data';
import {
  buildMoveItems,
  createGameHistory,
  deriveGameStatus,
  playMove,
} from '../../lib/tic-tac-toe';
import { Badge, StatCard } from '../ui';

type TicTacToeLabProps = {
  xPlayer: RosterMember | null;
  oPlayer: RosterMember | null;
};

export function TicTacToeLab({ xPlayer, oPlayer }: TicTacToeLabProps) {
  if (!xPlayer || !oPlayer) {
    return (
      <section className="arena-empty-state">
        <div className="status-banner">
          Чтобы открыть матч, назначьте двух участников в слоты X и O из реестра.
        </div>
        <div className="board" role="presentation" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => (
            <button key={index} type="button" className="square" disabled />
          ))}
        </div>
      </section>
    );
  }

  return (
    <ArenaSession
      key={`${xPlayer.id}-${oPlayer.id}`}
      xPlayer={xPlayer}
      oPlayer={oPlayer}
    />
  );
}

type ArenaSessionProps = {
  xPlayer: RosterMember;
  oPlayer: RosterMember;
};

function ArenaSession({ xPlayer, oPlayer }: ArenaSessionProps) {
  const [history, setHistory] = useState(createGameHistory);
  const [currentMove, setCurrentMove] = useState(0);
  const [isDescending, setIsDescending] = useState(false);
  const currentBoard = history[currentMove];
  const status = deriveGameStatus(currentBoard);
  const moveItems = buildMoveItems(history);
  const orderedMoves = isDescending ? [...moveItems].reverse() : moveItems;
  const winnerLine = new Set(status.winner?.line ?? []);

  function handleSquareClick(square: number) {
    const nextHistory = playMove(history, currentMove, square);

    if (
      nextHistory.length === history.length &&
      nextHistory.every((board, index) => board === history[index])
    ) {
      return;
    }

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleReset() {
    setHistory(createGameHistory());
    setCurrentMove(0);
  }

  const playerNames = {
    X: xPlayer.name,
    O: oPlayer.name,
  };
  const statusLabel = status.winner
    ? `Победа ${playerNames[status.winner.player]}.`
    : status.isDraw
      ? 'Ничья. Доска заполнена полностью.'
      : `Следующий ход: ${playerNames[status.nextPlayer]}.`;

  return (
    <div className="lab-grid lab-grid--responsive">
      <div className="lab-column">
        <div className="match-strip match-strip--inside">
          <PlayerCard seat="X" player={xPlayer} />
          <PlayerCard seat="O" player={oPlayer} />
        </div>

        <section className="lab-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Матч</p>
              <h3 className="card-title">
                {xPlayer.name} vs {oPlayer.name}
              </h3>
            </div>
            <Badge
              tone={status.winner ? 'success' : status.isDraw ? 'warning' : 'accent'}
            >
              {status.winner ? 'Матч завершён' : status.isDraw ? 'Ничья' : 'Идёт игра'}
            </Badge>
          </div>

          <div className="stat-grid">
            <StatCard
              label="Ходов"
              value={history.length - 1}
              note="История доступна прямо в карточке матча."
              tone="accent"
            />
            <StatCard
              label="Клеток занято"
              value={status.occupiedCount}
              note="Считается по текущей доске."
            />
            <StatCard
              label="Свободно"
              value={status.availableMoves}
              note={status.winner ? 'Матч уже завершён.' : 'Осталось клеток до финала.'}
            />
          </div>

          <div className="status-banner" aria-live="polite">
            {statusLabel}
          </div>

          <GameBoard
            board={currentBoard}
            nextPlayerName={playerNames[status.nextPlayer]}
            winnerLine={winnerLine}
            disabled={Boolean(status.winner) || status.isDraw}
            onSquareClick={handleSquareClick}
          />

          <div className="action-row">
            <button type="button" className="button" onClick={handleReset}>
              Начать заново
            </button>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => setIsDescending((current) => !current)}
            >
              {isDescending ? 'Сначала старые ходы' : 'Сначала новые ходы'}
            </button>
          </div>
        </section>
      </div>

      <aside className="lab-sidebar">
        <section className="lab-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Журнал</p>
              <h3 className="card-title">История матча</h3>
            </div>
            <Badge tone="accent">{isDescending ? 'desc' : 'asc'}</Badge>
          </div>

          <p className="panel-copy">
            Организатор может вернуться к любому ходу, проверить спорный момент и сразу
            продолжить матч с новой развилки.
          </p>

          <ol className="history-list">
            {orderedMoves.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  className={clsx(
                    'history-button',
                    item.move === currentMove && 'is-current',
                  )}
                  onClick={() => setCurrentMove(item.move)}
                  aria-current={item.move === currentMove ? 'step' : undefined}
                >
                  <span className="history-title">
                    {item.player
                      ? `${playerNames[item.player]} · ${item.label}`
                      : item.label}
                  </span>
                  <span className="history-copy">
                    {item.move === currentMove
                      ? 'Текущее состояние доски'
                      : 'Перейти к этому шагу'}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      </aside>
    </div>
  );
}

type GameBoardProps = {
  board: readonly (string | null)[];
  nextPlayerName: string;
  winnerLine: Set<number>;
  disabled: boolean;
  onSquareClick: (square: number) => void;
};

function GameBoard({
  board,
  nextPlayerName,
  winnerLine,
  disabled,
  onSquareClick,
}: GameBoardProps) {
  return (
    <div className="board" role="group" aria-label="Игровая доска">
      {board.map((cell, index) => (
        <button
          key={index}
          type="button"
          className={clsx('square', winnerLine.has(index) && 'is-winning')}
          onClick={() => onSquareClick(index)}
          disabled={disabled || cell !== null}
          aria-label={
            cell
              ? `Клетка ${index + 1}, занята игроком ${cell}`
              : `Поставить метку игрока ${nextPlayerName} в клетку ${index + 1}`
          }
        >
          {cell}
        </button>
      ))}
    </div>
  );
}

type PlayerCardProps = {
  seat: 'X' | 'O';
  player: RosterMember;
};

function PlayerCard({ seat, player }: PlayerCardProps) {
  return (
    <article className="seat-card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Игрок {seat}</p>
          <h3 className="card-title">{player.name}</h3>
        </div>
        <Badge tone="accent">{player.city}</Badge>
      </div>

      <p className="panel-copy">
        {player.project}. Ментор: {player.mentor}.
      </p>
    </article>
  );
}
