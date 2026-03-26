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
        route-first страницы и framework labs вместе показывают,
        как full-stack React меняется при framework-based подходе. */}
    <App />
  </StrictMode>,
);
