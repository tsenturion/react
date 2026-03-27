import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Не найден DOM-контейнер #root для монтирования React Root.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
