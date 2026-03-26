export type CatalogState =
  | { readonly status: 'loading' }
  | { readonly status: 'error'; readonly message: string }
  | { readonly status: 'empty'; readonly reason: string }
  | { readonly status: 'ready'; readonly items: readonly string[] };

export function buildCatalogState(input: {
  readonly fetchMode: 'success' | 'empty' | 'error';
  readonly query: string;
}): CatalogState {
  if (input.fetchMode === 'error') {
    return {
      status: 'error',
      message: 'Справочник не загрузился из-за сетевой ошибки.',
    };
  }

  if (input.fetchMode === 'empty' || input.query.trim() === 'none') {
    return {
      status: 'empty',
      reason: 'Для текущего запроса не нашлось ни одной записи.',
    };
  }

  return {
    status: 'ready',
    items: [
      `${input.query || 'typed'} summary`,
      `${input.query || 'typed'} details`,
      `${input.query || 'typed'} diagnostics`,
    ],
  };
}

export function describeCatalogState(state: CatalogState): string {
  switch (state.status) {
    case 'loading':
      return 'Загрузка ещё не завершилась.';
    case 'error':
      return state.message;
    case 'empty':
      return state.reason;
    case 'ready':
      return `Готово элементов: ${state.items.length}`;
    default:
      return assertNever(state);
  }
}

// Exhaustive helper нужен здесь не ради "трюка TS", а чтобы пропуск новой ветки
// состояния сразу ломал сборку, а не тихо вёл к сломанному UI.
function assertNever(value: never): never {
  throw new Error(`Unhandled state: ${JSON.stringify(value)}`);
}
