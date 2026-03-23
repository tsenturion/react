import { BrowserRouter } from 'react-router-dom';
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
    {/* Router context делает адресную строку частью архитектуры экрана, а не просто оболочкой вокруг JSX. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
