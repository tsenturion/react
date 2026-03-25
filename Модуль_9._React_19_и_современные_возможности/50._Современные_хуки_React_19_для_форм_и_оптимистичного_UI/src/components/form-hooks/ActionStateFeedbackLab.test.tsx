import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ActionStateFeedbackLab } from './ActionStateFeedbackLab';

describe('ActionStateFeedbackLab', () => {
  it('shows validation issue returned from useActionState', async () => {
    const user = userEvent.setup();

    render(<ActionStateFeedbackLab />);

    await user.clear(screen.getByLabelText('Title'));
    await user.type(screen.getByLabelText('Title'), 'Go');
    await user.click(screen.getByRole('button', { name: 'Submit with useActionState' }));

    expect(
      await screen.findByText(
        'Добавьте заголовок минимум из 4 символов, чтобы результат submit был различим.',
      ),
    ).toBeInTheDocument();
  });
});
