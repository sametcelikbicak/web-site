import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@/index.css';
import App from '@/App.tsx';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

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

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
