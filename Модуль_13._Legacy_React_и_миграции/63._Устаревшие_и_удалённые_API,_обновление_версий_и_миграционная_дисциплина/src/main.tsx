import { createRoot } from 'react-dom/client';

import { App } from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found.');
}

createRoot(container).render(
  // Урок оставлен без StrictMode, чтобы migration laboratories показывали
  // прямой результат audit и rollout логики без dev-only повторных прогонов.
  <App />,
);
