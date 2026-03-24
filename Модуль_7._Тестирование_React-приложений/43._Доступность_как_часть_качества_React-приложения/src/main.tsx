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
    {/* Для урока 43 shell сам является частью темы:
        skip link, landmarks и route announcement встроены прямо в приложение. */}
    <App />
  </StrictMode>,
);
