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
    {/* Здесь RouterProvider управляет учебной картой тестовых слоёв:
        URL, loaders и экраны сами становятся частью тестируемого поведения. */}
    <App />
  </StrictMode>,
);
