import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
}

const posts = import.meta.glob('../blog/*.md', { eager: true, as: 'raw' });

function parseFrontmatter(md: string) {
  const match = /^---([\s\S]*?)---/.exec(md);
  if (!match) return { title: '', date: '' };
  const frontmatter = match[1];
  const title = /title:\s*"([^"]+)"/.exec(frontmatter)?.[1] || '';
  const date = /date:\s*"([^"]+)"/.exec(frontmatter)?.[1] || '';
  return { title, date };
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPostMeta[]>([]);

  useEffect(() => {
    const list = Object.entries(posts).map(([path, content]) => {
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      const { title, date } = parseFrontmatter(content as string);
      return { slug, title, date };
    });
    setBlogPosts(list.sort((a, b) => b.date.localeCompare(a.date)));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <ul className="space-y-4">
        {blogPosts.map((post) => (
          <li key={post.slug}>
            <Link
              to={`/blog/${post.slug}`}
              className="text-xl text-blue-600 hover:underline"
            >
              {post.title || post.slug}
            </Link>
            <div className="text-gray-500 text-sm">{post.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
