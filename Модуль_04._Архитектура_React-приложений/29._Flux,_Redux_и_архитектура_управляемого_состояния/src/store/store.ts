import { configureStore } from '@reduxjs/toolkit';

import { lessonViewSlice } from './lessonViewSlice';
import { reviewBoardSlice } from './reviewBoardSlice';

export const store = configureStore({
  // Root reducer — это главный app-level вход для однонаправленного потока:
  // view dispatch-ит action, store передаёт его в reducer tree, selectors отдают
  // next state обратно в компоненты.
  reducer: {
    lessonView: lessonViewSlice.reducer,
    reviewBoard: reviewBoardSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
