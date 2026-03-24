import { screen } from '@testing-library/react';

import { renderWithAsyncProviders } from '../../test/test-utils';
import { ProviderHarnessLab } from './ProviderHarnessLab';

test('uses the shared async provider helper without hiding the visible scenario', async () => {
  const { user } = renderWithAsyncProviders(<ProviderHarnessLab />, {
    route: '/providers-and-context?tab=retry',
    harnessState: {
      assertionMode: 'isolated',
      networkMode: 'mocked-http',
    },
  });

  expect(screen.getByText('/providers-and-context')).toBeInTheDocument();
  expect(screen.getByText('?tab=retry')).toBeInTheDocument();
  expect(screen.getByText('isolated')).toBeInTheDocument();
  expect(screen.getByText('mocked-http')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Показать contract summary' }));
  expect(
    screen.getByText(/Focused render helper должен скрывать только повторяемые/),
  ).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Переключить assertion mode' }));
  expect(screen.getByText('integration')).toBeInTheDocument();
});
