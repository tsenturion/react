import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { authStore } from '../lib/auth-store';
import { LoginPage } from '../pages/LoginPage';
import { renderWithQuery } from './test-utils';

describe('LoginPage', () => {
  beforeEach(() => {
    authStore.reset();
    window.localStorage.clear();
  });

  it('restores intended route after successful login', async () => {
    const user = userEvent.setup();

    renderWithQuery(
      <MemoryRouter initialEntries={['/login?redirect=%2Fapp%2Fincidents']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/app/incidents" element={<div>Incidents reached</div>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /войти и открыть dashboard/i }));

    expect(await screen.findByText('Incidents reached')).toBeInTheDocument();
  });
});
