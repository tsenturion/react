import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { ReleaseFormLab } from '../components/e2e/ReleaseFormLab';
import { SubmissionReviewPage } from '../pages/SubmissionReviewPage';
import { JourneyStateProvider } from '../state/JourneyStateContext';

describe('release form flow', () => {
  it('submits draft and opens review route', async () => {
    const user = userEvent.setup();

    render(
      <JourneyStateProvider>
        <MemoryRouter initialEntries={['/form-journeys']}>
          <Routes>
            <Route path="form-journeys" element={<ReleaseFormLab />} />
            <Route path="submission-review" element={<SubmissionReviewPage />} />
          </Routes>
        </MemoryRouter>
      </JourneyStateProvider>,
    );

    await user.clear(screen.getByLabelText('Название релизного сценария'));
    await user.type(
      screen.getByLabelText('Название релизного сценария'),
      'Checkout smoke after auth redirect',
    );
    await user.clear(screen.getByLabelText('Ответственный поток'));
    await user.type(screen.getByLabelText('Ответственный поток'), 'growth-ui');
    await user.clear(screen.getByLabelText('Примечание для review screen'));
    await user.type(
      screen.getByLabelText('Примечание для review screen'),
      'Проверить форму, переход на review screen и итоговый текст подтверждения.',
    );
    await user.click(screen.getByRole('button', { name: 'Отправить на review screen' }));

    expect(
      await screen.findByText(/Checkout smoke after auth redirect/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Review screen готов');
  });
});
