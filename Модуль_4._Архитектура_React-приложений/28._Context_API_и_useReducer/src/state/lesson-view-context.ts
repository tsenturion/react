import { createContext, type Dispatch } from 'react';

import type { LessonViewAction, LessonViewState } from '../lib/lesson-view-reducer';

export const LessonViewStateContext = createContext<LessonViewState | null>(null);
export const LessonViewDispatchContext = createContext<Dispatch<LessonViewAction> | null>(
  null,
);
