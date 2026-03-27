import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Helper скрывает только MemoryRouter для компонентных тестов.
// Сами роли, имена, keyboard flow и итоговое поведение остаются в каждом тесте явными.
export function renderWithLessonRouter(
  ui: ReactElement,
  options?: {
    route?: string;
  },
) {
  const { route = '/labels-and-names' } = options ?? {};

  return {
    user: userEvent.setup(),
    ...render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>),
  };
}
