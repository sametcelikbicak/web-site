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

describe('HomePage', () => {
  it('renders hero, stats, and expertise', () => {
    render(<HomePage />);
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('stats')).toBeInTheDocument();
    expect(screen.getByTestId('expertise')).toBeInTheDocument();
  });

  it('renders divider', () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector('.divider')).toBeInTheDocument();
  });
});
