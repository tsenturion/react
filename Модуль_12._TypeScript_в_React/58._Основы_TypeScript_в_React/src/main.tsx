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
    {/* Shell урока тоже часть темы: TypeScript присутствует не только в
        "демо-блоках", а в router, моделях и текущих React-компонентах проекта. */}
    <App />
  </StrictMode>,
);
