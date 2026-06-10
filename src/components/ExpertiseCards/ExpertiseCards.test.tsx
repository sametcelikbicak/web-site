import { render, screen } from '@testing-library/react';
import ExpertiseCards from '@/components/ExpertiseCards/ExpertiseCards';

describe('ExpertiseCards', () => {
  it('renders section label', () => {
    render(<ExpertiseCards />);
    expect(screen.getByText('expertise.label')).toBeInTheDocument();
  });

  it('renders 4 expertise cards', () => {
    const { container } = render(<ExpertiseCards />);
    expect(container.querySelectorAll('.expertise-card')).toHaveLength(4);
  });

  it('renders expertise titles from translation keys', () => {
    render(<ExpertiseCards />);
    expect(screen.getByText('expertise.frontend.title')).toBeInTheDocument();
    expect(
      screen.getByText('expertise.architecture.title')
    ).toBeInTheDocument();
    expect(screen.getByText('expertise.performance.title')).toBeInTheDocument();
    expect(screen.getByText('expertise.leadership.title')).toBeInTheDocument();
  });

  it('renders expertise descriptions from translation keys', () => {
    render(<ExpertiseCards />);
    expect(screen.getByText('expertise.frontend.desc')).toBeInTheDocument();
  });

  it('has section-gap class on the section', () => {
    const { container } = render(<ExpertiseCards />);
    const section = container.querySelector('.expertise-section');
    expect(section?.className).toContain('section-gap');
  });
});
