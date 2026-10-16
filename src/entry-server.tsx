import { StrictMode } from 'react';
import { renderToReadableStream } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';
import i18n, { parseLanguageCookie } from '@/i18n';

/**
 * renderToString cannot resolve React.lazy: it renders the Suspense fallback and
 * returns immediately, which is why the response varied between the skeleton and
 * real markup and was then pinned in the edge cache for a day.
 *
 * renderToReadableStream streams Suspense boundaries properly. allReady waits for
 * every lazy chunk to resolve, so the HTML we hand back is always complete.
 */
export async function render(
  url: string,
  cookieHeader?: string | null
): Promise<string> {
  const { pathname } = new URL(url);

  // i18n.tsx falls back to Turkish on the server because it has no document to
  // read a cookie from. Tell it what the visitor actually chose, or the HTML we
  // send is Turkish while the client immediately re-renders in their language.
  i18n.changeLanguage(parseLanguageCookie(cookieHeader ?? null));
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
