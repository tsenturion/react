import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FormStatusInspectorLab } from './FormStatusInspectorLab';

describe('FormStatusInspectorLab', () => {
  it('shows pending label from nearest form context', async () => {
    const user = userEvent.setup();

    render(<FormStatusInspectorLab />);

    await user.click(screen.getByRole('button', { name: 'Submit with useFormStatus' }));

    expect(
      screen.getByRole('button', { name: 'Sending from nearest form…' }),
    ).toBeDisabled();
    expect(screen.getByText('Форма сейчас отправляет title')).toBeInTheDocument();
  });
});
