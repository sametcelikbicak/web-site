import './HomePageSkeleton.css';

/**
 * Skeleton that exactly mirrors the HomePage hero layout.
 * Shown as the Suspense fallback while the lazy HomePage chunk loads,
 * preventing the layout flash / CLS between spinner → two-column layout.
 */
const HomePageSkeleton = () => (
  <div className="home-page">
    <div className="home-hero-stats">
      {/* Mirrors <section className="hero-section section-gap"> */}
      <section className="hero-section section-gap">
        {/* Mirrors <div className="page-container hero-container"> */}
        <div className="page-container hero-container">
          {/* Left column — text + stats */}
          <div className="skeleton-hero-content">
            {/* Title: two lines */}
            <div
              className="skeleton-block skeleton-title-line"
              aria-hidden="true"
            />
            <div
              className="skeleton-block skeleton-title-line skeleton-title-line--short"
              aria-hidden="true"
            />

            {/* Subtitle: two lines */}
            <div className="skeleton-subtitle-group">
              <div
                className="skeleton-block skeleton-subtitle-line"
                aria-hidden="true"
              />
              <div
                className="skeleton-block skeleton-subtitle-line skeleton-subtitle-line--short"
                aria-hidden="true"
              />
            </div>

            {/* Stats grid: 4 items */}
            <div className="skeleton-stats-grid" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton-stat-item">
                  <div className="skeleton-block skeleton-stat-value" />
                  <div className="skeleton-block skeleton-stat-label" />
                </div>
              ))}
            </div>
          </div>

          {/* Right column — image placeholder */}
          <div className="skeleton-block skeleton-image" aria-hidden="true" />
        </div>
      </section>
    </div>
  </div>
);

export default HomePageSkeleton;
