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
    {/* Для темы производительности dev-shell тоже важен:
        StrictMode даёт честный повод обсуждать разницу между dev и production signals. */}
    <App />
  </StrictMode>,
);
