import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { FormActionButtonsLab } from './FormActionButtonsLab';

describe('FormActionButtonsLab', () => {
  it('runs button-specific formAction for draft path', async () => {
    const user = userEvent.setup();

    render(<FormActionButtonsLab />);

    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    expect(
      await screen.findByText(
        /сохранён без публикации и может вернуться в редактирование/,
      ),
    ).toBeInTheDocument();
  });
});
