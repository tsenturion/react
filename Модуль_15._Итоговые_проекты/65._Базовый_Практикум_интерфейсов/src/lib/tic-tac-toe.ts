export type Player = 'X' | 'O';
export type SquareValue = Player | null;
export type Board = SquareValue[];
export type WinnerLine = [number, number, number];

export type Winner = {
  player: Player;
  line: WinnerLine;
};

export type GameStatus = {
  winner: Winner | null;
  nextPlayer: Player;
  isDraw: boolean;
  label: string;
  occupiedCount: number;
  availableMoves: number;
};

export type MoveItem = {
  key: string;
  move: number;
  player: Player | null;
  square: number | null;
  label: string;
};

const WIN_LINES: readonly WinnerLine[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () => null);
}

export function createGameHistory(): Board[] {
  return [createEmptyBoard()];
}

export function calculateNextPlayer(board: readonly SquareValue[]): Player {
  const xCount = board.filter((cell) => cell === 'X').length;
  const oCount = board.filter((cell) => cell === 'O').length;

  return xCount <= oCount ? 'X' : 'O';
}

export function calculateWinner(board: readonly SquareValue[]): Winner | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        player: board[a],
        line,
      };
    }
  }

  return null;
}

export function makeMove(board: readonly SquareValue[], square: number): Board {
  if (square < 0 || square > 8 || board[square] || calculateWinner(board)) {
    return [...board];
  }

  const nextBoard = [...board];
  nextBoard[square] = calculateNextPlayer(board);

  return nextBoard;
}

export function playMove(
  history: readonly Board[],
  currentMove: number,
  square: number,
): Board[] {
  const timeline = history.slice(0, currentMove + 1);
  const currentBoard = timeline[timeline.length - 1];
  const nextBoard = makeMove(currentBoard, square);

  if (nextBoard.every((value, index) => value === currentBoard[index])) {
    return [...history];
  }

  return [...timeline, nextBoard];
}

function findChangedSquare(
  previousBoard: readonly SquareValue[],
  nextBoard: readonly SquareValue[],
) {
  for (let index = 0; index < nextBoard.length; index += 1) {
    if (previousBoard[index] !== nextBoard[index]) {
      return index;
    }
  }

  return null;
}

export function buildMoveItems(history: readonly Board[]): MoveItem[] {
  return history.map((board, move) => {
    if (move === 0) {
      return {
        key: 'move-0',
        move,
        player: null,
        square: null,
        label: 'Стартовая доска',
      };
    }

    const previousBoard = history[move - 1];
    const square = findChangedSquare(previousBoard, board);
    const player = square === null ? null : board[square];

    return {
      key: `move-${move}`,
      move,
      player,
      square,
      label:
        square === null || player === null
          ? `Ход ${move}`
          : `Ход ${move}: ${player} в клетку ${square + 1}`,
    };
  });
}

export function deriveGameStatus(board: readonly SquareValue[]): GameStatus {
  const winner = calculateWinner(board);
  const occupiedCount = board.filter(Boolean).length;
  const availableMoves = board.length - occupiedCount;
  const isDraw = winner === null && availableMoves === 0;
  const nextPlayer = calculateNextPlayer(board);

  if (winner) {
    return {
      winner,
      nextPlayer,
      isDraw: false,
      label: `Победил ${winner.player}. Линия: ${winner.line
        .map((cell) => cell + 1)
        .join(', ')}.`,
      occupiedCount,
      availableMoves,
    };
  }

  if (isDraw) {
    return {
      winner: null,
      nextPlayer,
      isDraw: true,
      label: 'Ничья. Все клетки заняты, поэтому следующий ход невозможен.',
      occupiedCount,
      availableMoves,
    };
  }

  return {
    winner: null,
    nextPlayer,
    isDraw: false,
    label: `Следующий ход за ${nextPlayer}. Свободных клеток: ${availableMoves}.`,
    occupiedCount,
    availableMoves,
  };
}
