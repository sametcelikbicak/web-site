import { render, screen } from '@testing-library/react';
import StatsSection from '@/components/StatsSection/StatsSection';

describe('StatsSection', () => {
  it('renders all 4 stats', () => {
    const { container } = render(<StatsSection />);
    expect(container.querySelectorAll('.stat-item')).toHaveLength(4);
  });

  it('renders experience stat with computed years', () => {
    render(<StatsSection />);
    const currentYear = new Date().getFullYear();
    const expectedYears = currentYear - 2007;
    expect(screen.getByText(`${expectedYears}+`)).toBeInTheDocument();
  });

  it('renders static stats', () => {
    render(<StatsSection />);
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('20+')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders labels from translation keys', () => {
    render(<StatsSection />);
    expect(screen.getByText('stats.experience')).toBeInTheDocument();
    expect(screen.getByText('stats.projects')).toBeInTheDocument();
    expect(screen.getByText('stats.stack')).toBeInTheDocument();
    expect(screen.getByText('stats.satisfaction')).toBeInTheDocument();
  });
});
