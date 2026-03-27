import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Не найден DOM-контейнер #root для монтирования React Root.');
}

// Эта точка входа специально остаётся максимально прозрачной:
// JSX внутри App сначала создаёт React elements, а уже потом reconciler
// решает, какие изменения действительно попадут в настоящий DOM.
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
