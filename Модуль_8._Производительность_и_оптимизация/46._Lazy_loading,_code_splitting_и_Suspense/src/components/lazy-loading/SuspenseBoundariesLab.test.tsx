import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { SuspenseBoundariesLab } from './SuspenseBoundariesLab';

describe('SuspenseBoundariesLab', () => {
  it('keeps workspace shell visible with local boundary fallback', async () => {
    const user = userEvent.setup();

    render(<SuspenseBoundariesLab />);

    await user.click(screen.getByRole('button', { name: 'Открыть heavy widget' }));

    expect(screen.getByText('Локальный fallback')).toBeInTheDocument();
    expect(screen.getByText('Sidebar stays visible')).toBeInTheDocument();
    expect(await screen.findByText('Local boundary widget ready')).toBeInTheDocument();
  });

  it('replaces workspace with global fallback when boundary is too high', async () => {
    const user = userEvent.setup();

    render(<SuspenseBoundariesLab />);

    await user.click(screen.getByRole('button', { name: 'Global boundary' }));
    await user.click(screen.getByRole('button', { name: 'Открыть heavy widget' }));

    expect(screen.getByText('Глобальный fallback')).toBeInTheDocument();
    expect(screen.queryByText('Sidebar stays visible')).not.toBeInTheDocument();
    expect(await screen.findByText('Global boundary widget ready')).toBeInTheDocument();
  });
});
