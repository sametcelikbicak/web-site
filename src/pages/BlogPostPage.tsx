import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { type BlogPost, getBlogPostBySlug } from '@/services/blog';
import 'highlight.js/styles/github-dark.css';
import './BlogPostPage.css';
import { useTranslation } from 'react-i18next';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (slug) {
      const foundPost = getBlogPostBySlug(slug, i18n.language);
      if (foundPost) {
        setPost(foundPost);
      } else {
        navigate('/blog');
      }
    }
  }, [slug, navigate, i18n.language]);

  if (!post) {
    return (
      <div className="blog-post-page page-container section-gap">
        <p>{t('blog.noPosts', { defaultValue: 'Yazı bulunamadı.' })}</p>
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate('/blog')}
        >
          &larr; {t('blog.backToBlog', { defaultValue: "Blog'a Dön" })}
        </button>
      </div>
    );
  }

  return (
    <article className="blog-post-page page-container section-gap">
      <header className="post-header">
        <div className="post-meta">
          <time>{new Date(post.date).toLocaleDateString(i18n.language)}</time>
          {post.tags && (
            <div className="post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <h1 className="post-title">{post.title}</h1>
      </header>

      <div className="post-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            a: ({ href, children }) => {
              if (
                href?.includes('youtube.com/watch') ||
                href?.includes('youtu.be/')
              ) {
                const videoId = href.includes('youtube.com/watch')
                  ? new URL(href).searchParams.get('v')
                  : href.split('youtu.be/')[1]?.split('?')[0];
                if (videoId) {
                  return (
                    <div className="youtube-embed">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  );
                }
              }
              return <a href={href}>{children}</a>;
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <footer className="post-footer">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate('/blog')}
        >
          &larr; {t('blog.backToBlog', { defaultValue: "Blog'a Dön" })}
        </button>
      </footer>
    </article>
  );
};

export default BlogPostPage;
