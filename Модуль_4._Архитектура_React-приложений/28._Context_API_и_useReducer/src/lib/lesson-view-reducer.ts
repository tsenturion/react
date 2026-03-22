import type { LabId } from './learning-model';

export type ViewDensity = 'comfortable' | 'compact';
export type ViewLens = 'tree' | 'logic';

export type LessonViewState = {
  activeLabId: LabId;
  density: ViewDensity;
  lens: ViewLens;
};

export type LessonViewAction =
  | { type: 'lab/select'; labId: LabId }
  | { type: 'density/set'; density: ViewDensity }
  | { type: 'lens/set'; lens: ViewLens };

export const initialLessonViewState: LessonViewState = {
  activeLabId: 'context',
  density: 'comfortable',
  lens: 'tree',
};

export function lessonViewReducer(
  state: LessonViewState,
  action: LessonViewAction,
): LessonViewState {
  switch (action.type) {
    case 'lab/select':
      return {
        ...state,
        activeLabId: action.labId,
      };

    case 'density/set':
      return {
        ...state,
        density: action.density,
      };

    case 'lens/set':
      return {
        ...state,
        lens: action.lens,
      };

    default:
      return state;
  }
}
