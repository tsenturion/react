import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { RenderingDirectionLab } from './RenderingDirectionLab';

describe('RenderingDirectionLab', () => {
  it('shows request-time shell for personalized route', async () => {
    const user = userEvent.setup();

    render(<RenderingDirectionLab />);

    await user.click(screen.getByRole('button', { name: /Shell персонализирован/i }));

    expect(screen.getByText('Request-time shell')).toBeInTheDocument();
  });
});
