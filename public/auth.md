# auth.md

You are an agent. This site is a personal portfolio and blog hosted at `https://sametcelikbicak.com`. It exposes public read-only resources: profile information, blog posts, project listings, and an API catalog. There are no protected user-data APIs.

## Step 1 — Discover

Fetch the Protected Resource Metadata:

```http
GET /.well-known/oauth-protected-resource
```

Response:

```json
{
  "resource": "https://sametcelikbicak.com/",
  "resource_name": "Samet CELIKBICAK Portfolio",
  "authorization_servers": ["https://sametcelikbicak.com"],
  "scopes_supported": ["public.read"],
  "bearer_methods_supported": ["header"]
}
```

Then fetch the Authorization Server metadata:

```http
GET /.well-known/oauth-authorization-server
```

Response includes an `agent_auth` block with registration details.

## Step 2 — Pick a method

This site accepts:

- **anonymous** — no user identity required. Public resources only.

`identity_assertion` methods (ID-JAG, verified email) are not currently supported because no user-specific data or write operations are exposed.

## Step 3 — Register

Since the site only serves public data, agents can operate without registration. Public resources are available at:

- `https://sametcelikbicak.com/index.md` — full site markdown summary
- `https://sametcelikbicak.com/llms.txt` — LLM site summary
- `https://sametcelikbicak.com/openapi.json` — OpenAPI description
- `https://sametcelikbicak.com/.well-known/api-catalog` — API catalog
- `https://sametcelikbicak.com/sitemap.xml` — sitemap

No access token is required to access these resources.

## Errors

| Code | Where | What to do |
|------|-------|------------|
| `invalid_request` | any | The request format is incorrect. Check the documentation. |

## Revocation

No credential revocation is needed because no access tokens are issued for public data.
