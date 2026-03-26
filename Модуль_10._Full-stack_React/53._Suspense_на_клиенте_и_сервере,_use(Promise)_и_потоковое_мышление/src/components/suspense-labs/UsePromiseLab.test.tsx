import { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { UsePromiseLab } from './UsePromiseLab';

describe('UsePromiseLab', () => {
  it('switches between shared and segmented resource boundaries', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<UsePromiseLab />);
    });

    expect(screen.getByText('Shared summary ждёт bundle')).toBeInTheDocument();
    expect(screen.getByText('Оба блока читают один promise')).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Раздельные ресурсы' }));
    });

    expect(screen.getByText('Summary ждёт свой resource')).toBeInTheDocument();
    expect(screen.getByText('Каждый блок ждёт свой promise')).toBeInTheDocument();
  });
});
