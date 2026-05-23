import { render, screen, waitFor } from '@testing-library/react';
import Videos from '@/components/Videos/Videos';

beforeAll(() => {
  class MockIntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }

  global.IntersectionObserver = MockIntersectionObserver;
});

describe('Videos', () => {
  it('renders latest videos from the feed', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'ok',
        items: [
          {
            guid: 'yt:video:video-1',
            link: 'https://www.youtube.com/watch?v=video-1',
            pubDate: '2026-04-26 19:20:16',
            thumbnail: 'https://i1.ytimg.com/vi/video-1/hqdefault.jpg',
            title: 'Latest Video',
          },
          {
            guid: 'yt:video:short-1',
            link: 'https://www.youtube.com/shorts/short-1',
            pubDate: '2026-04-18 18:23:53',
            thumbnail: 'https://i1.ytimg.com/vi/short-1/hqdefault.jpg',
            title: 'Latest Short',
          },
        ],
      }),
    }) as jest.Mock;

    render(<Videos />);

    await waitFor(() => {
      expect(screen.getByText('Latest Video')).toBeTruthy();
    });

    expect(screen.getByText('Latest Short')).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'videos.viewMore' })
    ).toBeTruthy();
  });
});
