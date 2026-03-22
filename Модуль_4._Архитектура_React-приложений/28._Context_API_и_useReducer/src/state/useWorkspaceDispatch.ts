import { useContext } from 'react';

import { WorkspaceDispatchContext } from './workspace-context';

export function useWorkspaceDispatch() {
  const context = useContext(WorkspaceDispatchContext);

  if (!context) {
    throw new Error('useWorkspaceDispatch must be used inside WorkspaceProvider.');
  }

  return context;
}
