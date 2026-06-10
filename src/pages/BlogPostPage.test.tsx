import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BlogPostPage from '@/pages/BlogPostPage';

const mockGetBlogPostBySlug = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@/services/blog', () => ({
  getBlogPostBySlug: (...args: unknown[]) => mockGetBlogPostBySlug(...args),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-markdown to call custom component renderers
const mockComponentRenderers: Record<string, jest.Mock> = {};
jest.mock('react-markdown', () => {
  const MockReactMarkdown = ({
    children,
    components,
  }: {
    children: string;
    components?: {
      a?: (props: {
        href?: string;
        children: React.ReactNode;
      }) => React.ReactNode;
    };
  }) => {
    if (components?.a) {
      mockComponentRenderers.a = jest.fn(components.a);
    }
    return <div data-testid="markdown">{children}</div>;
  };
  return MockReactMarkdown;
});
jest.mock('rehype-highlight', () => () => {});
jest.mock('remark-gfm', () => () => {});

beforeEach(() => {
  jest.clearAllMocks();
  for (const k of Object.keys(mockComponentRenderers)) {
    delete mockComponentRenderers[k];
  }
});

const renderAtRoute = (slug: string) =>
  render(
    <MemoryRouter initialEntries={[`/blog/${slug}`]}>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/blog" element={<div data-testid="blog-list" />} />
      </Routes>
    </MemoryRouter>
  );

const createPost = (overrides: Record<string, unknown> = {}) => ({
  slug: 'test-post',
  title: 'Test Post Title',
  date: '2024-06-15',
  description: 'A test post',
  content: '# Hello\nThis is content.',
  tags: ['react', 'testing'],
  lang: 'en',
  ...overrides,
});

describe('BlogPostPage', () => {
  it('handles missing slug gracefully', () => {
    mockGetBlogPostBySlug.mockReturnValue(undefined);
    render(
      <MemoryRouter initialEntries={['/blog']}>
        <Routes>
          <Route path="/blog" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to /blog when post not found', () => {
    mockGetBlogPostBySlug.mockReturnValue(undefined);
    renderAtRoute('non-existent');
    expect(mockNavigate).toHaveBeenCalledWith('/blog');
  });

  it('renders post title when found', () => {
    mockGetBlogPostBySlug.mockReturnValue(createPost());
    renderAtRoute('test-post');
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('renders post tags when found', () => {
    mockGetBlogPostBySlug.mockReturnValue(createPost());
    renderAtRoute('test-post');
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
  });

  it('renders back button in footer', () => {
    mockGetBlogPostBySlug.mockReturnValue(createPost());
    renderAtRoute('test-post');
    expect(
      screen.getByText("Blog'a Dön", { exact: false })
    ).toBeInTheDocument();
  });

  it('navigates back from post view', () => {
    mockGetBlogPostBySlug.mockReturnValue(createPost());
    renderAtRoute('test-post');
    fireEvent.click(screen.getByText("Blog'a Dön", { exact: false }));
    expect(mockNavigate).toHaveBeenCalledWith('/blog');
  });

  it('renders markdown content area', () => {
    mockGetBlogPostBySlug.mockReturnValue(createPost());
    renderAtRoute('test-post');
    expect(document.querySelector('.post-content')).toBeInTheDocument();
  });

  it('formats date using locale', () => {
    mockGetBlogPostBySlug.mockReturnValue(createPost({ tags: [] }));
    renderAtRoute('test-post');
    const timeEl = document.querySelector('.post-header time');
    expect(timeEl).toBeInTheDocument();
  });

  it('renders tags section only when tags exist', () => {
    mockGetBlogPostBySlug.mockReturnValue(createPost({ tags: undefined }));
    renderAtRoute('test-post');
    expect(document.querySelector('.post-tags')).not.toBeInTheDocument();
  });

  describe('YouTube embed', () => {
    it('renders iframe for youtube.com/watch links', () => {
      mockGetBlogPostBySlug.mockReturnValue(
        createPost({
          content: '[video](https://www.youtube.com/watch?v=dQw4w9WgXcQ)',
        })
      );
      renderAtRoute('test-youtube');

      const renderer = mockComponentRenderers.a;
      expect(renderer).toBeDefined();

      const result = renderer({
        href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        children: 'video',
      });

      const { container } = render(result);
      expect(container.querySelector('iframe')).toBeInTheDocument();
      expect(container.querySelector('iframe')).toHaveAttribute(
        'src',
        'https://www.youtube.com/embed/dQw4w9WgXcQ'
      );
    });

    it('renders iframe for youtu.be links', () => {
      mockGetBlogPostBySlug.mockReturnValue(
        createPost({ content: '[video](https://youtu.be/dQw4w9WgXcQ)' })
      );
      renderAtRoute('test-youtube');

      const renderer = mockComponentRenderers.a;
      const result = renderer({
        href: 'https://youtu.be/dQw4w9WgXcQ',
        children: 'video',
      });

      const { container } = render(result);
      expect(container.querySelector('iframe')).toBeInTheDocument();
      expect(container.querySelector('iframe')).toHaveAttribute(
        'src',
        'https://www.youtube.com/embed/dQw4w9WgXcQ'
      );
    });

    it('renders regular anchor for non-YouTube links', () => {
      mockGetBlogPostBySlug.mockReturnValue(
        createPost({ content: '[link](https://example.com)' })
      );
      renderAtRoute('test-youtube');

      const renderer = mockComponentRenderers.a;
      const result = renderer({
        href: 'https://example.com',
        children: 'link',
      });

      const { container } = render(result);
      expect(container.querySelector('a')).toBeInTheDocument();
      expect(container.querySelector('iframe')).not.toBeInTheDocument();
    });

    it('renders regular anchor when video ID cannot be extracted', () => {
      mockGetBlogPostBySlug.mockReturnValue(
        createPost({ content: '[link](https://youtu.be/)' })
      );
      renderAtRoute('test-youtube');

      const renderer = mockComponentRenderers.a;
      const result = renderer({
        href: 'https://youtu.be/',
        children: 'link',
      });

      const { container } = render(result);
      expect(container.querySelector('a')).toBeInTheDocument();
      expect(container.querySelector('iframe')).not.toBeInTheDocument();
    });
  });
});
