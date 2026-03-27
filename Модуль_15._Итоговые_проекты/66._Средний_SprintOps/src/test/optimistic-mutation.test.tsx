import { useQuery } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { useUpdateIncidentMutation } from '../features/incidents/useIncidentMutations';
import { failNextRequest, resetMockApi, setMockLatencyFactor } from '../lib/mock-api';
import { incidentsQueryOptions } from '../lib/query-options';
import { renderWithQuery } from './test-utils';

function MutationHarness() {
  const incidentsQuery = useQuery(incidentsQueryOptions());
  const updateMutation = useUpdateIncidentMutation();
  const incident = incidentsQuery.data?.find((item) => item.id === 'INC-402');

  if (!incident) {
    return <div>Loading incident</div>;
  }

  return (
    <div>
      <p data-testid="status">{incident.status}</p>
      <button
        type="button"
        onClick={() =>
          updateMutation.mutate({
            incidentId: incident.id,
            patch: { status: 'resolved' },
          })
        }
      >
        Resolve incident
      </button>
      {updateMutation.isError ? (
        <div role="alert">{updateMutation.error.message}</div>
      ) : null}
    </div>
  );
}

describe('optimistic incident mutation', () => {
  beforeEach(() => {
    resetMockApi();
    setMockLatencyFactor(0.1);
  });

  it('updates UI immediately and rolls back after server error', async () => {
    const user = userEvent.setup();

    renderWithQuery(<MutationHarness />);

    expect(await screen.findByTestId('status')).toHaveTextContent('blocked');

    failNextRequest('mutation');
    await user.click(screen.getByRole('button', { name: /resolve incident/i }));

    expect(screen.getByTestId('status')).toHaveTextContent('resolved');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /локальный optimistic state/i,
    );
    expect(screen.getByTestId('status')).toHaveTextContent('blocked');
  });
});
