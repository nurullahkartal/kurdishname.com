import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Auto-register service worker for PWA support
// Wrapped in try/catch so a failed SW registration never blocks the React app.
try {
  registerSW({ immediate: true });
} catch (err) {
  console.warn('[SW] Service worker registration skipped:', err);
}

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

