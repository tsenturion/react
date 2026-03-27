import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { OptimisticQueueLab } from './OptimisticQueueLab';

describe('OptimisticQueueLab', () => {
  it('shows optimistic card and then confirmed result', async () => {
    const user = userEvent.setup();

    render(<OptimisticQueueLab />);

    await user.click(screen.getByRole('button', { name: 'Add optimistic update' }));

    expect(await screen.findByText('overlay active')).toBeInTheDocument();
    expect(await screen.findAllByText('sending')).not.toHaveLength(0);

    await screen.findByText(
      'Сервер подтвердил "Optimistic release note". Теперь запись стала частью базового состояния.',
    );
    await waitFor(() => {
      expect(screen.queryByText('overlay active')).not.toBeInTheDocument();
    });
  });
});
