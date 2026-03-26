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
    {/* Для этой темы важно, что runtime boundary выражен не только в sandboxes,
        но и в router, моделях запросов, мутаций и route contracts проекта. */}
    <App />
  </StrictMode>,
);
