import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StateColocationLab } from './StateColocationLab';

function readCommitCount(label: string) {
  const text = screen.getByLabelText(label).textContent ?? '';

  return Number.parseInt(text, 10);
}

describe('StateColocationLab', () => {
  it('does not rerender colocated list while draft is still local', () => {
    render(<StateColocationLab />);

    const liftedBefore = readCommitCount('Lifted list commits');
    fireEvent.change(screen.getByLabelText('Запрос (lifted state)'), {
      target: { value: 'router' },
    });
    expect(readCommitCount('Lifted list commits')).toBeGreaterThan(liftedBefore);

    const colocatedBefore = readCommitCount('Colocated list commits');
    fireEvent.change(screen.getByLabelText('Черновик фильтра (colocated state)'), {
      target: { value: 'router' },
    });
    expect(readCommitCount('Colocated list commits')).toBe(colocatedBefore);

    fireEvent.click(screen.getByRole('button', { name: 'Применить локальный фильтр' }));
    expect(readCommitCount('Colocated list commits')).toBeGreaterThan(colocatedBefore);
  });
});
