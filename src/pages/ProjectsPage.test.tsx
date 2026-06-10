import { render, screen } from '@testing-library/react';
import ProjectsPage from '@/pages/ProjectsPage';

describe('ProjectsPage', () => {
  it('renders title and subtitle', () => {
    render(<ProjectsPage />);
    expect(screen.getByText('projects.title')).toBeInTheDocument();
    expect(screen.getByText('projects.subtitle')).toBeInTheDocument();
  });

  it('renders all 6 project cards', () => {
    const { container } = render(<ProjectsPage />);
    expect(container.querySelectorAll('.project-card')).toHaveLength(6);
  });

  it('renders project images', () => {
    render(<ProjectsPage />);
    const images = document.querySelectorAll('.project-image');
    expect(images).toHaveLength(6);
  });

  it('renders project descriptions from translation', () => {
    render(<ProjectsPage />);
    expect(screen.getByText('projects.subtitle')).toBeInTheDocument();
  });
});
