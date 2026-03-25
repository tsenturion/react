import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ReactProfilerLab } from './ReactProfilerLab';

describe('ReactProfilerLab', () => {
  it('records profiler commits after user input', async () => {
    const user = userEvent.setup();

    render(<ReactProfilerLab />);

    await user.clear(screen.getByLabelText('Profiler query'));
    await user.type(screen.getByLabelText('Profiler query'), 'network');

    expect(
      (await screen.findAllByText(/ResultsList|WorkspaceShell/)).length,
    ).toBeGreaterThan(0);
  });
});
