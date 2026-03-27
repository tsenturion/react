import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ErrorBoundariesLab } from './ErrorBoundariesLab';

describe('ErrorBoundariesLab', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('contains widget crash inside local boundary and keeps sibling alive', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<ErrorBoundariesLab />);

    await user.click(screen.getByRole('button', { name: 'Уронить проблемный виджет' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Boundary поймал ошибку');

    await user.click(screen.getByRole('button', { name: 'Обновить соседний счётчик' }));

    expect(screen.getByText('Счётчик соседнего виджета: 1')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
