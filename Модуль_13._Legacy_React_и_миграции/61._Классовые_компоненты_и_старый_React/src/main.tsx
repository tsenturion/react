import { createRoot } from 'react-dom/client';

import { App } from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found.');
}

createRoot(container).render(
  // Урок намеренно рендерится без StrictMode: для class lifecycle важно показать
  // старую последовательность mount/update/unmount без dev-only двойных probes.
  <App />,
);
