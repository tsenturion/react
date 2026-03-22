import { useContext } from 'react';

import { WorkspaceStateContext } from './workspace-context';

export function useWorkspaceState() {
  const context = useContext(WorkspaceStateContext);

  if (!context) {
    throw new Error('useWorkspaceState must be used inside WorkspaceProvider.');
  }

  return context;
}
