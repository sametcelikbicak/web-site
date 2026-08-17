# Public Discovery API

This site exposes read-only discovery resources for agents and crawlers.

## Endpoints

- `GET /index.md` returns a Markdown representation of the homepage.
- `GET /llms.txt` returns an LLM-oriented site summary.
- `GET /rss.xml` returns the RSS feed generated from blog posts.
- `GET /sitemap.xml` returns the sitemap of canonical crawl targets.
- `GET /.well-known/api-catalog` returns the RFC 9727 API catalog.
- `GET /openapi.json` returns an OpenAPI description of public discovery resources.
- `GET /status/health.json` returns static discovery health.

No private user data or protected transactional API is exposed by this
portfolio site.
