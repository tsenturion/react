import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ProfilingDebugLab } from './ProfilingDebugLab';

describe('ProfilingDebugLab', () => {
  it('recomputes report when compiler toggle changes', async () => {
    const user = userEvent.setup();

    render(<ProfilingDebugLab />);

    expect(screen.getByText('compiler on')).toBeInTheDocument();
    expect(screen.getByText('17 -> 11')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Compiler enabled'));

    expect(screen.getByText('compiler off')).toBeInTheDocument();
    expect(screen.getByText('17 -> 14')).toBeInTheDocument();
  });
});
