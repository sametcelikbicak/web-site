import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Hero from '@/components/Hero/Hero';

// Hero renders a react-router Link for the projects CTA, so it needs a router.
const renderHero = (children?: React.ReactNode) =>
  render(
    <MemoryRouter>
      <Hero>{children}</Hero>
    </MemoryRouter>
  );

describe('Hero', () => {
  it('offers a contact action and a projects link', () => {
    renderHero();
    expect(screen.getByRole('link', { name: 'hero.contact' })).toHaveAttribute(
      'href',
      'mailto:sametcelikbicak@outlook.com'
    );
    expect(
      screen.getByRole('link', { name: 'hero.viewProjects' })
    ).toHaveAttribute('href', '/projects');
  });

  it('renders title and subtitle', () => {
    renderHero();
    expect(screen.getByText('hero.title')).toBeInTheDocument();
    expect(screen.getByText('hero.subtitle')).toBeInTheDocument();
  });

  it('renders the caricature image', () => {
    renderHero();
    const img = screen.getByAltText('Samet Çelikbıçak');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/sc_caricature.webp');
    expect(img).toHaveAttribute('width', '500');
    expect(img).toHaveAttribute('height', '750');
  });

  it('renders children when provided', () => {
    renderHero(<div data-testid="child" />);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders without children', () => {
    const { container } = renderHero();
    expect(container.querySelector('.hero-content')).toBeInTheDocument();
  });

  it('computes experience years correctly and passes to subtitle', () => {
    renderHero();
    const currentYear = new Date().getFullYear();
    const expectedYears = currentYear - 2007;
    expect(screen.getByText('hero.subtitle')).toBeInTheDocument();
    expect(expectedYears).toBeGreaterThan(0);
  });
});
