import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ExperiencePage from '@/pages/ExperiencePage';

describe('ExperiencePage', () => {
  it('renders title and subtitle', () => {
    render(<ExperiencePage />);
    expect(screen.getByText('experience.title')).toBeInTheDocument();
    expect(screen.getByText('experience.subtitle')).toBeInTheDocument();
  });

  it('renders all experience entries', () => {
    const { container } = render(<ExperiencePage />);
    expect(container.querySelectorAll('.experience-row')).toHaveLength(6);
  });

  it('renders timeline dot for each entry', () => {
    const { container } = render(<ExperiencePage />);
    expect(container.querySelectorAll('.timeline-dot')).toHaveLength(6);
  });

  it('renders first dot with first-dot class', () => {
    const { container } = render(<ExperiencePage />);
    const firstDotWrapper = container.querySelector('.timeline-dot-wrapper');
    expect(firstDotWrapper?.className).toContain('first-dot');
  });

  it('alternates row layout', () => {
    const { container } = render(<ExperiencePage />);
    const rows = container.querySelectorAll('.experience-row');
    expect(rows[0].className).toContain('row-normal');
    expect(rows[1].className).toContain('row-reverse');
  });

  it('renders tech stack card with icon', () => {
    const { container } = render(<ExperiencePage />);
    expect(
      container.querySelector('.experience-info-card')
    ).toBeInTheDocument();
    expect(container.querySelector('.icon-primary')).toBeInTheDocument();
  });
});
