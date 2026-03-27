import { describe, expect, it } from 'vitest';

import { createGameHistory, deriveGameStatus, playMove, type Board } from './tic-tac-toe';

describe('tic-tac-toe model', () => {
  it('detects a winner from the current board', () => {
    let history = createGameHistory();

    for (const square of [0, 3, 1, 4, 2]) {
      history = playMove(history, history.length - 1, square);
    }

    const status = deriveGameStatus(history[history.length - 1]);

    expect(status.winner).toEqual({
      player: 'X',
      line: [0, 1, 2],
    });
  });

  it('trims future history after time travel and a new move', () => {
    let history = createGameHistory();

    for (const square of [0, 3, 1, 4]) {
      history = playMove(history, history.length - 1, square);
    }

    const nextHistory = playMove(history, 1, 8);

    expect(nextHistory).toHaveLength(3);
    expect(nextHistory[2][8]).toBe('O');
  });

  it('reports a draw when every cell is occupied and nobody won', () => {
    const drawBoard: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    const status = deriveGameStatus(drawBoard);

    expect(status.isDraw).toBe(true);
    expect(status.winner).toBeNull();
  });
});
