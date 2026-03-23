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
    {/* RouterProvider даёт общий shell урока, а сами лаборатории ниже
        показывают, как Testing Library работает с поведением пользователя. */}
    <App />
  </StrictMode>,
);
