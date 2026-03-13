import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { LRUDProvider } from './shared/providers/LRUDProvider';
import './styles/tailwind.css';

// Register service worker for PWA install (Samsung TV, Fire Stick, mobile, etc.)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed — app still works without it
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LRUDProvider>
      <App />
    </LRUDProvider>
  </StrictMode>,
);
