import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { UseCallbackLab } from './UseCallbackLab';

function readCommitCount(label: string) {
  const text = screen.getByLabelText(label).textContent ?? '';

  return Number.parseInt(text, 10);
}

describe('UseCallbackLab', () => {
  it('keeps memo row stable on unrelated shell updates until stable callback is disabled', () => {
    render(<UseCallbackLab />);

    const rowLabel = 'Row commits: Render scan';
    const stableBefore = readCommitCount(rowLabel);

    fireEvent.change(screen.getByLabelText('Parent shell note'), {
      target: { value: 'Parent note changed with stable callback.' },
    });

    const stableAfter = readCommitCount(rowLabel);
    expect(stableAfter).toBe(stableBefore);

    fireEvent.click(screen.getByLabelText('Использовать стабильный callback'));
    fireEvent.change(screen.getByLabelText('Parent shell note'), {
      target: { value: 'Parent note changed with unstable callback.' },
    });

    expect(readCommitCount(rowLabel)).toBeGreaterThan(stableAfter);
  });
});
