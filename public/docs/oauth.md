# OAuth Discovery

This portfolio site currently exposes public, read-only discovery resources.
There are no protected user-data APIs and no interactive sign-in flow for
third-party agents.

The OAuth and protected-resource discovery documents are published so agents
can determine that only public metadata access is available.

## Authorization

No authorization endpoint is currently active for third-party clients.

## Token

No token endpoint is currently active for third-party clients.

## Agent Registration

Agents can discover registration instructions at `/auth.md`.
See [auth.md](/auth.md) for the agentic registration flow.

Anonymous registration is supported for public read-only access.
