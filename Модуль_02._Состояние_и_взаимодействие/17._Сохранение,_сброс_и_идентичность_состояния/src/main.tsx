import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Не найден DOM-контейнер #root для монтирования React Root.');
}

// Главный root остаётся простым,
// а все сценарии про preserving/resetting state, key и tree identity
// разбираются уже внутри дерева текущего урока.
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
