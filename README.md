# Personal Portfolio Website

Personal portfolio and public discovery site for Samet CELIKBICAK, built with React, TypeScript, Vite, Tailwind CSS, and Cloudflare Workers.

The user-facing site is a single-page portfolio with anchored sections for profile, about, experience, education, skills, projects, and footer content. It also publishes machine-readable resources for search engines, AI assistants, and agent discovery.

## Features

- React 19, TypeScript, and Vite application setup
- Tailwind CSS v4 styling with CSS-variable based light/dark themes
- Turkish and English translations with i18next and react-i18next
- Responsive header with desktop navigation and mobile hamburger menu
- Section anchor navigation for `about`, `experience`, `education`, `skills`, and `projects`
- Lazy-loaded portfolio sections for improved initial loading
- WebP images with PNG fallback handling
- SEO metadata, Open Graph tags, Twitter card metadata, JSON-LD person schema, sitemap, and robots rules
- Cloudflare Worker support for static asset serving, markdown content negotiation, content-type fixes, and discovery `Link` headers
- Public AI/agent discovery files including `llms.txt`, OpenAPI metadata, MCP metadata, and `.well-known` resources
- Jest and Testing Library tests for hooks and components
- Biome formatting and linting, with Husky and lint-staged pre-commit checks

## Implementation Model

This project is currently implemented as a section-based single-page application.

`src/App.tsx` defines one route, `/`, and renders all portfolio content on that page. Header links point to hash anchors such as `/#about`, `/#experience`, and `/#projects`; the app listens to location changes and scrolls to the matching section id.

This fits the current portfolio well because the main content is compact, sequential, and resume-like. A page-wise implementation would make more sense if sections grow into independent experiences, for example:

- `/experience` with detailed company timelines and case studies
- `/projects` with individual project detail pages
- `/blog` hosted inside this app instead of linking to Hashnode
- `/contact` with a dedicated form or booking flow

For the current structure, keeping it section-based is the cleaner choice. The app already uses React Router, so moving to page-wise routes later would be straightforward if the content depth justifies it.

## Project Structure

```text
.
├── functions/
│   └── [[path]].js              # Cloudflare Pages function variant for discovery headers/content negotiation
├── public/
│   ├── .well-known/             # API catalog, OAuth metadata, MCP server card, agent skills
│   ├── docs/                    # Public markdown documentation for APIs, OAuth, and agent discovery
│   ├── status/health.json       # Static discovery health endpoint
│   ├── index.md                 # Markdown representation of the homepage
│   ├── llms.txt                 # LLM-oriented site summary
│   ├── openapi.json             # Public discovery OpenAPI description
│   ├── robots.txt               # Crawler rules
│   ├── sitemap.xml              # Search sitemap
│   ├── sc.png / sc.webp         # Logo/profile image assets
│   └── sc_caricature.*          # Profile caricature assets
├── src/
│   ├── components/              # Portfolio UI sections and shared UI components
│   ├── hooks/                   # Theme, mobile detection, and analytics hooks
│   ├── locales/                 # English and Turkish translation files
│   ├── types/                   # Shared TypeScript types
│   ├── App.tsx                  # Main route and section composition
│   ├── i18n.tsx                 # i18next setup
│   ├── index.css                # Tailwind import and theme variables
│   ├── main.tsx                 # React entry point and router setup
│   ├── theme.tsx                # Theme provider and persistence
│   ├── webmcp.ts                # Browser Model Context Protocol tool registration
│   └── worker.ts                # Cloudflare Worker entry point
├── index.html                   # HTML shell, SEO metadata, JSON-LD, analytics script
├── vite.config.ts               # Vite, React, Tailwind, Cloudflare plugin, and path alias config
├── wrangler.jsonc               # Cloudflare deployment and asset binding config
├── jest.config.cjs              # Jest + ts-jest configuration
├── biome.json                   # Formatting and linting rules
└── tsconfig*.json               # TypeScript project configuration
```

## Main Components

- `Header`: sticky navigation, language toggle, theme toggle, desktop/mobile navigation
- `Profile`: name, title, and profile image with WebP-to-PNG fallback
- `About`: translated biography section with section-view analytics
- `Experience`: professional experience section
- `Education`: education section
- `Skills`: technical skills section
- `Projects`: portfolio and open-source project showcase
- `Footer`: social/profile links and closing site content

Most section content comes from `src/locales/en/translation.json` and `src/locales/tr/translation.json`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check with `tsc -b` and build with Vite |
| `npm run test` | Run Jest tests |
| `npm run preview` | Build and preview through `wrangler dev` |
| `npm run format` | Run Biome checks and apply safe formatting fixes |
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

`wrangler.jsonc` uses `src/worker.ts` as the Worker entry point and binds built static assets from `./dist` through the `ASSETS` binding. The Worker runs before asset handling so it can:

- return markdown for HTML routes when the request accepts `text/markdown`
- attach discovery `Link` headers to HTML routes
- set correct content types for `.well-known`, OpenAPI, MCP, markdown, and health resources
- preserve single-page application fallback behavior

Deploy with:

```bash
npm run deploy
```

## Theming

Theme state is provided by `ThemeProvider` in `src/theme.tsx` and consumed through `useTheme`. The active theme is applied with a `data-theme` attribute, while colors are defined as CSS variables in `src/index.css`.

## Internationalization

Translations are initialized in `src/i18n.tsx`. Turkish is the fallback language, and the supported locales are:

- `src/locales/tr/translation.json`
- `src/locales/en/translation.json`

The header language button switches between Turkish and English.

## Agent Discovery

The site includes public machine-readable resources for agents and crawlers:

- `/llms.txt`
- `/index.md`
- `/openapi.json`
- `/docs/api.md`
- `/docs/agent-discovery.md`
- `/status/health.json`
- `/.well-known/api-catalog`
- `/.well-known/mcp/server-card.json`
- `/.well-known/agent-skills/index.json`
- `/.well-known/agent-skills/profile-summary/SKILL.md`

`src/webmcp.ts` also registers browser-side Model Context Protocol style tools when `navigator.modelContext` is available.

## Code Quality

Biome is configured in `biome.json` for formatting, linting, and import organization. Jest is configured with `ts-jest`, `jsdom`, Testing Library, and the `@/` path alias.

Husky runs `npx lint-staged` before commits. `lint-staged` runs `npm run format` for staged JavaScript, TypeScript, CSS, Markdown, JSON, and HTML files.

## Path Aliases

The `@/` alias points to `src/` and is configured in:

- `tsconfig.app.json`
- `vite.config.ts`
- `jest.config.cjs`

See `PATH_ALIASES_SETUP.md` for details.

## License

MIT
