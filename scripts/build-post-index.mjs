// Generates src/generated/post-index.json — post metadata with no markdown bodies.
//
// Why this exists: services/blog.ts globs all 29 .md files with `eager: true`
// so the Worker can build RSS and the sitemap without async plumbing. That is
// correct for the server and ruinous for the browser — the raw markdown was
// being inlined into the entry chunk, which measured 247 KB and shipped every
// home-page visitor the full text of every post they were not going to read.
//
// The listing pages (HomePage -> RecentPosts, BlogPage) only need slug, date,
// title, description, tags and lang. That is ~9 KB for all 29 posts.
//
// The index is produced through Vite's SSR loader rather than a second copy of
// the frontmatter parser, so this cannot drift from posts.ts / frontmatter.ts:
// if the parsing contract changes, this build fails rather than emitting a
// stale index.
//
// ponytail: rebuilds on every `build`, not in watch mode. `dev` reads the
// committed file, so editing a post's frontmatter needs a `npm run build` to
// show up — add a watcher only if that becomes annoying.

import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const FIELDS = [
  'slug',
  'date',
  'title',
  'description',
  'tags',
  'lang',
  'image',
];

const root = fileURLToPath(new URL('..', import.meta.url));

// configFile: false — vite.config.ts pulls in @cloudflare/vite-plugin, whose
// miniflare/workerd refuses to start on macOS <13.5. This script only needs
// the module graph, so the app config is not just unnecessary, it is fatal.
const server = await createServer({
  root,
  configFile: false,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
  resolve: { alias: { '@': `${root}src` } },
});

try {
  const { getDistinctBlogPosts } = await server.ssrLoadModule(
    '/src/services/blog.ts'
  );
  const posts = getDistinctBlogPosts().map((post) =>
    Object.fromEntries(FIELDS.map((field) => [field, post[field] ?? null]))
  );

  const { writeFile, mkdir } = await import('node:fs/promises');
  const outDir = fileURLToPath(new URL('../src/generated/', import.meta.url));
  await mkdir(outDir, { recursive: true });
  await writeFile(
    `${outDir}post-index.json`,
    `${JSON.stringify(posts, null, 2)}\n`
  );

  console.log(
    `post index: ${posts.length} posts → src/generated/post-index.json`
  );
} finally {
  await server.close();
}
