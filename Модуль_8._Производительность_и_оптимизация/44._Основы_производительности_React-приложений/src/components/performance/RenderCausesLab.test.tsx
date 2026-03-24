import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RenderCausesLab } from './RenderCausesLab';

function readCommitCount(label: string) {
  const text = screen.getByLabelText(label).textContent ?? '';

  return Number.parseInt(text, 10);
}

describe('RenderCausesLab', () => {
  it('keeps memo preview stable on parent-only updates until unstable object props are enabled', () => {
    render(<RenderCausesLab />);

    const previewBefore = readCommitCount('Preview commits');
    fireEvent.change(screen.getByLabelText('Небольшое изменение shell state'), {
      target: { value: 'Новая заметка только для shell.' },
    });
    const previewAfterStable = readCommitCount('Preview commits');

    expect(previewAfterStable).toBe(previewBefore);

    fireEvent.click(
      screen.getByLabelText('Передавать новый объект props на каждый рендер'),
    );
    fireEvent.change(screen.getByLabelText('Небольшое изменение shell state'), {
      target: { value: 'Shell снова обновился.' },
    });

    const previewAfterUnstable = readCommitCount('Preview commits');
    expect(previewAfterUnstable).toBeGreaterThan(previewAfterStable);
  });
});
