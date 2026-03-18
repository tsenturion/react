import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import './index.css';

// Вход оставлен минимальным и явным: тема урока посвящена самому React,
// поэтому здесь важно прямо видеть точку входа `createRoot(...).render(...)`.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
