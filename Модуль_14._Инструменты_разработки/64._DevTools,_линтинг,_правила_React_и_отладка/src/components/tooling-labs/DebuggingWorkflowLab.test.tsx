import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { DebuggingWorkflowLab } from './DebuggingWorkflowLab';

describe('DebuggingWorkflowLab', () => {
  it('shows missing first tool when the workflow starts without the needed signal', async () => {
    const user = userEvent.setup();

    render(<DebuggingWorkflowLab />);

    await user.click(
      screen.getByRole('button', { name: /Компонент получает не те props/i }),
    );
    await user.click(screen.getByRole('checkbox', { name: /React DevTools/i }));

    expect(
      screen.getByText(/В диагностике отсутствует первый нужный инструмент/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Missing devtools/i)).toBeInTheDocument();
  });
});
