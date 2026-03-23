import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ReleaseWorkbench } from '../components/testing-strategy/ReleaseWorkbench';

describe('ReleaseWorkbench integration flow', () => {
  it('requires missing checks for a critical network-sensitive release and allows confirmation after they are selected', async () => {
    const user = userEvent.setup();

    render(<ReleaseWorkbench />);

    await user.click(screen.getByRole('radio', { name: 'critical' }));
    await user.click(screen.getByRole('checkbox', { name: 'Сценарий зависит от сети' }));

    const publishButton = screen.getByRole('button', { name: 'Подтвердить релиз' });

    expect(publishButton).toBeDisabled();
    expect(screen.getByText(/integration, e2e/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'integration' }));
    await user.click(screen.getByRole('button', { name: 'e2e' }));

    expect(publishButton).toBeEnabled();

    await user.click(publishButton);

    expect(screen.getByText(/Релиз подтверждён/i)).toBeInTheDocument();
  });
});
