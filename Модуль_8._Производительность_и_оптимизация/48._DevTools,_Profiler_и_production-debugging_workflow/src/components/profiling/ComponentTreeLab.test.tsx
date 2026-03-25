import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ComponentTreeLab } from './ComponentTreeLab';

describe('ComponentTreeLab', () => {
  it('updates analysis when tree mode changes', async () => {
    const user = userEvent.setup();

    render(<ComponentTreeLab />);

    await user.click(screen.getByRole('button', { name: 'Isolated branch' }));

    expect(
      screen.getAllByText(/Источник обновления изолирован рядом с проблемной веткой/)
        .length,
    ).toBeGreaterThan(0);
  });
});
