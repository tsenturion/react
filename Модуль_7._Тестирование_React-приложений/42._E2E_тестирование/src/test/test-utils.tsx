import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';

import {
  JourneyStateProvider,
  type JourneyStateSnapshot,
} from '../state/JourneyStateContext';

export function renderWithJourneyProviders(
  ui: ReactElement,
  options?: {
    route?: string;
    initialState?: JourneyStateSnapshot;
  },
) {
  const user = userEvent.setup();

  return {
    user,
    ...render(
      <MemoryRouter initialEntries={[options?.route ?? '/']}>
        <JourneyStateProvider initialState={options?.initialState}>
          {ui}
        </JourneyStateProvider>
      </MemoryRouter>,
    ),
  };
}
