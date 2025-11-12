import { render } from '@testing-library/react';
import Footer from '@/components/Footer/Footer';

beforeAll(() => {
  class MockIntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  global.IntersectionObserver = MockIntersectionObserver;
});

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
  });
});
