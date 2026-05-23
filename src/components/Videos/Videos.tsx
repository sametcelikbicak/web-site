import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAnalytics from '@/hooks/useAnalytics';

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@sametcelikbicak';
const YOUTUBE_CHANNEL_ID = 'UCS_Lum6iidluJodda7T7WKA';
const YOUTUBE_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
const YOUTUBE_FEED_PROXY_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
  YOUTUBE_FEED_URL
)}`;

type FeedItem = {
  guid?: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  title: string;
};

type FeedResponse = {
  items?: FeedItem[];
  status?: string;
};

type VideoItem = {
  id: string;
  isShort: boolean;
  link: string;
  publishedAt: string;
  thumbnail: string;
  title: string;
};

const getVideoId = (item: FeedItem) => {
  if (item.guid?.startsWith('yt:video:')) {
    return item.guid.replace('yt:video:', '');
  }

  const shortsMatch = item.link.match(/shorts\/([^?&/]+)/);
  if (shortsMatch) {
    return shortsMatch[1];
  }

  const watchMatch = item.link.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    return watchMatch[1];
  }

  return item.link;
};

const formatPublishedDate = (value: string, locale: string) =>
  new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

const Videos = () => {
  const { t, i18n } = useTranslation();
  const { trackButtonClick, trackSectionView } = useAnalytics();
  const [items, setItems] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    trackSectionView('videos');
  }, [trackSectionView]);

  useEffect(() => {
    let cancelled = false;

    const loadVideos = async () => {
      try {
        setLoading(true);
        setHasError(false);

        const response = await fetch(YOUTUBE_FEED_PROXY_URL);
        if (!response.ok) {
          throw new Error(`Feed request failed with ${response.status}`);
        }

        const data = (await response.json()) as FeedResponse;
        if (data.status !== 'ok' || !data.items) {
          throw new Error('Unexpected feed response');
        }

        const mappedItems = data.items.map((item) => ({
          id: getVideoId(item),
          isShort: item.link.includes('/shorts/'),
          link: item.link,
          publishedAt: item.pubDate,
          thumbnail: item.thumbnail,
          title: item.title,
        }));

        if (!cancelled) {
          setItems(mappedItems);
        }
      } catch (_error) {
        if (!cancelled) {
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadVideos();

    return () => {
      cancelled = true;
    };
  }, []);

  const featuredVideos = useMemo(
    () => items.filter((item) => !item.isShort).slice(0, 3),
    [items]
  );

  const shorts = useMemo(() => items.filter((item) => item.isShort), [items]);

  const openLink = (link: string, analyticsKey: string) => {
    trackButtonClick(analyticsKey);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="scroll-mt-20 text-left" id="videos">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div className="max-w-2xl">
          <h2 className="text-text-primary text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
            {t('videos.title')}
          </h2>
          <p className="text-text-secondary text-sm sm:text-base mt-2 leading-relaxed">
            {t('videos.description')}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm sm:text-base font-semibold bg-(--primary-color) text-white cursor-pointer transition-opacity hover:opacity-90"
          onClick={() => openLink(YOUTUBE_CHANNEL_URL, 'youtube-view-more')}
        >
          {t('videos.viewMore')}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="rounded-lg overflow-hidden border border-(--header-border) animate-pulse"
            >
              <div className="aspect-video bg-black/10 dark:bg-white/10" />
              <div className="p-4 space-y-3">
                <div className="h-4 rounded bg-black/10 dark:bg-white/10" />
                <div className="h-3 w-1/3 rounded bg-black/10 dark:bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      ) : hasError ? (
        <div className="rounded-lg border border-(--header-border) p-6 flex flex-col gap-4">
          <p className="text-text-secondary text-sm sm:text-base">
            {t('videos.error')}
          </p>
          <div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold bg-(--primary-color) text-white cursor-pointer transition-opacity hover:opacity-90"
              onClick={() =>
                openLink(YOUTUBE_CHANNEL_URL, 'youtube-open-channel')
              }
            >
              {t('videos.openChannel')}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredVideos.map((video) => (
              <button
                key={video.id}
                type="button"
                className="text-left rounded-lg overflow-hidden border border-(--header-border) main-bg cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                onClick={() => openLink(video.link, `youtube-${video.id}`)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                />
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-text-primary text-base sm:text-lg font-semibold leading-snug">
                    {video.title}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {formatPublishedDate(video.publishedAt, i18n.language)}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {shorts.length > 0 && (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-text-primary text-xl font-semibold">
                  {t('videos.shortsTitle')}
                </h3>
                <p className="text-text-secondary text-sm sm:text-base mt-1">
                  {t('videos.shortsDescription')}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shorts.map((video) => (
                  <button
                    key={video.id}
                    type="button"
                    className="text-left rounded-lg overflow-hidden border border-(--header-border) main-bg cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                    onClick={() =>
                      openLink(video.link, `youtube-short-${video.id}`)
                    }
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full aspect-[9/16] object-cover"
                      loading="lazy"
                    />
                    <div className="p-4 flex flex-col gap-2">
                      <p className="text-text-primary text-base font-semibold leading-snug">
                        {video.title}
                      </p>
                      <p className="text-text-secondary text-sm">
                        {formatPublishedDate(video.publishedAt, i18n.language)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Videos;
