import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Auto-register service worker for PWA support
registerSW({ immediate: true });



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
