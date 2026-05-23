import { render } from './entry-server';

type Env = {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
};

const MARKDOWN_HOMEPAGE = `---
title: Samet CELIKBICAK | Principal Software Specialist
description: Principal Software Specialist from Izmir, Turkey with experience in Angular, TypeScript, JavaScript, HTML, CSS, React, fullstack development, and software leadership.
canonical: https://sametcelikbicak.com/
language: en
---

# Samet CELIKBICAK

Team Lead | Principal Software Specialist

Samet CELIKBICAK is a software developer based in Izmir, Turkey. He has worked in the software industry since 2007 in roles including Software Developer, Senior Software Developer, Team Lead, Fullstack Developer, and Principal Software Specialist.

## About

Samet has extensive experience in software development, including web frontend, web backend, and Android applications with Xamarin. His work includes object-oriented programming, software design patterns, engineering principles, development methodologies, and modern web tooling.

Until 2024, Samet worked as a Fullstack Developer. Since 2024, he has continued his career as a Principal Software Specialist with a focus on frontend development.

## Core Skills

- Angular
- TypeScript
- JavaScript
- HTML
- CSS
- React
- Frontend development
- Fullstack development
- Open source software
- Software architecture and design patterns

## Projects

- Enum2Array: https://www.npmjs.com/package/enum2array
- TSCI CLI: https://www.npmjs.com/package/tsci
- Storage Function: https://www.npmjs.com/package/storage-function
- Pomodoro: https://sametcelikbicak.github.io/pomodoro/

## Agent Resources

- llms.txt: https://sametcelikbicak.com/llms.txt
- API catalog: https://sametcelikbicak.com/.well-known/api-catalog
- OpenAPI: https://sametcelikbicak.com/openapi.json
- Sitemap: https://sametcelikbicak.com/sitemap.xml
- Robots: https://sametcelikbicak.com/robots.txt
`;

const LINK_HEADER =
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json", </openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json", </docs/api.md>; rel="service-doc"; type="text/markdown", </status/health.json>; rel="status"; type="application/json", </llms.txt>; rel="describedby"; type="text/plain", </index.md>; rel="alternate"; type="text/markdown"';

const CONTENT_TYPES = new Map<string, string>([
  ['/.well-known/api-catalog', 'application/linkset+json; charset=utf-8'],
  ['/.well-known/openid-configuration', 'application/json; charset=utf-8'],
  [
    '/.well-known/oauth-authorization-server',
    'application/json; charset=utf-8',
  ],
  ['/.well-known/oauth-protected-resource', 'application/json; charset=utf-8'],
  ['/.well-known/jwks.json', 'application/json; charset=utf-8'],
  ['/.well-known/mcp/server-card.json', 'application/json; charset=utf-8'],
  ['/.well-known/agent-skills/index.json', 'application/json; charset=utf-8'],
  [
    '/.well-known/agent-skills/profile-summary/SKILL.md',
    'text/markdown; charset=utf-8',
  ],
  ['/index.md', 'text/markdown; charset=utf-8'],
  ['/openapi.json', 'application/vnd.oai.openapi+json; charset=utf-8'],
  ['/status/health.json', 'application/json; charset=utf-8'],
  ['/mcp', 'application/json; charset=utf-8'],
]);

const markdownTokenCount = (markdown: string) =>
  Math.ceil(markdown.trim().split(/\s+/).length * 1.3);

const acceptsMarkdown = (request: Request) => {
  const accept = request.headers.get('Accept') || '';
  return accept
    .split(',')
    .map((value) => value.split(';')[0].trim().toLowerCase())
    .includes('text/markdown');
};

const isHtmlRoute = (pathname: string) =>
  pathname === '/' || pathname === '/index.html' || !pathname.includes('.');

export default {
  async fetch(request: Request, env: Env) {
    const { pathname } = new URL(request.url);

    if (acceptsMarkdown(request) && isHtmlRoute(pathname)) {
      return new Response(MARKDOWN_HOMEPAGE, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Location': '/index.md',
          Link: LINK_HEADER,
          Vary: 'Accept',
          'x-markdown-tokens': String(markdownTokenCount(MARKDOWN_HOMEPAGE)),
        },
      });
    }

    // SSR for HTML routes (non-markdown)
    if (isHtmlRoute(pathname)) {
      const templateReq = new Request('https://placeholder/index.html');
      const templateRes = await env.ASSETS.fetch(templateReq);

      if (templateRes.ok) {
        const template = await templateRes.text();
        const appHtml = render(request.url);
        const html = template.replace('<!--ssr-outlet-->', appHtml);

        const headers = new Headers({
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=0, s-maxage=86400',
          Link: LINK_HEADER,
          Vary: 'Accept',
        });

        return new Response(html, { headers });
      }
    }

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    const contentType = CONTENT_TYPES.get(pathname);

    if (contentType) headers.set('Content-Type', contentType);

    if (isHtmlRoute(pathname)) {
      headers.set('Link', LINK_HEADER);
      headers.append('Vary', 'Accept');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
