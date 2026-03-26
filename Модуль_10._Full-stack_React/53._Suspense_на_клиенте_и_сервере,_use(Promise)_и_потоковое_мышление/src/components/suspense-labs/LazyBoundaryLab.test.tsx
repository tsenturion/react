import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { LazyBoundaryLab } from './LazyBoundaryLab';

describe('LazyBoundaryLab', () => {
  it('loads glossary chunk through React.lazy and Suspense', async () => {
    const user = userEvent.setup();

    render(<LazyBoundaryLab />);

    await user.click(screen.getByRole('button', { name: 'Открыть glossary' }));

    expect(await screen.findByText('Glossary chunk loaded')).toBeInTheDocument();
  });
});
