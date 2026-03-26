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
        маршруты, формы и server-function sandboxes вместе показывают,
        как server boundaries меняют устройство full-stack React проекта. */}
    <App />
  </StrictMode>,
);
