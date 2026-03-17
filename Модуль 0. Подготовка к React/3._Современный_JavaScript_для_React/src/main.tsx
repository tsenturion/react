import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import './index.css';

// Отдельная точка входа остаётся явной: тема 3 разбирает import/export и модульность,
// поэтому входной модуль проекта должен быть читаемым и легко прослеживаемым.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
