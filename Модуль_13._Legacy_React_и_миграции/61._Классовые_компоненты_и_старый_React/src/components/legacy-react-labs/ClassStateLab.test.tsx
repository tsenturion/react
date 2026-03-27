import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ClassStateLab } from './ClassStateLab';

describe('ClassStateLab', () => {
  it('shows difference between object-form and updater-form queues', async () => {
    const user = userEvent.setup();

    render(<ClassStateLab />);

    expect(screen.getByText('Счётчик: 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Object-form +2' }));
    expect(screen.getByText('Счётчик: 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Сбросить лабораторию' }));
    expect(screen.getByText('Счётчик: 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Updater-form +2' }));
    expect(screen.getByText('Счётчик: 4')).toBeInTheDocument();
  });
});
