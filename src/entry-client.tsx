import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@/index.css';
import App from '@/App';

if ('requestIdleCallback' in window) {
  requestIdleCallback(
    () => import('@/webmcp').then((m) => m.registerWebMcpTools()),
    { timeout: 3000 }
  );
} else {
  setTimeout(
    () => import('@/webmcp').then((m) => m.registerWebMcpTools()),
    2000
  );
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

if (rootEl.hasChildNodes()) {
  hydrateRoot(
    rootEl,
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}
