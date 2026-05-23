import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';
import '@/i18n';

export function render(url: string): string {
  const { pathname } = new URL(url);
  return renderToString(
    <StrictMode>
      <MemoryRouter initialEntries={[pathname]}>
        <App />
      </MemoryRouter>
    </StrictMode>
  );
}
