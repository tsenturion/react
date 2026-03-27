import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Не найден DOM-контейнер #root для монтирования React Root.');
}

// Root остаётся простым, а архитектура shared state раскрывается уже внутри урока:
// parent-owned значения, callbacks вверх и props вниз живут в текущем дереве приложения.
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
