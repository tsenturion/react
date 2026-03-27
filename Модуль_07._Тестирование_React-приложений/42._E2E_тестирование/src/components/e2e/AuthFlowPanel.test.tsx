import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { JourneyStateProvider } from '../../state/JourneyStateContext';
import { AuthFlowPanel } from './AuthFlowPanel';

describe('AuthFlowPanel', () => {
  it('restores intended path after login', async () => {
    const user = userEvent.setup();

    render(
      <JourneyStateProvider>
        <MemoryRouter initialEntries={['/auth/login?intent=/workspace/release']}>
          <Routes>
            <Route path="auth/login" element={<AuthFlowPanel mode="screen" />} />
            <Route
              path="workspace/release"
              element={<div>Protected route reached</div>}
            />
          </Routes>
        </MemoryRouter>
      </JourneyStateProvider>,
    );

    await user.clear(screen.getByLabelText('Имя в сессии'));
    await user.type(screen.getByLabelText('Имя в сессии'), 'Надежда QA');
    await user.selectOptions(screen.getByLabelText('Роль в сессии'), 'release-manager');
    await user.click(screen.getByRole('button', { name: 'Войти и продолжить' }));

    expect(await screen.findByText('Protected route reached')).toBeInTheDocument();
  });
});
