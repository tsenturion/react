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
    {/* В этом уроке shell тоже часть темы:
        маршруты и sandboxes вместе показывают, как server/client boundaries,
        mixed composition и bundle trade-offs влияют на структуру проекта. */}
    <App />
  </StrictMode>,
);
