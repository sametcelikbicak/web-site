import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const posts = import.meta.glob('../blog/*.md', { eager: true, as: 'raw' });

function parseFrontmatter(md: string) {
  const match = /^---([\s\S]*?)---/.exec(md);
  let content = md;
  let title = '';
  let date = '';
  if (match) {
    const frontmatter = match[1];
    title = /title:\s*"([^"]+)"/.exec(frontmatter)?.[1] || '';
    date = /date:\s*"([^"]+)"/.exec(frontmatter)?.[1] || '';
    content = md.slice(match[0].length).trim();
  }
  return { title, date, content };
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (!slug) return;
    const md = posts[`../blog/${slug}.md`];
    if (md) {
      const { title, date, content } = parseFrontmatter(md as string);
      setContent(content);
      setTitle(title || slug);
      setDate(date || '');
    }
  }, [slug]);

  if (!content) return <div>Post not found.</div>;

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Link to="/blog" className="text-blue-600 hover:underline">
        ← Back to Blog
      </Link>
      <h1>{title}</h1>
      <div className="text-gray-500 text-sm mb-4">{date}</div>
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
};

export default BlogPost;
