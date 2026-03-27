import { createRoot } from 'react-dom/client';

import { App } from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found.');
}

createRoot(container).render(
  // Урок оставлен без StrictMode, чтобы интерактивные legacy API laboratories
  // показывали прямой результат Children/cloneElement/ref flows без dev-only дублей.
  <App />,
);
