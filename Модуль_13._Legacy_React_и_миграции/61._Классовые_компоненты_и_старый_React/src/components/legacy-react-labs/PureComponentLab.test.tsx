import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { PureComponentLab } from './PureComponentLab';

describe('PureComponentLab', () => {
  it('shows mutation pitfall for PureComponent', async () => {
    const user = userEvent.setup();

    render(<PureComponentLab />);

    expect(screen.getByText('Regular reviews: 2')).toBeInTheDocument();
    expect(screen.getByText('Pure reviews: 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Мутировать объект по ссылке' }));

    expect(screen.getByText('Regular reviews: 3')).toBeInTheDocument();
    expect(screen.getByText('Pure reviews: 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Обновить иммутабельно' }));

    expect(screen.getByText('Pure reviews: 4')).toBeInTheDocument();
  });
});
