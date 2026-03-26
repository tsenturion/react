import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ConfigurationRolloutLab } from './ConfigurationRolloutLab';

describe('ConfigurationRolloutLab', () => {
  it('updates compiler config snippet when annotation mode is selected', async () => {
    const user = userEvent.setup();

    render(<ConfigurationRolloutLab />);

    await user.click(screen.getByRole('button', { name: 'Annotation' }));

    expect(screen.getByText(/compilationMode: 'annotation'/i)).toBeInTheDocument();
  });
});
