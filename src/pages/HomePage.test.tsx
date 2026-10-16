import { render, screen } from '@testing-library/react';
import HomePage from '@/pages/HomePage';

jest.mock('@/components/Hero/Hero', () => {
  return ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="hero">{children}</div>
  );
});
jest.mock('@/components/StatsSection/StatsSection', () => () => (
  <div data-testid="stats" />
));
jest.mock('@/components/ExpertiseCards/ExpertiseCards', () => () => (
  <div data-testid="expertise" />
));
jest.mock('@/components/RecentPosts/RecentPosts', () => () => (
  <div data-testid="recent-posts" />
));

describe('HomePage', () => {
  it('renders hero, stats, expertise and recent posts', () => {
    render(<HomePage />);
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('stats')).toBeInTheDocument();
    expect(screen.getByTestId('expertise')).toBeInTheDocument();
    expect(screen.getByTestId('recent-posts')).toBeInTheDocument();
  });

  it('separates the three sections with dividers', () => {
    const { container } = render(<HomePage />);
    // Two dividers: one before ExpertiseCards, one before RecentPosts.
    expect(container.querySelectorAll('.divider')).toHaveLength(2);
  });
});
