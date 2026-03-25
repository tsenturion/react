import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MemoBoundariesLab } from './MemoBoundariesLab';

function readCommitCount(label: string) {
  const text = screen.getByLabelText(label).textContent ?? '';

  return Number.parseInt(text, 10);
}

describe('MemoBoundariesLab', () => {
  it('keeps memo child stable on unrelated shell updates until unstable object props are enabled', () => {
    render(<MemoBoundariesLab />);

    const memoBefore = readCommitCount('Memo child commits');
    fireEvent.change(screen.getByLabelText('Unrelated shell state'), {
      target: { value: 'Shell note changed only in parent.' },
    });
    const memoAfterStable = readCommitCount('Memo child commits');

    expect(memoAfterStable).toBe(memoBefore);

    fireEvent.click(screen.getByLabelText('Передавать derived object prop'));
    fireEvent.change(screen.getByLabelText('Unrelated shell state'), {
      target: { value: 'Shell note changed again.' },
    });

    const memoAfterUnstable = readCommitCount('Memo child commits');
    expect(memoAfterUnstable).toBeGreaterThan(memoAfterStable);
  });
});
