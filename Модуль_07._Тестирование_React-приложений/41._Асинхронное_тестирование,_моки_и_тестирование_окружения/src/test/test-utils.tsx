import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';

import {
  AsyncTestHarnessProvider,
  type AsyncHarnessState,
} from '../state/AsyncTestHarnessContext';

// Helper скрывает только повторяемый инфраструктурный шум: router и provider.
// Сами пользовательские действия и ожидания результата остаются в каждом тесте явными.
export function renderWithAsyncProviders(
  ui: ReactElement,
  options?: {
    route?: string;
    harnessState?: AsyncHarnessState;
  },
) {
  const { route = '/providers-and-context?tab=contract', harnessState } = options ?? {};

  return {
    user: userEvent.setup(),
    ...render(
      <MemoryRouter initialEntries={[route]}>
        <AsyncTestHarnessProvider initialState={harnessState}>
          {ui}
        </AsyncTestHarnessProvider>
      </MemoryRouter>,
    ),
  };
}
