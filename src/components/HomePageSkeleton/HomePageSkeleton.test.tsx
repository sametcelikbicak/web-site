import { render } from '@testing-library/react';
import HomePageSkeleton from '@/components/HomePageSkeleton/HomePageSkeleton';

describe('HomePageSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<HomePageSkeleton />);
    expect(container.querySelector('.home-page')).toBeInTheDocument();
  });

  it('renders 4 skeleton stat items', () => {
    const { container } = render(<HomePageSkeleton />);
    expect(container.querySelectorAll('.skeleton-stat-item')).toHaveLength(4);
  });

  it('renders skeleton image placeholder', () => {
    const { container } = render(<HomePageSkeleton />);
    expect(container.querySelector('.skeleton-image')).toBeInTheDocument();
  });

  it('renders skeleton title lines', () => {
    const { container } = render(<HomePageSkeleton />);
    expect(container.querySelector('.skeleton-title-line')).toBeInTheDocument();
  });

  it('renders skeleton subtitle group', () => {
    const { container } = render(<HomePageSkeleton />);
    expect(
      container.querySelector('.skeleton-subtitle-group')
    ).toBeInTheDocument();
  });
});
