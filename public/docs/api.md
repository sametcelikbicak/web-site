# Public Discovery API

This site exposes read-only discovery resources for agents and crawlers.

## Endpoints

- `GET /index.md` returns a Markdown representation of the homepage.
- `GET /llms.txt` returns an LLM-oriented site summary.
- `GET /.well-known/api-catalog` returns the RFC 9727 API catalog.
- `GET /openapi.json` returns an OpenAPI description of public discovery resources.
- `GET /status/health.json` returns static discovery health.

No private user data or protected transactional API is exposed by this
portfolio site.
