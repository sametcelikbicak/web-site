# Personal Portfolio Website

Personal portfolio and public discovery site for Samet CELIKBICAK, built with React, TypeScript, Vite, Tailwind CSS, and Cloudflare Workers.

The user-facing site is a routed single-page application: a home page plus seven content pages (`/about`, `/experience`, `/education`, `/skills`, `/projects`, `/blog`, `/blog/:slug`) and a 404 catch-all. It is server-rendered at the edge and also publishes machine-readable resources for search engines, AI assistants, and agent discovery.

## Features

- React 19, TypeScript, and Vite application setup
- Tailwind CSS v4 styling with CSS-variable based light/dark themes
- Turkish and English translations with i18next and react-i18next
- Responsive header with desktop navigation and mobile hamburger menu
- Routed navigation across eight routes with a mobile drawer menu
- Lazy-loaded route chunks, awaited during SSR so every route returns complete HTML
- A contact call to action and a real 404 status for unknown paths
- WebP images with PNG fallback handling
- SEO metadata, Open Graph tags, Twitter card metadata, JSON-LD person schema, and robots rules with Content Signals
- Edge-generated sitemap and RSS feed, both deduplicated by post slug across translations
- Cloudflare Worker support for static asset serving, markdown content negotiation, dynamic RSS and sitemap generation, content-type fixes, and discovery `Link` headers
- Public AI/agent discovery files including `llms.txt`, OpenAPI metadata, MCP metadata, and `.well-known` resources
- Jest and Testing Library tests for hooks and components
- Biome formatting and linting, with Husky and lint-staged pre-commit checks

## Implementation Model

This is a routed React application. `src/App.tsx` declares eight routes plus a catch-all:

```text
/                 home (hero, stats, expertise)
/about            biography
/experience       roles and timelines
/education        education history
/skills           skills grouped by category
/projects         project and open-source showcase
/blog             post index, with list and grid views
/blog/:slug       a single post, rendered from Markdown in src/content/blog
*                 404 page
```

### Rendering

The Cloudflare Worker renders the app at the edge. `src/entry-server.tsx` uses
`renderToReadableStream` and awaits `stream.allReady`, which matters: with
`renderToString`, `React.lazy` is never resolved, the response is the Suspense
fallback, and that empty HTML gets cached at the edge for a day.

The Worker returns **404** for any path outside the route table. Blog slugs are
checked against the real posts, because `/blog/<slug>` is a route that exists
even when the slug does not.

Posts are read synchronously from `import.meta.glob` in `src/services/blog.ts`,
so a post renders on the server rather than after hydration.

## Project Structure

```text
.
├── public/
│   ├── .well-known/             # API catalog, OAuth metadata, MCP server card, agent skills
│   ├── docs/                    # Public markdown documentation for APIs, OAuth, and agent discovery
│   ├── status/health.json       # Static discovery health endpoint
│   ├── index.md                 # Markdown representation of the homepage
│   ├── llms.txt                 # LLM-oriented site summary
│   ├── openapi.json             # Public discovery OpenAPI description
│   ├── robots.txt               # Crawler rules
│   ├── sc.png / sc.webp         # Logo/profile image assets
│   └── sc_caricature.*          # Profile caricature assets
├── scripts/
│   └── check-agent-discovery.mjs  # Build gate for the agent discovery contract
├── src/
│   ├── components/              # Shared UI: Header, Hero, Footer, icons, BackToTop
│   ├── content/blog/            # Markdown posts, one file per language
│   ├── hooks/                   # useTheme
│   ├── locales/                 # English and Turkish translation files
│   ├── pages/                   # Route components, one per route, plus NotFoundPage
│   ├── services/                # blog data access, RSS and sitemap builders, XML escaping
│   ├── types/                   # Shared TypeScript types
│   ├── App.tsx                  # Route table and page composition
│   ├── entry-client.tsx         # Browser entry: hydration, WebMCP registration
│   ├── entry-server.tsx         # Edge render: awaited streaming SSR
│   ├── i18n.tsx                 # i18next setup, language persistence, document lang sync
│   ├── index.css                # Tailwind import, theme tokens, reduced-motion rules
│   ├── theme.tsx                # Theme provider and persistence
│   ├── webmcp.ts                # Browser Model Context Protocol tool registration
│   └── worker.ts                # Cloudflare Worker entry point
├── index.html                   # HTML shell, SEO metadata, JSON-LD, discovery link tags
├── vite.config.ts               # Vite, React, Tailwind, Cloudflare plugin, path alias, CSS inlining
├── wrangler.jsonc               # Cloudflare deployment and asset binding config
├── jest.config.cjs              # Jest + ts-jest configuration
├── biome.json                   # Formatting and linting rules
└── tsconfig*.json               # TypeScript project configuration
```

## Main Components

- `Header`: sticky navigation, language toggle, theme toggle, desktop nav and mobile drawer. The drawer is a modal dialog: Escape closes it, focus is trapped inside, and focus returns to the button that opened it.
- `Hero`: headline, subheading, contact and projects calls to action, caricature
- `StatsSection`: headline metrics under the hero
- `ExpertiseCards`: capability cards
- `BackToTop`: scroll-to-top control, hidden from the tab order until visible
- `Footer`: social links and copyright

Page components live in `src/pages/`. UI copy comes from
`src/locales/en/translation.json` and `src/locales/tr/translation.json`; post
content comes from `src/content/blog/*.md`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check with `tsc -b`, build with Vite, then run the agent discovery gate |
| `npm run test` | Run Jest tests |
| `npm run preview` | Build and preview through `wrangler dev` |
| `npm run format` | Run Biome checks and apply safe formatting fixes |
| `npm run check:agents` | Verify the agent discovery contract against `dist/client` |
| `npm run deploy` | Build and deploy with Wrangler |
| `npm run prepare` | Install Husky hooks |

## Getting Started

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

To preview the Cloudflare Worker and built assets locally:

```bash
npm run preview
```

## Deployment

Deployment is configured for Cloudflare through Wrangler.

`wrangler.jsonc` uses `src/worker.ts` as the Worker entry point and binds built
static assets through the `ASSETS` binding. `@cloudflare/vite-plugin` rewrites
the config at build time so the served directory is `dist/client`, not `dist`.
The Worker runs before asset handling so it can:

- server-render every route, awaiting the lazy chunks
- return markdown for HTML routes when the request accepts `text/markdown`
- serve dynamically generated `/rss.xml` and `/sitemap.xml`
- return **404** for paths outside the route table
- attach discovery `Link` headers to HTML routes
- set correct content types for `.well-known`, OpenAPI, MCP, markdown, and health resources

Deploy with:

```bash
npm run deploy
```

Cloudflare's Git integration builds and deploys automatically when a pull
request merges to `main`.

### Agent discovery gate

`npm run build` ends by running `scripts/check-agent-discovery.mjs`, which
asserts that every discovery file ships, that `ai-catalog.json` is structurally
valid, that `robots.txt` declares its Content Signals, and that anything needing
a non-default content type declares one. A regression fails the build instead of
deploying.

## Theming

Theme state is provided by `ThemeProvider` in `src/theme.tsx` and consumed through `useTheme`. The active theme is applied with a `data-theme` attribute, while colors are defined as CSS variables in `src/index.css`.

## Internationalization

Translations are initialized in `src/i18n.tsx`. Turkish is the fallback language,
and the supported locales are:

- `src/locales/tr/translation.json`
- `src/locales/en/translation.json`

The header language button switches between Turkish and English. The choice
persists to `localStorage`, falls back to the browser language on a first visit,
and keeps `document.documentElement.lang` in step so screen readers announce the
correct language.

## Agent Discovery

The site includes public machine-readable resources for agents and crawlers:

- `/llms.txt`
- `/index.md`
- `/openapi.json`
- `/docs/api.md`
- `/docs/agent-discovery.md`
- `/status/health.json`
- `/.well-known/ai-catalog.json` — ARD capability manifest
- `/.well-known/api-catalog` — API linkset
- `/.well-known/agent-card.json` — A2A agent card
- `/.well-known/mcp/server-card.json` — MCP server card
- `/.well-known/agent-skills/index.json`
- `/.well-known/agent-skills/profile-summary/SKILL.md`
- `/.well-known/poppy.json` — Personal Agent Protocol discovery

`robots.txt` declares Content Signals (`ai-train=no, search=yes, ai-input=no`)
for the general agent block and each named AI crawler, and points at the ARD
manifest with an `Agentmap` directive.

`src/webmcp.ts` also registers browser-side Model Context Protocol style tools when `navigator.modelContext` is available.

## Code Quality

Biome is configured in `biome.json` for formatting, linting, and import organization. Jest is configured with `ts-jest`, `jsdom`, Testing Library, and the `@/` path alias.

`src/index-css.test.ts` additionally asserts that every `--color-*` token exists
in both themes, that no stylesheet references an undeclared custom property, and
that blog code tokens clear 4.5:1 against their block background.

Husky runs `npx lint-staged` before commits. `lint-staged` runs `npm run format` for staged JavaScript, TypeScript, CSS, Markdown, JSON, and HTML files.

There is no CI workflow. The build itself is the gate.

## Path Aliases

The `@/` alias points to `src/` and is configured in:

- `tsconfig.app.json`
- `vite.config.ts`
- `jest.config.cjs`

See `PATH_ALIASES_SETUP.md` for details.

## License

MIT
