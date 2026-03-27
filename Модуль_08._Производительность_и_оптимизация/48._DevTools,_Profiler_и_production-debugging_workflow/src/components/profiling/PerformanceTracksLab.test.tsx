import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { PerformanceTracksLab } from './PerformanceTracksLab';

describe('PerformanceTracksLab', () => {
  it('records a browser-like trace', async () => {
    const user = userEvent.setup();

    render(<PerformanceTracksLab />);

    await user.click(screen.getByRole('button', { name: 'Record interaction trace' }));

    expect(await screen.findByText('React render work')).toBeInTheDocument();
    expect(await screen.findByText('Paint visible frame')).toBeInTheDocument();
  });
});
