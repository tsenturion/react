import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { DeprecatedDomApisLab } from './DeprecatedDomApisLab';

describe('DeprecatedDomApisLab', () => {
  it('switches summary when runtime mode changes to React 19 breakage', async () => {
    const user = userEvent.setup();

    render(<DeprecatedDomApisLab />);

    await user.click(screen.getByRole('button', { name: '19 breakage' }));

    expect(screen.getByText(/React 19 сломает/i)).toBeInTheDocument();
  });
});
