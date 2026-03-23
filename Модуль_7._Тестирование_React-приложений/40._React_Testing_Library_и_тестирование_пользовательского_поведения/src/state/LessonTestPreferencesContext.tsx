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

export type Density = 'comfortable' | 'compact';
export type ReviewMode = 'guidance' | 'strict';

export type LessonTestPreferenceState = {
  density: Density;
  reviewMode: ReviewMode;
};

type LessonTestPreferencesContextValue = LessonTestPreferenceState & {
  setDensity: Dispatch<SetStateAction<Density>>;
  toggleReviewMode: () => void;
};

const LessonTestPreferencesContext =
  createContext<LessonTestPreferencesContextValue | null>(null);

export function LessonTestPreferencesProvider({
  children,
  initialState = { density: 'comfortable', reviewMode: 'guidance' },
}: {
  children: ReactNode;
  initialState?: LessonTestPreferenceState;
}) {
  const [density, setDensity] = useState<Density>(initialState.density);
  const [reviewMode, setReviewMode] = useState<ReviewMode>(initialState.reviewMode);

  const value = useMemo(
    () => ({
      density,
      reviewMode,
      setDensity,
      toggleReviewMode: () =>
        setReviewMode((current) => (current === 'guidance' ? 'strict' : 'guidance')),
    }),
    [density, reviewMode],
  );

  return (
    <LessonTestPreferencesContext.Provider value={value}>
      {children}
    </LessonTestPreferencesContext.Provider>
  );
}

export function useLessonTestPreferences() {
  const context = useContext(LessonTestPreferencesContext);

  if (!context) {
    throw new Error(
      'useLessonTestPreferences must be used within LessonTestPreferencesProvider.',
    );
  }

  return context;
}
