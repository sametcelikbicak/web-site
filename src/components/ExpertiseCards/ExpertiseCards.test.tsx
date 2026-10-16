import { render, screen } from '@testing-library/react';
import ExpertiseCards from '@/components/ExpertiseCards/ExpertiseCards';

describe('ExpertiseCards', () => {
  it('renders section label', () => {
    render(<ExpertiseCards />);
    expect(screen.getByText('EXPERTISE')).toBeInTheDocument();
  });

  it('renders 4 expertise cards', () => {
    const { container } = render(<ExpertiseCards />);
    expect(container.querySelectorAll('.expertise-card')).toHaveLength(4);
  });

  it('renders expertise titles from translation keys', () => {
    render(<ExpertiseCards />);
    expect(screen.getByText('Frontend & UI')).toBeInTheDocument();
    expect(screen.getByText('System Architecture')).toBeInTheDocument();
    expect(screen.getByText('Performance Optimization')).toBeInTheDocument();
    expect(screen.getByText('Technical Leadership')).toBeInTheDocument();
  });

  it('renders expertise descriptions from translation keys', () => {
    render(<ExpertiseCards />);
    expect(
      screen.getByText(/Crafting responsive, accessible,/)
    ).toBeInTheDocument();
  });

  it('has section-gap class on the section', () => {
    const { container } = render(<ExpertiseCards />);
    const section = container.querySelector('.expertise-section');
    expect(section?.className).toContain('section-gap');
  });
});
