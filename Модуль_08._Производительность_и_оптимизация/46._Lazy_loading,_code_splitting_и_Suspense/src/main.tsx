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
    {/* В этом уроке dev-shell тоже важен:
        lazy pages и Suspense boundaries должны быть наблюдаемы в живом интерфейсе. */}
    <App />
  </StrictMode>,
);
