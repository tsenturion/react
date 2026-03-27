import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { DevToolsInspectorLab } from './DevToolsInspectorLab';

describe('DevToolsInspectorLab', () => {
  it('updates snapshot and render reason from interactive controls', async () => {
    const user = userEvent.setup();

    render(<DevToolsInspectorLab />);

    await user.click(screen.getByRole('button', { name: 'performance' }));
    await user.click(screen.getByRole('button', { name: /DetailPane/i }));

    expect(screen.getAllByText('render-reasons')).toHaveLength(2);
    expect(
      screen.getAllByText(/DetailPane комбинирует props, state и context/i),
    ).toHaveLength(2);
  });
});
