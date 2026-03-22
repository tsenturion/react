import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { App } from './App';
import './index.css';
import { store } from './store/store';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found.');
}

createRoot(container).render(
  <StrictMode>
    {/* Provider оборачивает весь урок, чтобы Redux был не только темой одной
        лаборатории, но и реальной архитектурой shell-приложения. */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
