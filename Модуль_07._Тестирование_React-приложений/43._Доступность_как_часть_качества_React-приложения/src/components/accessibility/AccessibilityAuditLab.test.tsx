import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithLessonRouter } from '../../test/test-utils';
import { AccessibilityAuditLab } from './AccessibilityAuditLab';

describe('AccessibilityAuditLab', () => {
  it('reports a missing visible label in the live audit', async () => {
    const { user } = renderWithLessonRouter(<AccessibilityAuditLab />);

    await user.click(screen.getByLabelText('У поля есть видимая label'));
    await user.click(screen.getByRole('button', { name: 'Запустить аудит' }));

    expect(screen.getByText('Контролу доступно имя')).toBeInTheDocument();
    expect(screen.getByText(/У поля нет связанной видимой label/i)).toBeInTheDocument();
  });

  it('keeps the submit control discoverable by role when button is used', () => {
    renderWithLessonRouter(<AccessibilityAuditLab />);

    expect(screen.getByRole('button', { name: 'Отправить форму' })).toBeInTheDocument();
  });
});
