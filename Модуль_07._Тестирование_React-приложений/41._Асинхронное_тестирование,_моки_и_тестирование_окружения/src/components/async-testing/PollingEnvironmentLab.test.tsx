import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { PollingEnvironmentLab } from './PollingEnvironmentLab';

test('uses fake timers to advance polling without real waiting', async () => {
  vi.useFakeTimers();

  render(<PollingEnvironmentLab intervalMs={1000} />);

  fireEvent.click(screen.getByRole('button', { name: 'Запустить polling' }));

  act(() => {
    vi.advanceTimersByTime(3000);
  });

  expect(screen.getByRole('status')).toHaveTextContent('Снимок обновлён 3 раз');

  fireEvent.click(screen.getByRole('button', { name: 'Остановить polling' }));

  act(() => {
    vi.advanceTimersByTime(2000);
  });

  expect(screen.getByRole('status')).toHaveTextContent('Снимок обновлён 3 раз');
  expect(screen.getByRole('status')).toHaveTextContent('Polling остановлен');
});
