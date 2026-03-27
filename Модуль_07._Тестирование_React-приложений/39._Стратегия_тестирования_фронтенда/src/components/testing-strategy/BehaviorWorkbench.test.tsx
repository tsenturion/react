import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { BehaviorWorkbench } from './BehaviorWorkbench';

describe('BehaviorWorkbench', () => {
  it('enables save only when the visible scenario is ready and shows a status banner after save', async () => {
    const user = userEvent.setup();

    render(<BehaviorWorkbench />);

    const saveButton = screen.getByRole('button', { name: 'Сохранить сценарий' });

    expect(saveButton).toBeDisabled();

    await user.click(screen.getByLabelText('Есть воспроизводимые шаги'));

    expect(saveButton).toBeEnabled();

    await user.click(saveButton);

    expect(screen.getByRole('status')).toHaveTextContent(
      /сценарий сохранён для regression pack/i,
    );
  });

  it('drops back to invalid state after the title becomes too short', async () => {
    const user = userEvent.setup();

    render(<BehaviorWorkbench />);

    await user.click(screen.getByLabelText('Есть воспроизводимые шаги'));
    await user.clear(screen.getByLabelText('Название сценария'));
    await user.type(screen.getByLabelText('Название сценария'), 'abc');

    expect(screen.getByRole('button', { name: 'Сохранить сценарий' })).toBeDisabled();
  });
});
