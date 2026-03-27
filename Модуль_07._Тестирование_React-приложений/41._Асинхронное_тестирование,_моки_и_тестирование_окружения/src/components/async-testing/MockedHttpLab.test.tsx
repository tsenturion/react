import { render, screen } from '@testing-library/react';

import { createJsonResponse, mockFetchSequence } from '../../test/mock-fetch';
import { MockedHttpLab } from './MockedHttpLab';

test('handles mocked HTTP error and allows a successful retry', async () => {
  const fetchMock = mockFetchSequence(
    createJsonResponse(
      { items: [] },
      {
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      },
    ),
    createJsonResponse({
      items: [
        {
          id: 'retry-contract',
          title: 'Повторный запрос после ошибки',
          detail: 'Второй ответ показывает, что retry flow действительно работает.',
        },
      ],
    }),
  );

  const user = (await import('@testing-library/user-event')).default.setup();
  render(<MockedHttpLab endpoint="/api/async-playbook" />);

  await user.click(screen.getByRole('button', { name: 'Загрузить через fetch' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('HTTP 503');

  await user.click(screen.getByRole('button', { name: 'Повторить запрос' }));
  expect(await screen.findByText('Повторный запрос после ошибки')).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
