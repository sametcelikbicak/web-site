import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SkillsPage from '@/pages/SkillsPage';

describe('SkillsPage', () => {
  it('renders title and subtitle', () => {
    render(<SkillsPage />);
    expect(screen.getByText('skills.title')).toBeInTheDocument();
    expect(screen.getByText('skills.subtitle')).toBeInTheDocument();
  });

  it('renders 3 skill categories', () => {
    const { container } = render(<SkillsPage />);
    expect(container.querySelectorAll('.skill-category')).toHaveLength(3);
  });

  it('renders skill cards with icon wrappers', () => {
    const { container } = render(<SkillsPage />);
    expect(container.querySelectorAll('.skill-card').length).toBeGreaterThan(0);
    expect(
      container.querySelectorAll('.skill-icon-wrapper').length
    ).toBeGreaterThan(0);
  });

  it('renders skill names', () => {
    render(<SkillsPage />);
    expect(screen.getByText('Angular')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });
});
