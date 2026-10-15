import { buildRssXml } from './rss';
import { buildSitemapXml, toSitemapEntries } from './sitemap';
import { escapeXml } from './xml';

describe('escapeXml', () => {
  it('escapes the five XML entities', () => {
    expect(escapeXml(`Tom & Jerry's <b>"x"</b>`)).toBe(
      'Tom &amp; Jerry&apos;s &lt;b&gt;&quot;x&quot;&lt;/b&gt;'
    );
  });
});

describe('buildRssXml', () => {
  const post = {
    title: 'A & B',
    date: '2024-01-02',
    description: '<hi>',
    link: '/blog/a',
  };
  const xml = buildRssXml([post]);

  it('emits a valid RSS envelope', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml.trimEnd().endsWith('</rss>')).toBe(true);
  });

  it('escapes title and description', () => {
    expect(xml).toContain('<title>A &amp; B</title>');
    expect(xml).toContain('<description>&lt;hi&gt;</description>');
  });

  it('emits exactly one item per post', () => {
    expect(
      buildRssXml([post, { ...post, link: '/blog/b' }]).match(/<item>/g)
    ).toHaveLength(2);
    expect(xml.match(/<item>/g)).toHaveLength(1);
  });

  it('links each item with a permalink guid', () => {
    expect(xml).toContain(
      '<guid isPermaLink="true">https://sametcelikbicak.com/blog/a</guid>'
    );
  });
});

describe('buildSitemapXml', () => {
  const xml = buildSitemapXml([
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    {
      loc: '/blog/x',
      lastmod: '2024-01-02',
      changefreq: 'monthly',
      priority: '0.6',
    },
  ]);

  it('emits one url element per entry', () => {
    expect(xml.match(/<url>/g)).toHaveLength(2);
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);
  });

  it('includes lastmod only when the entry has one', () => {
    expect(xml).toContain('<lastmod>2024-01-02</lastmod>');
    expect(xml.match(/<lastmod>/g)).toHaveLength(1);
  });
});

// getSitemapXml and getRssXml reach import.meta.glob through blog.ts, which Jest
// cannot transform. The worker wires those up; this covers the builders.
describe('toSitemapEntries', () => {
  it('maps one entry per post and carries the date as lastmod', () => {
    const entries = toSitemapEntries([
      { slug: 'a', date: '2024-01-02' },
      { slug: 'b', date: '2024-03-04' },
    ]);
    expect(entries).toEqual([
      {
        loc: '/blog/a',
        lastmod: '2024-01-02',
        changefreq: 'monthly',
        priority: '0.6',
      },
      {
        loc: '/blog/b',
        lastmod: '2024-03-04',
        changefreq: 'monthly',
        priority: '0.6',
      },
    ]);
  });
});
