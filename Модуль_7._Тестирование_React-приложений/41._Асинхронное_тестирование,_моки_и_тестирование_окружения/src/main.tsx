import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found.');
}

createRoot(container).render(
  <StrictMode>
    {/* Lesson shell здесь важен не меньше самих тестов:
        в уроке 41 он связывает async UI, mocks и test environment в одну картину. */}
    <App />
  </StrictMode>,
);
