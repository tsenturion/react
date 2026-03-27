import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Не найден DOM-контейнер #root для монтирования React Root.');
}

// Главный root монтирует App один раз,
// а дальше уже само дерево компонентов строится через props и композицию.
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
