import { useReducer, type ReactNode } from 'react';

import { initialLessonViewState, lessonViewReducer } from '../lib/lesson-view-reducer';
import { LessonViewDispatchContext, LessonViewStateContext } from './lesson-view-context';

export function LessonViewProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(lessonViewReducer, initialLessonViewState);

  // State и dispatch вынесены в отдельные contexts, чтобы не смешивать чтение
  // и запись в один объект value. Это делает contract провайдера яснее уже на уровне API.
  return (
    <LessonViewDispatchContext.Provider value={dispatch}>
      <LessonViewStateContext.Provider value={state}>
        {children}
      </LessonViewStateContext.Provider>
    </LessonViewDispatchContext.Provider>
  );
}
