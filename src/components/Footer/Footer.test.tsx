import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '@/components/Footer/Footer';

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

describe('Footer', () => {
  it('exposes a site map so every page is reachable from every page', () => {
    renderFooter();
    const nav = screen.getByRole('navigation', {
      name: 'footer.siteNavigation',
    });
    const links = within(nav).getAllByRole('link');

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/',
      '/about',
      '/experience',
      '/education',
      '/skills',
      '/projects',
      '/blog',
    ]);
  });

  it('lists the site map as a list, not a bare run of anchors', () => {
    renderFooter();
    const nav = screen.getByRole('navigation', {
      name: 'footer.siteNavigation',
    });
    expect(within(nav).getByRole('list')).toBeInTheDocument();
    expect(within(nav).getAllByRole('listitem')).toHaveLength(7);
  });

  it('keeps the social links and the copyright', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
    expect(screen.getByText(/footer.copyright/)).toBeInTheDocument();
  });
});
