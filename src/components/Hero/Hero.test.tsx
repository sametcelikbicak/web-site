import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero/Hero';

describe('Hero', () => {
  it('renders title and subtitle', () => {
    render(<Hero />);
    expect(screen.getByText('hero.title')).toBeInTheDocument();
    expect(screen.getByText('hero.subtitle')).toBeInTheDocument();
  });

  it('renders the caricature image', () => {
    render(<Hero />);
    const img = screen.getByAltText('Samet Çelikbıçak');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/sc_caricature.webp');
    expect(img).toHaveAttribute('width', '500');
    expect(img).toHaveAttribute('height', '750');
  });

  it('renders children when provided', () => {
    render(
      <Hero>
        <div data-testid="child" />
      </Hero>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders without children', () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('.hero-content')).toBeInTheDocument();
  });

  it('computes experience years correctly and passes to subtitle', () => {
    render(<Hero />);
    const currentYear = new Date().getFullYear();
    const expectedYears = currentYear - 2007;
    expect(screen.getByText('hero.subtitle')).toBeInTheDocument();
    expect(expectedYears).toBeGreaterThan(0);
  });
});
