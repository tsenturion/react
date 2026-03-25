import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ProgressiveLoadingLab } from './ProgressiveLoadingLab';

describe('ProgressiveLoadingLab', () => {
  it('keeps shell metadata visible during shell-first loading', async () => {
    const user = userEvent.setup();

    render(<ProgressiveLoadingLab />);

    await user.click(screen.getByRole('button', { name: 'Загрузить heavy visual' }));

    expect(screen.getByText('Shell-first fallback')).toBeInTheDocument();
    expect(screen.getByText('Shell metadata stays visible')).toBeInTheDocument();
    expect(await screen.findByText('Shell-first chunk ready')).toBeInTheDocument();
  });
});
