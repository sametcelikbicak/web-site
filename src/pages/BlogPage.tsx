import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getPostSummaries } from '@/services/post-index';
import './BlogPage.css';
import ViewGridIcon from '@/components/Icons/ViewGridIcon';
import ViewListIcon from '@/components/Icons/ViewListIcon';

const BlogPage = () => {
  const { t, i18n } = useTranslation();
  const [viewType, setViewType] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const allPosts = getPostSummaries(i18n.language);
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="blog-page page-container section-gap">
      <div className="blog-header">
        <div className="blog-header-content">
          <h1 className="blog-title">
            {t('blog.title', { defaultValue: 'Blog' })}
          </h1>
          <p className="blog-subtitle">
            {t('blog.subtitle', {
              defaultValue:
                'Teknoloji, tasarım ve yazılım geliştirme üzerine düşüncelerim.',
            })}
          </p>
        </div>
        <div className="blog-view-toggle">
          <button
            type="button"
            className={`view-btn ${viewType === 'list' ? 'active' : ''}`}
            onClick={() => setViewType('list')}
            aria-label="List view"
          >
            <ViewListIcon />
          </button>
          <button
            type="button"
            className={`view-btn ${viewType === 'grid' ? 'active' : ''}`}
            onClick={() => setViewType('grid')}
            aria-label="Grid view"
          >
            <ViewGridIcon />
          </button>
        </div>
      </div>

      <div className={`blog-content ${viewType}-view`}>
        {currentPosts.map((post) => (
          <article
            key={post.slug}
            className={`blog-item ${viewType === 'grid' ? 'card' : ''}`}
          >
            <Link to={`/blog/${post.slug}`} className="blog-item-link">
              <div className="post-image-container">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="post-image"
                    width={1200}
                    height={675}
                    loading="lazy"
                  />
                ) : (
                  <div className="post-image-placeholder" />
                )}
              </div>
              <div className="post-content-wrapper">
                <div className="post-meta">
                  <time>
                    {new Date(post.date).toLocaleDateString(i18n.language)}
                  </time>
                </div>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-description">{post.description}</p>
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
            </Link>
          </article>
        ))}
      </div>

      {/* Show the note whenever posts in the active language are fewer than one
          page — Turkish visitors always see one English post, so the note would
          only confuse them. */}
      {allPosts.length < postsPerPage && (
        <p className="blog-language-note">
          {i18n.language === 'en'
            ? t('home.recentPosts.enShortNote')
            : t('home.recentPosts.trOnlyNote')}
        </p>
      )}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            &larr; {t('blog.prev', { defaultValue: 'Önceki' })}
          </button>

          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  type="button"
                  className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
          >
            {t('blog.next', { defaultValue: 'Sonraki' })} &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
