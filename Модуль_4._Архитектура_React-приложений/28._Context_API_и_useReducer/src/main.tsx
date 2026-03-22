import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './index.css';
import { LessonViewProvider } from './state/LessonViewProvider';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found.');
}

createRoot(container).render(
  <StrictMode>
    <LessonViewProvider>
      <App />
    </LessonViewProvider>
  </StrictMode>,
);
