import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Не найден DOM-контейнер #root для монтирования React Root.');
}

// Главный root остаётся обычным,
// а escape hatch сценарии используют второй DOM-host из index.html
// только точечно: для portals и overlay-слоя.
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
