import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { UseMemoDerivedLab } from './UseMemoDerivedLab';

function readCommitCount(label: string) {
  const text = screen.getByLabelText(label).textContent ?? '';

  return Number.parseInt(text, 10);
}

describe('UseMemoDerivedLab', () => {
  it('keeps memoized projection stable on unrelated shell updates', () => {
    render(<UseMemoDerivedLab />);

    const directBefore = readCommitCount('Direct projection commits');
    const memoBefore = readCommitCount('Memo projection commits');

    fireEvent.change(screen.getByLabelText('Unrelated shell note'), {
      target: { value: 'Shell note changed without filter update.' },
    });

    expect(readCommitCount('Direct projection commits')).toBeGreaterThan(directBefore);
    expect(readCommitCount('Memo projection commits')).toBe(memoBefore);
  });
});
