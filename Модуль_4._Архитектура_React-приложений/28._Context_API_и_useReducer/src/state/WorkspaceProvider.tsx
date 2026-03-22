import { useReducer, type ReactNode } from 'react';

import { workspaceReducer, type WorkspaceState } from '../lib/workspace-reducer-model';
import { WorkspaceDispatchContext, WorkspaceStateContext } from './workspace-context';

export function WorkspaceProvider({
  initialState,
  children,
}: {
  initialState: WorkspaceState;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  return (
    <WorkspaceDispatchContext.Provider value={dispatch}>
      <WorkspaceStateContext.Provider value={state}>
        {children}
      </WorkspaceStateContext.Provider>
    </WorkspaceDispatchContext.Provider>
  );
}
