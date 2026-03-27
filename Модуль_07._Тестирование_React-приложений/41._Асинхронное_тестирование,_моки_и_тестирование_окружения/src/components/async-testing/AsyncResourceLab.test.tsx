import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import type { AsyncRecord } from '../../lib/async-testing-domain';
import { createDeferred } from '../../test/deferred';
import { AsyncResourceLab } from './AsyncResourceLab';

test('shows loading first and performs a new request after rerender with a new resource key', async () => {
  const firstRequest = createDeferred<AsyncRecord[]>();
  const secondRequest = createDeferred<AsyncRecord[]>();

  const loadRecords = vi
    .fn()
    .mockImplementationOnce(() => firstRequest.promise)
    .mockImplementationOnce(() => secondRequest.promise);

  const { rerender } = render(
    <AsyncResourceLab resourceKey="alpha" loadRecords={loadRecords} />,
  );

  expect(screen.getByRole('status')).toHaveTextContent('Загрузка сценария');

  await act(async () => {
    firstRequest.resolve([
      {
        id: 'alpha-visible-state',
        title: 'Alpha result',
        note: 'Первый ответ завершил loading-state.',
      },
    ]);
  });

  expect(await screen.findByText('Alpha result')).toBeInTheDocument();

  rerender(<AsyncResourceLab resourceKey="beta" loadRecords={loadRecords} />);

  expect(await screen.findByRole('status')).toHaveTextContent('Загрузка сценария');

  await act(async () => {
    secondRequest.resolve([
      {
        id: 'beta-visible-state',
        title: 'Beta result',
        note: 'Новый ключ вызвал новый async flow.',
      },
    ]);
  });

  expect(await screen.findByText('Beta result')).toBeInTheDocument();
  expect(loadRecords).toHaveBeenNthCalledWith(1, 'success', 'alpha');
  expect(loadRecords).toHaveBeenNthCalledWith(2, 'success', 'beta');
});
