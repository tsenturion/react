import { useContext } from 'react';

import { LessonViewStateContext } from './lesson-view-context';

export function useLessonViewState() {
  const context = useContext(LessonViewStateContext);

  if (!context) {
    throw new Error('useLessonViewState must be used inside LessonViewProvider.');
  }

  return context;
}
