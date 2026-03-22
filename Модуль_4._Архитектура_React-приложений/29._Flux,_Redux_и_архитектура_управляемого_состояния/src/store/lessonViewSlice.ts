import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { LabId } from '../lib/learning-model';

export type ViewDensity = 'comfortable' | 'compact';
export type ViewLens = 'flow' | 'structure';

type LessonViewState = {
  activeLabId: LabId;
  density: ViewDensity;
  lens: ViewLens;
};

const initialState: LessonViewState = {
  activeLabId: 'flux',
  density: 'comfortable',
  lens: 'flow',
};

export const lessonViewSlice = createSlice({
  name: 'lessonView',
  initialState,
  reducers: {
    labSelected(state, action: PayloadAction<LabId>) {
      state.activeLabId = action.payload;
    },
    densitySet(state, action: PayloadAction<ViewDensity>) {
      state.density = action.payload;
    },
    lensSet(state, action: PayloadAction<ViewLens>) {
      state.lens = action.payload;
    },
  },
});

export const { labSelected, densitySet, lensSet } = lessonViewSlice.actions;
