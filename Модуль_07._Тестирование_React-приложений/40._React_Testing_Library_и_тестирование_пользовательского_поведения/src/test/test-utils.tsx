import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';

import {
  LessonTestPreferencesProvider,
  type LessonTestPreferenceState,
} from '../state/LessonTestPreferencesContext';

type RenderOptions = {
  route?: string;
  preferenceState?: LessonTestPreferenceState;
};

// Helper прячет только повторяемый router/provider setup.
// Сам пользовательский сценарий всё ещё читается прямо в тесте.
export function renderWithLessonProviders(
  ui: ReactElement,
  {
    route = '/custom-render',
    preferenceState = { density: 'comfortable', reviewMode: 'guidance' },
  }: RenderOptions = {},
) {
  const user = userEvent.setup();

  return {
    user,
    ...render(
      <MemoryRouter initialEntries={[route]}>
        <LessonTestPreferencesProvider initialState={preferenceState}>
          {ui}
        </LessonTestPreferencesProvider>
      </MemoryRouter>,
    ),
  };
}
