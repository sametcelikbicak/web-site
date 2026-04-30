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

## Experience

Samet has professional experience as a Software Developer, Senior Software Developer, Team Lead, Fullstack Developer, and Principal Software Specialist. He uses technical and analytical skills to solve problems independently and as part of engineering teams.

## Education

- Ahmet Yesevi University: Management Information System, Master degree
- Anadolu University: Business Management, Bachelor's degree
- Dokuz Eylul University: Computer Technologies and Programming, Associate degree

## Projects

### Enum2Array

A function to help convert enums to arrays.

URL: https://www.npmjs.com/package/enum2array

### TSCI CLI

TypeScript CLI for creating HTML, CSS, and TypeScript projects with different bundlers.

URL: https://www.npmjs.com/package/tsci

### Storage Function

A function to manipulate browser storage, including storing and reading key-value pairs in session storage or local storage.

URL: https://www.npmjs.com/package/storage-function

### Pomodoro

A Pomodoro timer application for managing time with the Pomodoro Technique.

URL: https://sametcelikbicak.github.io/pomodoro/

## Profiles

- GitHub: https://github.com/sametcelikbicak
- LinkedIn: https://www.linkedin.com/in/sametcelikbicak/
- Twitter: https://twitter.com/sametcelikbicak
- YouTube: https://www.youtube.com/@sametcelikbicak

## Agent Resources

- llms.txt: https://sametcelikbicak.com/llms.txt
- API catalog: https://sametcelikbicak.com/.well-known/api-catalog
- Agent discovery: https://sametcelikbicak.com/docs/agent-discovery.md
- Sitemap: https://sametcelikbicak.com/sitemap.xml
- Robots: https://sametcelikbicak.com/robots.txt
`;

const LINK_HEADER =
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json", </docs/agent-discovery.md>; rel="service-doc"; type="text/markdown", </llms.txt>; rel="describedby"; type="text/plain", </index.md>; rel="alternate"; type="text/markdown"';

const markdownTokenCount = (markdown) =>
  Math.ceil(markdown.trim().split(/\s+/).length * 1.3);

const acceptsMarkdown = (request) => {
  const accept = request.headers.get('Accept') || '';
  return accept
    .split(',')
    .map((value) => value.split(';')[0].trim().toLowerCase())
    .includes('text/markdown');
};

const isHtmlRoute = (request) => {
  const { pathname } = new URL(request.url);
  return (
    pathname === '/' || pathname === '/index.html' || !pathname.includes('.')
  );
};

export const onRequest = async ({ env, request }) => {
  if (acceptsMarkdown(request) && isHtmlRoute(request)) {
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

  return env.ASSETS.fetch(request);
};
