import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { RenderingPlaybookLab } from './RenderingPlaybookLab';

describe('RenderingPlaybookLab', () => {
  it('changes recommendation when streaming is unavailable', async () => {
    const user = userEvent.setup();

    render(<RenderingPlaybookLab />);

    expect(screen.getByText('STREAMING')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Инфраструктура умеет streaming SSR'));

    expect(screen.getByText('SSR')).toBeInTheDocument();
  });
});
