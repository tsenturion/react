import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ServerFormsLab } from './ServerFormsLab';

describe('ServerFormsLab', () => {
  it('submits the draft form and shows server result', async () => {
    const user = userEvent.setup();

    render(<ServerFormsLab />);

    await user.click(screen.getByRole('button', { name: 'Сохранить черновик' }));

    expect(await screen.findByText('Черновик сохранён')).toBeInTheDocument();
    expect(screen.getByText(/persist draft revision/i)).toBeInTheDocument();
  });
});
