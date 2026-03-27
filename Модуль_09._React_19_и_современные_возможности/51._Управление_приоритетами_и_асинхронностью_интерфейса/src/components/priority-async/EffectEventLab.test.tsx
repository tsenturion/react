import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { EffectEventLab } from './EffectEventLab';

describe('EffectEventLab', () => {
  it('keeps effect-event subscription stable when theme changes', async () => {
    const user = userEvent.setup();

    render(<EffectEventLab />);

    await user.selectOptions(screen.getByLabelText('Visual theme'), 'contrast');

    const panels = screen.getAllByText(/Subscriptions/i);
    expect(
      within(panels[0].closest('section') as HTMLElement).getByText('2'),
    ).toBeInTheDocument();
    expect(
      within(panels[1].closest('section') as HTMLElement).getByText('1'),
    ).toBeInTheDocument();
  });
});
