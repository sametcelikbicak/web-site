import { parseFrontmatter } from '@/services/frontmatter';

const wrap = (yaml: string, body = 'Body text.') =>
  `---\n${yaml}\n---\n\n${body}\n`;

describe('parseFrontmatter', () => {
  it('reads scalar keys', () => {
    const { data, content } = parseFrontmatter(
      wrap('title: "Modern TypeScript Tips"\ndate: "2026-06-05"')
    );

    expect(data.title).toBe('Modern TypeScript Tips');
    expect(data.date).toBe('2026-06-05');
    expect(content).toBe('Body text.');
  });

  it('reads an inline array and strips the quotes', () => {
    const { data } = parseFrontmatter(
      wrap('tags: ["TypeScript", "React", "Angular"]')
    );

    expect(data.tags).toEqual(['TypeScript', 'React', 'Angular']);
  });

  it('strips surrounding single quotes', () => {
    const { data } = parseFrontmatter(wrap("title: 'Plain'"));
    expect(data.title).toBe('Plain');
  });

  it('does not unescape a doubled quote inside a value', () => {
    // YAML would read 'It''s fine' as "It's fine". This parser strips the outer
    // quotes and stops there — pinning the limitation rather than implying the
    // value round-trips. No post uses a quoted apostrophe today.
    const { data } = parseFrontmatter(wrap("title: 'It''s fine'"));
    expect(data.title).toBe("It''s fine");
  });

  it('tolerates CRLF line endings', () => {
    const { data } = parseFrontmatter(
      '---\r\ntitle: A\r\ndate: 2024-01-01\r\n---\r\nX'
    );
    expect(data.title).toBe('A');
    expect(data.date).toBe('2024-01-01');
  });

  it('returns the whole file as content when there is no frontmatter', () => {
    const source = '# Just markdown\n\nNo frontmatter here.';
    expect(parseFrontmatter(source)).toEqual({ data: {}, content: source });
  });

  it('does not treat a horizontal rule mid-document as frontmatter', () => {
    const source = 'Intro\n\n---\n\nMore text';
    const { data, content } = parseFrontmatter(source);
    expect(data).toEqual({});
    expect(content).toBe(source);
  });

  it('keeps --- that appear inside the body', () => {
    const { content } = parseFrontmatter(
      wrap('title: A', 'before\n\n---\n\nafter')
    );
    expect(content).toContain('before');
    expect(content).toContain('after');
  });

  it('ignores lines without a colon', () => {
    const { data } = parseFrontmatter(wrap('title: A\njust some text\n'));
    expect(data).toEqual({ title: 'A' });
  });

  it('does not crash on an empty frontmatter block', () => {
    expect(parseFrontmatter('---\n\n---\nX').data).toEqual({});
  });

  it('reads an empty inline array as an empty array, not a string', () => {
    expect(parseFrontmatter(wrap('tags: []')).data.tags).toEqual([]);
  });
});
