import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import './index.css';

// Входной модуль остаётся явным и минимальным: тема 4 разбирает платформенную основу,
// поэтому оболочка приложения не должна скрывать, где React подключается к DOM.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
