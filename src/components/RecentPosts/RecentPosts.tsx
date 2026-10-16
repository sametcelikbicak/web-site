import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '@/services/blog';
import './RecentPosts.css';

const MAX_POSTS = 4;

const RecentPosts = () => {
  const { t, i18n } = useTranslation();

  // Language-scoped on purpose. Linking an English visitor to a Turkish-only
  // slug gets them bounced: BlogPostPage resolves with the current language and
  // redirects to /blog when it misses.
  const posts = getBlogPosts(i18n.language).slice(0, MAX_POSTS);

  return (
    <section className="recent-posts-section section-gap">
      <div className="page-container">
        <div className="recent-posts-header">
          <h2 className="section-label">{t('home.recentPosts.title')}</h2>
          <Link to="/blog" className="recent-posts-all">
            {t('home.recentPosts.viewAll')}
          </Link>
        </div>

        {posts.length > 0 && (
          <ul className="recent-posts-grid">
            {posts.map((post) => (
              <li key={post.slug} className="recent-post card">
                <Link
                  to={`/blog/${post.slug}`}
                  className="recent-post-link"
                  aria-label={post.title}
                >
                  <time className="post-meta" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString(i18n.language)}
                  </time>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-description">{post.description}</p>
                  {post.tags && (
                    <ul className="post-tags">
                      {post.tags.slice(0, 2).map((tag) => (
                        <li key={tag} className="chip">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {posts.length < MAX_POSTS && (
          <p className="recent-posts-note">
            {i18n.language === 'en'
              ? t('home.recentPosts.enShortNote')
              : t('home.recentPosts.trOnlyNote')}
          </p>
        )}
      </div>
    </section>
  );
};

export default RecentPosts;
