import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RecentPosts from '@/components/RecentPosts/RecentPosts';
import type { BlogPost } from '@/services/blog';

const mockGetBlogPosts = jest.fn();
const language = 'tr';

jest.mock('@/services/blog', () => ({
  getBlogPosts: (...args: unknown[]) => mockGetBlogPosts(...args),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language },
  }),
}));

const post = (slug: string, date: string): BlogPost => ({
  slug,
  title: `Title ${slug}`,
  date,
  description: `Description ${slug}`,
  content: '',
  tags: ['TypeScript', 'Angular', 'React'],
  lang: language,
});

const renderSection = () =>
  render(
    <MemoryRouter>
      <RecentPosts />
    </MemoryRouter>
  );

beforeEach(() => {
  mockGetBlogPosts.mockReset();
  mockGetBlogPosts.mockReturnValue([
    post('a', '2024-01-01'),
    post('b', '2024-02-01'),
    post('c', '2024-03-01'),
    post('d', '2024-04-01'),
    post('e', '2024-05-01'),
  ]);
});

describe('RecentPosts', () => {
  it('shows at most four posts', () => {
    const { container } = renderSection();
    expect(container.querySelectorAll('.recent-post')).toHaveLength(4);
  });

  it('links each card to its post with the title as the accessible name', () => {
    renderSection();
    expect(screen.getByRole('link', { name: 'Title a' })).toHaveAttribute(
      'href',
      '/blog/a'
    );
  });

  it('always renders the heading, so the outline does not change with language', () => {
    mockGetBlogPosts.mockReturnValue([]);
    renderSection();
    expect(
      screen.getByRole('heading', { name: 'home.recentPosts.title' })
    ).toBeInTheDocument();
  });

  it('notes the shortfall instead of padding with another language', () => {
    // English currently has one post; the section must say so rather than
    // linking a Turkish-only slug that BlogPostPage would redirect away.
    mockGetBlogPosts.mockReturnValue([post('solo', '2026-06-05')]);
    renderSection();
    expect(screen.getByText('home.recentPosts.trOnlyNote')).toBeInTheDocument();
  });

  it('omits the note when the language has four posts', () => {
    renderSection();
    expect(
      screen.queryByText('home.recentPosts.trOnlyNote')
    ).not.toBeInTheDocument();
  });

  it('shows at most two tags per card', () => {
    renderSection();
    const card = screen.getByRole('link', { name: 'Title a' });
    expect(within(card).getAllByRole('listitem')).toHaveLength(2);
  });

  it('keeps a link to the full index', () => {
    renderSection();
    expect(
      screen.getByRole('link', { name: 'home.recentPosts.viewAll' })
    ).toHaveAttribute('href', '/blog');
  });
});
