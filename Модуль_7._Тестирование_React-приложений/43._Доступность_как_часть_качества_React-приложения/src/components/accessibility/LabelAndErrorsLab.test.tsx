import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithLessonRouter } from '../../test/test-utils';
import { LabelAndErrorsLab } from './LabelAndErrorsLab';

describe('LabelAndErrorsLab', () => {
  it('moves focus to the field when the visible label is clicked', async () => {
    const { user } = renderWithLessonRouter(<LabelAndErrorsLab />);

    await user.click(screen.getByText('Тема объявления'));

    expect(screen.getByRole('textbox', { name: 'Тема объявления' })).toHaveFocus();
  });

  it('links the error to the field after validation', async () => {
    const { user } = renderWithLessonRouter(<LabelAndErrorsLab />);

    await user.click(screen.getByRole('button', { name: 'Проверить форму' }));

    const field = screen.getByRole('textbox', { name: 'Тема объявления' });
    const alert = screen.getByRole('alert');

    expect(alert).toHaveTextContent('Поле не заполнено');
    expect(field.getAttribute('aria-describedby')).toContain('error');
  });
});
