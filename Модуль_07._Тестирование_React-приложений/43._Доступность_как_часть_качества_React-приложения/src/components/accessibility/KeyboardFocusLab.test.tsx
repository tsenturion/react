import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithLessonRouter } from '../../test/test-utils';
import { KeyboardFocusLab } from './KeyboardFocusLab';

describe('KeyboardFocusLab', () => {
  it('focuses the search field when the dialog opens and restores focus on Escape', async () => {
    const { user } = renderWithLessonRouter(<KeyboardFocusLab />);

    await user.click(screen.getByRole('button', { name: 'Открыть диалог действий' }));

    const dialogField = screen.getByRole('textbox', { name: 'Поиск по действиям' });
    expect(dialogField).toHaveFocus();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Открыть диалог действий' }),
      ).toHaveFocus();
    });
  });
});
