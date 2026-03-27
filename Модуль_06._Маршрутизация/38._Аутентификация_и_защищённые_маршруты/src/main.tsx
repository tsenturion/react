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
    {/* Здесь RouterProvider управляет не только route tree, но и auth guards,
        protected loaders, role gates и login redirect flow. */}
    <App />
  </StrictMode>,
);
