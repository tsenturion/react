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
    {/* Урок специально не разбрасывает useMemo/useCallback по shell-коду:
        проект сам живёт в compiler-friendly стиле и показывает, где это
        работает, а где нужна уже архитектурная, а не синтаксическая оптимизация. */}
    <App />
  </StrictMode>,
);
