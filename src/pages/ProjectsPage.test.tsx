import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ProjectsPage from '@/pages/ProjectsPage';

describe('ProjectsPage', () => {
  it('renders title and subtitle', () => {
    render(<ProjectsPage />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(
      screen.getByText(/My contributions to the open-sou/)
    ).toBeInTheDocument();
  });

  it('renders all 10 project cards', () => {
    const { container } = render(<ProjectsPage />);
    expect(container.querySelectorAll('.project-card')).toHaveLength(10);
  });

  it('renders project images', () => {
    render(<ProjectsPage />);
    const images = document.querySelectorAll('.project-image');
    expect(images).toHaveLength(10);
  });

  it('serves local optimized images with priority loading', () => {
    render(<ProjectsPage />);
    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>('.project-image')
    );

    expect(images).toHaveLength(10);
    expect(
      images.every((image) =>
        image.getAttribute('src')?.startsWith('/projects/')
      )
    ).toBe(true);
    expect(images[0]).toHaveAttribute('loading', 'eager');
    expect(images[0]).toHaveAttribute('fetchpriority', 'high');
    expect(
      images.slice(1).every((image) => image.getAttribute('loading') === 'lazy')
    ).toBe(true);
    expect(
      images.every((image) => image.getAttribute('decoding') === 'async')
    ).toBe(true);
  });

  it('renders project descriptions from translation', () => {
    render(<ProjectsPage />);
    expect(
      screen.getByText(/My contributions to the open-sou/)
    ).toBeInTheDocument();
  });
});
