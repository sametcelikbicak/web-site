import { StrictMode } from 'react';
import { renderToReadableStream } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';
import '@/i18n';

/**
 * renderToString cannot resolve React.lazy: it renders the Suspense fallback and
 * returns immediately, which is why the response varied between the skeleton and
 * real markup and was then pinned in the edge cache for a day.
 *
 * renderToReadableStream streams Suspense boundaries properly. allReady waits for
 * every lazy chunk to resolve, so the HTML we hand back is always complete.
 */
export async function render(url: string): Promise<string> {
  const { pathname } = new URL(url);
  const stream = await renderToReadableStream(
    <StrictMode>
      <MemoryRouter initialEntries={[pathname]}>
        <App />
      </MemoryRouter>
    </StrictMode>
  );
  await stream.allReady;
  return new Response(stream).text();
}
