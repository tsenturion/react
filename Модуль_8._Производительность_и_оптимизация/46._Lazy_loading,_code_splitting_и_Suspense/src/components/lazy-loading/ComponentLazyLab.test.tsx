import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ComponentLazyLab } from './ComponentLazyLab';

describe('ComponentLazyLab', () => {
  it('shows local fallback and then resolves lazy component chunk', async () => {
    const user = userEvent.setup();

    render(<ComponentLazyLab />);

    await user.click(screen.getByRole('button', { name: 'Открыть панель' }));

    expect(screen.getByText('Chunk панели загружается')).toBeInTheDocument();
    expect(await screen.findByText('Bundle radar loaded')).toBeInTheDocument();
  });
});
