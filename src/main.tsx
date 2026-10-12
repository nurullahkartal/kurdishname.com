import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './i18n';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Auto-register service worker for PWA support
registerSW({ immediate: true });

const rootElement = document.getElementById('root')!;
if (rootElement && rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

