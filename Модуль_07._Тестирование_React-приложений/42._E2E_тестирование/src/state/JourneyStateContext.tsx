/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type UserRole = 'qa' | 'release-manager';

export type SessionState = {
  name: string;
  role: UserRole;
} | null;

export type SubmissionSummary = {
  title: string;
  owner: string;
  scope: 'critical' | 'standard';
  notes: string;
};

export type JourneyStateSnapshot = {
  session: SessionState;
  lastSubmission: SubmissionSummary | null;
};

type JourneyStateContextValue = JourneyStateSnapshot & {
  login: (payload: NonNullable<SessionState>) => void;
  logout: () => void;
  setLastSubmission: (submission: SubmissionSummary | null) => void;
};

const JourneyStateContext = createContext<JourneyStateContextValue | null>(null);

export function JourneyStateProvider({
  children,
  initialState = { session: null, lastSubmission: null },
}: {
  children: ReactNode;
  initialState?: JourneyStateSnapshot;
}) {
  const [session, setSession] = useState<SessionState>(initialState.session);
  const [lastSubmission, setLastSubmission] = useState<SubmissionSummary | null>(
    initialState.lastSubmission,
  );

  const value = useMemo(
    () => ({
      session,
      lastSubmission,
      login: (payload: NonNullable<SessionState>) => setSession(payload),
      logout: () => setSession(null),
      setLastSubmission,
    }),
    [lastSubmission, session],
  );

  return (
    <JourneyStateContext.Provider value={value}>{children}</JourneyStateContext.Provider>
  );
}

export function useJourneyState() {
  const context = useContext(JourneyStateContext);

  if (!context) {
    throw new Error('useJourneyState must be used within JourneyStateProvider.');
  }

  return context;
}
