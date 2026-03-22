import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './index.css';
import { ArchitecturePreferencesProvider } from './state/ArchitecturePreferencesContext';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found.');
}

createRoot(container).render(
  <StrictMode>
    <ArchitecturePreferencesProvider>
      <App />
    </ArchitecturePreferencesProvider>
  </StrictMode>,
);
