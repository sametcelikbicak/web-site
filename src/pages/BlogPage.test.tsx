import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BlogPage from '@/pages/BlogPage';

const mockGetBlogPosts = jest.fn();

jest.mock('@/services/blog', () => ({
  getBlogPosts: (...args: unknown[]) => mockGetBlogPosts(...args),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
  };
});

beforeAll(() => {
  jest.spyOn(window, 'scrollTo').mockImplementation();
});

beforeEach(() => {
  jest.clearAllMocks();
});

const mockPosts = Array.from({ length: 8 }, (_, i) => ({
  slug: `post-${i + 1}`,
  title: `Post ${i + 1}`,
  date: `2024-0${(i % 9) + 1}-15`,
  description: `Description ${i + 1}`,
  content: `Content ${i + 1}`,
  tags: i % 2 === 0 ? ['tag1', 'tag2'] : undefined,
  lang: 'en',
  image: i === 0 ? '/image.jpg' : undefined,
}));

describe('BlogPage', () => {
  it('renders title and subtitle with default values', () => {
    mockGetBlogPosts.mockReturnValue([]);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Teknoloji, tasarım ve yazılım geliştirme üzerine düşüncelerim.'
      )
    ).toBeInTheDocument();
  });

  it('renders list view toggle as active by default', () => {
    mockGetBlogPosts.mockReturnValue([]);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    const listBtn = screen.getByLabelText('List view');
    expect(listBtn.className).toContain('active');
  });

  it('switches to grid view', () => {
    mockGetBlogPosts.mockReturnValue(mockPosts);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByLabelText('Grid view'));
    expect(screen.getByLabelText('Grid view').className).toContain('active');
    expect(screen.getByLabelText('List view').className).not.toContain(
      'active'
    );
  });

  it('renders paginated posts (6 per page)', () => {
    mockGetBlogPosts.mockReturnValue(mockPosts);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    expect(screen.getAllByText(/Post \d+/)).toHaveLength(6);
  });

  it('renders pagination when there are multiple pages', () => {
    mockGetBlogPosts.mockReturnValue(mockPosts);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    expect(screen.getByText('Önceki', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Sonraki', { exact: false })).toBeInTheDocument();
  });

  it('disables prev button on first page', () => {
    mockGetBlogPosts.mockReturnValue(mockPosts);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    expect(screen.getByText('Önceki', { exact: false })).toBeDisabled();
  });

  it('navigates to next page', () => {
    mockGetBlogPosts.mockReturnValue(mockPosts);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Sonraki', { exact: false }));
    const page2Posts = screen.getAllByText(/Post \d+/);
    expect(page2Posts).toHaveLength(2);
  });

  it('navigates to previous page', () => {
    mockGetBlogPosts.mockReturnValue(mockPosts);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('Sonraki', { exact: false }));
    fireEvent.click(screen.getByText('Önceki', { exact: false }));
    const page1Posts = screen.getAllByText(/Post \d+/);
    expect(page1Posts).toHaveLength(6);
  });

  it('navigates to page by number', () => {
    mockGetBlogPosts.mockReturnValue(mockPosts);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('2'));
    const page2Posts = screen.getAllByText(/Post \d+/);
    expect(page2Posts).toHaveLength(2);
  });

  it('list view button click sets view to list', () => {
    mockGetBlogPosts.mockReturnValue(mockPosts);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByLabelText('Grid view'));
    fireEvent.click(screen.getByLabelText('List view'));
    expect(screen.getByLabelText('List view').className).toContain('active');
  });

  it('disables next button on last page', () => {
    mockGetBlogPosts.mockReturnValue(mockPosts);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText('2'));
    expect(screen.getByText('Sonraki', { exact: false })).toBeDisabled();
  });

  it('does not render pagination when posts fit on one page', () => {
    mockGetBlogPosts.mockReturnValue(mockPosts.slice(0, 3));
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    expect(
      screen.queryByText('Önceki', { exact: false })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Sonraki', { exact: false })
    ).not.toBeInTheDocument();
  });

  it('renders post image when available', () => {
    mockGetBlogPosts.mockReturnValue(mockPosts.slice(0, 1));
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    expect(document.querySelector('.post-image')).toBeInTheDocument();
  });

  it('renders image placeholder when no image', () => {
    mockGetBlogPosts.mockReturnValue([mockPosts[1]]);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    expect(
      document.querySelector('.post-image-placeholder')
    ).toBeInTheDocument();
  });

  it('renders tags when present', () => {
    mockGetBlogPosts.mockReturnValue([mockPosts[0]]);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    expect(document.querySelector('.post-tags')).toBeInTheDocument();
  });

  it('does not render tags section when no tags', () => {
    mockGetBlogPosts.mockReturnValue([mockPosts[1]]);
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    expect(document.querySelector('.post-tags')).not.toBeInTheDocument();
  });

  it('formats date using locale', () => {
    mockGetBlogPosts.mockReturnValue(mockPosts.slice(0, 1));
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    const timeEl = document.querySelector('.post-meta time');
    expect(timeEl).toBeInTheDocument();
  });
});
