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
    {/* В этом уроке тема проходит через reducer-модели, generic primitives,
        polymorphic helpers и router shell, а не живёт отдельно от проекта. */}
    <App />
  </StrictMode>,
);
