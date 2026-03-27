import { createRoot } from 'react-dom/client';

import { App } from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found.');
}

createRoot(container).render(
  // Здесь intentionally нет StrictMode: route-log и диагностические sandboxes
  // должны показывать одно действие -> один наблюдаемый сигнал, без dev-only дублей.
  <App />,
);
