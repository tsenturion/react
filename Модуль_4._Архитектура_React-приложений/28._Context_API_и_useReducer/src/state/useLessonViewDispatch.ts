import { useContext } from 'react';

import { LessonViewDispatchContext } from './lesson-view-context';

export function useLessonViewDispatch() {
  const context = useContext(LessonViewDispatchContext);

  if (!context) {
    throw new Error('useLessonViewDispatch must be used inside LessonViewProvider.');
  }

  return context;
}
