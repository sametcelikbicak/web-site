# Agent Discovery

This site publishes machine-readable discovery resources for AI agents,
crawlers, and search systems.

- `/.well-known/agent-card.json` provides the DNS-AID agent card for AI agent discovery.
- `/.well-known/api-catalog` provides a Linkset catalog for discovery.
- `/.well-known/mcp/server-card.json` provides the MCP server capabilities.
- `/.well-known/agent-skills/index.json` provides discoverable agent skills.
- `/llms.txt` summarizes the site, audience, topics, and trusted facts.
- `/sitemap.xml` lists canonical crawl targets.
- `/robots.txt` declares crawler access rules, including AI crawler access.

- `/auth.md` provides agent registration instructions (auth.md standard).

## DNS for AI Discovery (DNS-AID)

This domain publishes DNS-AID records for agent discovery:

- `_a2a._agents.sametcelikbicak.com` — Agent-to-Agent protocol SVCB record
- `_index._agents.sametcelikbicak.com` — Organization agent index SVCB record

The primary site authority is `https://sametcelikbicak.com/`.
