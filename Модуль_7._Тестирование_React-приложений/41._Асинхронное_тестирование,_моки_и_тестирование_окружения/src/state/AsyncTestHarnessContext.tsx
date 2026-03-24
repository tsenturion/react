/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

export type AssertionMode = 'integration' | 'isolated';
export type NetworkMode = 'mocked-http' | 'injected-client';

export type AsyncHarnessState = {
  assertionMode: AssertionMode;
  networkMode: NetworkMode;
};

type AsyncHarnessContextValue = AsyncHarnessState & {
  setAssertionMode: Dispatch<SetStateAction<AssertionMode>>;
  toggleNetworkMode: () => void;
};

const AsyncTestHarnessContext = createContext<AsyncHarnessContextValue | null>(null);

export function AsyncTestHarnessProvider({
  children,
  initialState = { assertionMode: 'integration', networkMode: 'mocked-http' },
}: {
  children: ReactNode;
  initialState?: AsyncHarnessState;
}) {
  const [assertionMode, setAssertionMode] = useState<AssertionMode>(
    initialState.assertionMode,
  );
  const [networkMode, setNetworkMode] = useState<NetworkMode>(initialState.networkMode);

  const value = useMemo(
    () => ({
      assertionMode,
      networkMode,
      setAssertionMode,
      toggleNetworkMode: () =>
        setNetworkMode((current) =>
          current === 'mocked-http' ? 'injected-client' : 'mocked-http',
        ),
    }),
    [assertionMode, networkMode],
  );

  return (
    <AsyncTestHarnessContext.Provider value={value}>
      {children}
    </AsyncTestHarnessContext.Provider>
  );
}

export function useAsyncTestHarness() {
  const context = useContext(AsyncTestHarnessContext);

  if (!context) {
    throw new Error('useAsyncTestHarness must be used within AsyncTestHarnessProvider.');
  }

  return context;
}
